/*
 * Demo accounts, orders and user reviews — stored only in this browser's localStorage.
 * There is no real authentication backend; passwords are SHA-256 hashed before storage
 * so they are never kept in plain text, but this is not a secure login system.
 */
import { createLocalStore } from "@/lib/local-store"
import type { Review } from "@/lib/reviews"

export type Address = {
  id: string
  label: string
  firstName: string
  lastName: string
  line1: string
  line2?: string
  city: string
  postcode: string
  phone?: string
  isDefault: boolean
}

export type User = {
  email: string
  firstName: string
  lastName: string
  phone?: string
  bike?: string
  marketing: boolean
  passwordHash: string
  createdAt: string
  addresses: Address[]
}

export type OrderLine = {
  slug: string
  name: string
  image: string
  price: number
  quantity: number
  size?: string
  color?: string
}

export type OrderStatus = "Processing" | "Dispatched" | "Delivered"

export type Order = {
  number: string
  createdAt: string
  email: string
  lines: OrderLine[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  vat: number
  promoCode?: string
  shippingMethod: string
  address: Omit<Address, "id" | "label" | "isDefault">
  payment: { brand: string; last4: string }
  status: OrderStatus
}

const users = createLocalStore<User[]>("vellora-moto-users", [])
const session = createLocalStore<string | null>("vellora-moto-session", null)
const orders = createLocalStore<Order[]>("vellora-moto-orders", [])
const userReviews = createLocalStore<Record<string, Review[]>>("vellora-moto-reviews", {})

export async function hashPassword(password: string) {
  const data = new TextEncoder().encode(`vellora-moto:${password}`)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("")
}

/* ---------- Session ---------- */

export function useCurrentUser() {
  const email = session.useValue()
  const all = users.useValue()
  return email ? all.find((u) => u.email === email) ?? null : null
}

export async function register(input: { email: string; password: string; firstName: string; lastName: string; marketing: boolean }) {
  const email = input.email.trim().toLowerCase()
  if (users.get().some((u) => u.email === email)) {
    return { ok: false as const, error: "An account with this email already exists. Try signing in instead." }
  }
  const user: User = {
    email,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    marketing: input.marketing,
    passwordHash: await hashPassword(input.password),
    createdAt: new Date().toISOString(),
    addresses: [],
  }
  users.set((all) => [...all, user])
  session.set(email)
  return { ok: true as const, user }
}

// "Remember me" off: the session is marked temporary and ends when the browser session does.
const TEMP_KEY = "vellora-moto-session-temporary"

function markSession(remember: boolean) {
  try {
    if (remember) {
      window.localStorage.removeItem(TEMP_KEY)
      window.sessionStorage.removeItem(TEMP_KEY)
    } else {
      window.localStorage.setItem(TEMP_KEY, "1")
      window.sessionStorage.setItem(TEMP_KEY, "1")
    }
  } catch {
    // Storage unavailable: the session simply isn't persisted.
  }
}

if (typeof window !== "undefined") {
  try {
    if (window.localStorage.getItem(TEMP_KEY) === "1" && !window.sessionStorage.getItem(TEMP_KEY)) {
      window.localStorage.removeItem(TEMP_KEY)
      session.set(null)
    }
  } catch {
    // Ignore storage errors.
  }
}

export async function login(emailInput: string, password: string, remember = true) {
  const email = emailInput.trim().toLowerCase()
  const user = users.get().find((u) => u.email === email)
  if (!user || user.passwordHash !== (await hashPassword(password))) {
    return { ok: false as const, error: "The email or password is incorrect." }
  }
  markSession(remember)
  session.set(email)
  return { ok: true as const, user }
}

export function logout() {
  markSession(true)
  session.set(null)
}

export function updateUser(email: string, patch: Partial<Omit<User, "email" | "passwordHash" | "createdAt">>) {
  users.set((all) => all.map((u) => (u.email === email ? { ...u, ...patch } : u)))
}

export async function changePassword(email: string, current: string, next: string) {
  const user = users.get().find((u) => u.email === email)
  if (!user || user.passwordHash !== (await hashPassword(current))) {
    return { ok: false as const, error: "Your current password is incorrect." }
  }
  const passwordHash = await hashPassword(next)
  users.set((all) => all.map((u) => (u.email === email ? { ...u, passwordHash } : u)))
  return { ok: true as const }
}

export function saveAddress(email: string, address: Omit<Address, "id"> & { id?: string }) {
  users.set((all) =>
    all.map((u) => {
      if (u.email !== email) return u
      const id = address.id ?? `addr-${Date.now().toString(36)}`
      const isDefault = address.isDefault || u.addresses.length === 0
      const others = u.addresses
        .filter((a) => a.id !== id)
        .map((a) => (isDefault ? { ...a, isDefault: false } : a))
      return { ...u, addresses: [...others, { ...address, id, isDefault }] }
    })
  )
}

export function deleteAddress(email: string, id: string) {
  users.set((all) =>
    all.map((u) => {
      if (u.email !== email) return u
      const remaining = u.addresses.filter((a) => a.id !== id)
      if (remaining.length && !remaining.some((a) => a.isDefault)) remaining[0] = { ...remaining[0], isDefault: true }
      return { ...u, addresses: remaining }
    })
  )
}

/* ---------- Orders ---------- */

export const useOrders = orders.useValue

export function addOrder(order: Order) {
  orders.set((all) => [order, ...all])
}

export function findOrder(number: string, email?: string) {
  const match = orders.get().find((o) => o.number.toUpperCase() === number.trim().toUpperCase())
  if (!match) return undefined
  if (email && match.email.toLowerCase() !== email.trim().toLowerCase()) return undefined
  return match
}

/** Orders progress with time so the demo tracking page has something to show. */
export function orderStatus(order: Order, now = Date.now()): OrderStatus {
  const hours = (now - new Date(order.createdAt).getTime()) / 3_600_000
  if (order.status === "Delivered" || hours > 72) return "Delivered"
  if (order.status === "Dispatched" || hours > 4) return "Dispatched"
  return "Processing"
}

/* ---------- User reviews ---------- */

export const useUserReviews = userReviews.useValue

export function addUserReview(slug: string, review: Review) {
  userReviews.set((all) => ({ ...all, [slug]: [review, ...(all[slug] ?? [])] }))
}
