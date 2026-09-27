import { useSyncExternalStore } from "react"

/* Shared styles and helpers for the account and wishlist pages. No "use client" so server pages can import the class strings. */

export const primaryButton =
  "inline-flex h-[42px] items-center justify-center gap-2 bg-black px-8 text-sm leading-[21px] font-medium text-white uppercase transition-colors hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60"

export const secondaryButton =
  "inline-flex h-[42px] items-center justify-center gap-2 border border-black bg-white px-8 text-sm leading-[21px] font-medium text-black uppercase transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"

export const textLink = "font-semibold underline underline-offset-4 hover:opacity-70"

export const dialogContent = "max-h-[90vh] overflow-y-auto rounded-none p-6 font-sans sm:max-w-lg"

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** UK postcode, loosely validated (e.g. "SW1A 1AA", "KT13 8DN"). */
export const UK_POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i

export function formatPostcode(value: string) {
  const compact = value.replace(/\s+/g, "").toUpperCase()
  return compact.length > 3 ? `${compact.slice(0, -3)} ${compact.slice(-3)}` : compact
}

/** Returns a message when the password does not meet the store's rules. */
export function passwordIssue(password: string) {
  if (password.length < 8) return "Use at least 8 characters"
  if (!/\d/.test(password)) return "Include at least one number"
  return undefined
}

/** Only allow same-site relative redirects. */
export function safeNext(next: string | null | undefined, fallback = "/account") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback
  return next
}

export function formatDate(iso: string, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  return new Intl.DateTimeFormat("en-GB", options).format(new Date(iso))
}

const subscribe = () => () => {}

/**
 * False while hydrating (the stores still report their server snapshot), true afterwards.
 * Lets client-only pages avoid redirecting or flashing empty states before localStorage is read.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}
