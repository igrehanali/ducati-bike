/* Shared pricing rules — used by the cart/checkout UI and re-checked on the server when an order is placed. */

export const FREE_SHIPPING_THRESHOLD = 100
export const VAT_RATE = 0.2

export type ShippingMethodId = "standard" | "express" | "next-day" | "collect"

export const shippingMethods: { id: ShippingMethodId; label: string; description: string; price: number }[] = [
  { id: "standard", label: "Standard delivery", description: "2–3 working days · free over £100", price: 4.95 },
  { id: "express", label: "Express delivery", description: "1–2 working days", price: 9.95 },
  { id: "next-day", label: "Next working day", description: "Order before 2pm, Mon–Fri", price: 14.95 },
  { id: "collect", label: "Click & collect", description: "Collect from our showroom in 24 hours", price: 0 },
]

export type Promo = { code: string; label: string; kind: "percent" | "shipping"; value: number; minSubtotal?: number }

export const promoCodes: Promo[] = [
  { code: "RIDE10", label: "10% off your order", kind: "percent", value: 10 },
  { code: "VELLORA20", label: "20% off orders over £200", kind: "percent", value: 20, minSubtotal: 200 },
  { code: "FREESHIP", label: "Free delivery", kind: "shipping", value: 0 },
]

export function findPromo(code: string | undefined | null) {
  if (!code) return undefined
  return promoCodes.find((promo) => promo.code === code.trim().toUpperCase())
}

export type PricedLine = { price: number; quantity: number }

export function computeTotals(lines: PricedLine[], method: ShippingMethodId = "standard", promoCode?: string | null) {
  const subtotal = round(lines.reduce((sum, line) => sum + line.price * line.quantity, 0))
  const promo = findPromo(promoCode)
  const promoValid = Boolean(promo && subtotal >= (promo.minSubtotal ?? 0))
  const discount = promo && promoValid && promo.kind === "percent" ? round((subtotal * promo.value) / 100) : 0

  const base = shippingMethods.find((m) => m.id === method) ?? shippingMethods[0]
  const freeStandard = base.id === "standard" && subtotal - discount >= FREE_SHIPPING_THRESHOLD
  const freeByPromo = promo?.kind === "shipping" && promoValid
  const shipping = lines.length === 0 || freeStandard || freeByPromo ? 0 : base.price

  const total = round(Math.max(0, subtotal - discount + shipping))
  // UK prices include VAT; show the VAT portion of the total.
  const vat = round(total - total / (1 + VAT_RATE))
  return {
    subtotal,
    discount,
    shipping,
    total,
    vat,
    promo: promoValid ? promo : undefined,
    promoError: promo && !promoValid ? `Spend £${promo.minSubtotal} or more to use ${promo.code}` : undefined,
    amountToFreeShipping: Math.max(0, round(FREE_SHIPPING_THRESHOLD - (subtotal - discount))),
  }
}

function round(value: number) {
  return Math.round(value * 100) / 100
}
