import { useSyncExternalStore } from "react"

import type { Order } from "@/lib/account-store"
import { createLocalStore } from "@/lib/local-store"
import { shippingMethods, type ShippingMethodId } from "@/lib/pricing"

/* ---------- Applied promo code (shared by /cart and /checkout) ---------- */

const promo = createLocalStore<string | null>("vellora-moto-promo", null)

export const usePromoCode = promo.useValue

export function setPromoCode(code: string | null) {
  promo.set(code ? code.trim().toUpperCase() : null)
}

/* ---------- Hydration / time helpers ---------- */

const noopSubscribe = () => () => {}

/** False during SSR and hydration, true afterwards — lets client-only pages show a skeleton instead of stale server data. */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  )
}

function subscribeMinute(listener: () => void) {
  const id = window.setInterval(listener, 60_000)
  return () => window.clearInterval(id)
}

/** Current time rounded to the minute (stable snapshot), 0 on the server. */
export function useNow() {
  return useSyncExternalStore(
    subscribeMinute,
    () => Math.floor(Date.now() / 60_000) * 60_000,
    () => 0
  )
}

/* ---------- Validation (mirrors the server rules in src/app/actions.ts) ---------- */

export const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i
export const UK_PHONE = /^(\+44\s?|0)[\d\s]{9,12}$/
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export type AddressFields = {
  firstName: string
  lastName: string
  line1: string
  line2: string
  city: string
  postcode: string
  phone: string
}

export type FieldErrors = Partial<Record<string, string>>

export function validateEmail(value: string) {
  const email = value.trim()
  if (!email) return "Enter your email address"
  if (!EMAIL.test(email) || email.length > 200) return "Enter a valid email address"
  return undefined
}

export function validateAddress(a: AddressFields): FieldErrors {
  const errors: FieldErrors = {}
  if (a.firstName.trim().length < 2) errors.firstName = "Please enter your first name"
  if (a.lastName.trim().length < 1) errors.lastName = "Enter your last name"
  if (a.line1.trim().length < 3) errors.line1 = "Enter your address"
  if (a.city.trim().length < 2) errors.city = "Enter your town or city"
  if (!UK_POSTCODE.test(a.postcode.trim())) errors.postcode = "Enter a valid UK postcode"
  if (!UK_PHONE.test(a.phone.trim())) errors.phone = "Enter a valid UK phone number"
  return errors
}

export function formatPostcode(value: string) {
  const clean = value.replace(/\s+/g, "").toUpperCase()
  return clean.length > 3 ? `${clean.slice(0, -3)} ${clean.slice(-3)}` : clean
}

/* ---------- Demo card helpers — card data never leaves the browser ---------- */

export type CardBrand = "Visa" | "Mastercard" | "Amex" | "Card"

export function detectBrand(digits: string): CardBrand {
  if (/^4/.test(digits)) return "Visa"
  if (/^3[47]/.test(digits)) return "Amex"
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return "Mastercard"
  return "Card"
}

export function cardLengths(brand: CardBrand) {
  if (brand === "Amex") return [15]
  if (brand === "Visa") return [13, 16, 19]
  if (brand === "Mastercard") return [16]
  return [12, 13, 14, 15, 16, 17, 18, 19]
}

export function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 19)
  if (detectBrand(digits) === "Amex") {
    return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)].filter(Boolean).join(" ")
  }
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ")
}

export function luhn(digits: string) {
  let sum = 0
  let double = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i])
    if (double) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    double = !double
  }
  return digits.length > 0 && sum % 10 === 0
}

export function formatExpiry(value: string, previous: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4)
  // Let backspace remove the slash naturally.
  if (value.length < previous.length && previous.endsWith("/") && digits.length <= 2) return digits.slice(0, 1)
  if (digits.length === 1 && Number(digits) > 1) return `0${digits}/`
  if (digits.length >= 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
}

export type CardFields = { number: string; name: string; expiry: string; cvc: string }

export function validateCard(card: CardFields, now = new Date()): FieldErrors {
  const errors: FieldErrors = {}
  const digits = card.number.replace(/\D/g, "")
  const brand = detectBrand(digits)
  if (!digits) errors.cardNumber = "Enter your card number"
  else if (!cardLengths(brand).includes(digits.length) || !luhn(digits)) errors.cardNumber = "Enter a valid card number"
  if (card.name.trim().length < 2) errors.cardName = "Enter the name on your card"
  const match = /^(\d{2})\/(\d{2})$/.exec(card.expiry)
  if (!match) errors.cardExpiry = "Enter the expiry date as MM/YY"
  else {
    const month = Number(match[1])
    const year = 2000 + Number(match[2])
    if (month < 1 || month > 12) errors.cardExpiry = "Enter a valid month"
    else if (new Date(year, month, 1) <= now) errors.cardExpiry = "This card has expired"
    else if (year > now.getFullYear() + 20) errors.cardExpiry = "Enter a valid expiry year"
  }
  const cvcLength = brand === "Amex" ? 4 : 3
  if (!/^\d{3,4}$/.test(card.cvc) || (brand !== "Card" && card.cvc.length !== cvcLength)) {
    errors.cardCvc = brand === "Amex" ? "Amex security codes are 4 digits" : "Enter the 3-digit security code"
  }
  return errors
}

/* ---------- Delivery estimates ---------- */

const workingDays: Record<ShippingMethodId, [number, number]> = {
  standard: [2, 3],
  express: [1, 2],
  "next-day": [1, 1],
  collect: [1, 1],
}

function addWorkingDays(start: Date, days: number) {
  const date = new Date(start)
  let added = 0
  while (added < days) {
    date.setDate(date.getDate() + 1)
    const day = date.getDay()
    if (day !== 0 && day !== 6) added++
  }
  return date
}

export function methodForOrder(order: Pick<Order, "shippingMethod">) {
  return shippingMethods.find((m) => m.label === order.shippingMethod || m.id === order.shippingMethod) ?? shippingMethods[0]
}

export function deliveryWindow(order: Pick<Order, "shippingMethod" | "createdAt">) {
  const method = methodForOrder(order)
  const [min, max] = workingDays[method.id]
  const created = new Date(order.createdAt)
  return { method, from: addWorkingDays(created, min), to: addWorkingDays(created, max) }
}

export function formatDate(date: Date | string, options: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" }) {
  return new Date(date).toLocaleDateString("en-GB", options)
}

export function formatDeliveryWindow(order: Pick<Order, "shippingMethod" | "createdAt">) {
  const { from, to } = deliveryWindow(order)
  const a = formatDate(from, { weekday: "long", day: "numeric", month: "long" })
  if (from.toDateString() === to.toDateString()) return a
  return `${formatDate(from, { weekday: "short", day: "numeric", month: "short" })} – ${formatDate(to, { weekday: "short", day: "numeric", month: "short" })}`
}

export function matchOrder(orders: Order[], number: string, email?: string) {
  const match = orders.find((o) => o.number.toUpperCase() === number.trim().toUpperCase())
  if (!match) return undefined
  if (email && match.email.toLowerCase() !== email.trim().toLowerCase()) return undefined
  return match
}
