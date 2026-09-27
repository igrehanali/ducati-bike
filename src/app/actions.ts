"use server"

import { z } from "zod"

import { getProduct } from "@/lib/catalog"
import { bikeModels, giftCards, servicePackages, trackDays, trackGroups } from "@/lib/experiences"
import { computeTotals, findPromo, shippingMethods, type ShippingMethodId } from "@/lib/pricing"

export type FormState = {
  ok: boolean
  message?: string
  errors?: Record<string, string[] | undefined>
  reference?: string
  data?: Record<string, string | number>
}

const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i
const UK_PHONE = /^(\+44\s?|0)[\d\s]{9,12}$/

const email = z.email("Enter a valid email address").trim().max(200)
const name = z.string().trim().min(2, "Please enter your name").max(80)
const phone = z.string().trim().regex(UK_PHONE, "Enter a valid UK phone number")
const optional = (schema: z.ZodString) => schema.optional().or(z.literal(""))

function fail(error: z.ZodError): FormState {
  return { ok: false, message: "Please check the highlighted fields.", errors: z.flattenError(error).fieldErrors }
}

function reference(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase().slice(-5)}${Math.floor(Math.random() * 900 + 100)}`
}

function entries(formData: FormData) {
  return Object.fromEntries(Array.from(formData.entries()).map(([k, v]) => [k, typeof v === "string" ? v : ""]))
}

const pause = () => new Promise((resolve) => setTimeout(resolve, 450))

/* ---------- Newsletter ---------- */

export async function subscribeNewsletter(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = z.object({ email }).safeParse(entries(formData))
  if (!parsed.success) return fail(parsed.error)
  await pause()
  return { ok: true, message: `Thanks! ${parsed.data.email} is now on the inside line.` }
}

/* ---------- Contact ---------- */

const contactSchema = z.object({
  name,
  email,
  phone: optional(phone),
  topic: z.enum(["order", "product", "returns", "service", "track-days", "other"], { error: "Choose a topic" }),
  orderNumber: z.string().trim().max(40).optional(),
  message: z.string().trim().min(10, "Tell us a little more (at least 10 characters)").max(2000),
})

export async function sendContactMessage(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse(entries(formData))
  if (!parsed.success) return fail(parsed.error)
  await pause()
  return {
    ok: true,
    reference: reference("MSG"),
    message: `Thanks ${parsed.data.name.split(" ")[0]} — we've received your message and will reply to ${parsed.data.email} within one working day.`,
  }
}

/* ---------- Service booking ---------- */

const serviceSchema = z.object({
  name,
  email,
  phone,
  model: z.enum(bikeModels, { error: "Choose your model" }),
  registration: z
    .string()
    .trim()
    .min(2, "Enter your registration")
    .max(10)
    .transform((v) => v.toUpperCase()),
  mileage: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.coerce.number({ error: "Enter the mileage" }).int("Enter a whole number").min(0, "Mileage can't be negative").max(300000, "Check the mileage")
  ),
  service: z.enum(servicePackages.map((s) => s.id) as [string, ...string[]], { error: "Choose a service" }),
  date: z.iso.date("Choose a date").refine((d) => new Date(d) > new Date(), "Choose a date in the future"),
  notes: z.string().trim().max(1000).optional(),
})

export async function bookService(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = serviceSchema.safeParse(entries(formData))
  if (!parsed.success) return fail(parsed.error)
  await pause()
  const pkg = servicePackages.find((s) => s.id === parsed.data.service)!
  const when = new Date(parsed.data.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  return {
    ok: true,
    reference: reference("SRV"),
    message: `Your ${pkg.label.toLowerCase()} for ${parsed.data.registration} is requested for ${when}. We'll confirm the drop-off time by email.`,
  }
}

/* ---------- Track day booking ---------- */

const trackSchema = z.object({
  name,
  email,
  phone,
  event: z.string().refine((id) => trackDays.some((t) => t.id === id), "Choose an event"),
  group: z.enum(trackGroups.map((g) => g.id) as [string, ...string[]], { error: "Choose a group" }),
  bike: z.string().trim().min(2, "Tell us what you'll be riding").max(60),
  leathers: z.string().optional(),
  emergencyName: name,
  emergencyPhone: phone,
  terms: z.literal("on", { error: "You must accept the track day terms" }),
})

export async function bookTrackDay(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = trackSchema.safeParse(entries(formData))
  if (!parsed.success) return fail(parsed.error)
  const event = trackDays.find((t) => t.id === parsed.data.event)!
  if (event.spacesLeft === 0) return { ok: false, message: `${event.circuit} is fully booked — please choose another date.`, errors: { event: ["Fully booked"] } }
  await pause()
  const total = event.price + (parsed.data.leathers ? 60 : 0)
  return {
    ok: true,
    reference: reference("TRK"),
    message: `You're booked on ${event.circuit}, ${event.date} (${parsed.data.group} group). Total £${total.toFixed(2)} — payment link sent to ${parsed.data.email}.`,
  }
}

/* ---------- Gift cards ---------- */

export async function checkGiftCard(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = z
    .object({
      code: z.string().trim().toUpperCase().regex(/^VELLORA-GIFT-\d{4}$/, "Gift card numbers look like VELLORA-GIFT-0001"),
      pin: z.string().trim().regex(/^\d{4}$/, "Your PIN is 4 digits"),
    })
    .safeParse(entries(formData))
  if (!parsed.success) return fail(parsed.error)
  await pause()
  const card = giftCards[parsed.data.code]
  if (!card || card.pin !== parsed.data.pin) {
    return { ok: false, message: "We couldn't find a gift card with that number and PIN." }
  }
  return {
    ok: true,
    message: card.balance > 0 ? `Balance: £${card.balance.toFixed(2)} — valid until ${card.expires}.` : `This card has been fully used.`,
    data: { balance: card.balance, expires: card.expires },
  }
}

/* ---------- Checkout ---------- */

const orderSchema = z.object({
  email,
  lines: z
    .array(
      z.object({
        slug: z.string(),
        quantity: z.number().int().min(1).max(20),
        size: z.string().optional(),
        color: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .min(1, "Your bag is empty"),
  address: z.object({
    firstName: name,
    lastName: z.string().trim().min(1, "Enter your last name").max(80),
    line1: z.string().trim().min(3, "Enter your address").max(120),
    line2: z.string().trim().max(120).optional(),
    city: z.string().trim().min(2, "Enter your town or city").max(80),
    postcode: z.string().trim().regex(UK_POSTCODE, "Enter a valid UK postcode"),
    phone,
  }),
  shippingMethod: z.enum(shippingMethods.map((m) => m.id) as [ShippingMethodId, ...ShippingMethodId[]]),
  promoCode: z.string().trim().max(30).optional(),
  payment: z.object({ brand: z.string().max(20), last4: z.string().regex(/^\d{4}$/) }),
})

export type PlaceOrderInput = z.input<typeof orderSchema>

export async function placeOrder(input: PlaceOrderInput) {
  const parsed = orderSchema.safeParse(input)
  if (!parsed.success) return { ok: false as const, errors: z.flattenError(parsed.error).fieldErrors, message: "Please check your details." }
  const { lines, shippingMethod, promoCode } = parsed.data

  // Re-price every line from the catalog; the client's prices are never trusted.
  const priced = []
  for (const line of lines) {
    const product = getProduct(line.slug)
    if (!product) return { ok: false as const, message: `An item in your bag is no longer available.` }
    if (product.stock < line.quantity) {
      return { ok: false as const, message: product.stock === 0 ? `${product.name} is out of stock.` : `Only ${product.stock} of ${product.name} left in stock.` }
    }
    priced.push({ slug: product.slug, name: product.name, image: line.image ?? product.image, price: product.price, quantity: line.quantity, size: line.size, color: line.color })
  }

  const totals = computeTotals(priced, shippingMethod, promoCode)
  if (promoCode && !findPromo(promoCode)) return { ok: false as const, message: `The code ${promoCode} isn't valid.` }
  await pause()

  const now = new Date()
  const number = `DS${now.getFullYear().toString().slice(-2)}${String(now.getMonth() + 1).padStart(2, "0")}-${Math.floor(Math.random() * 90000 + 10000)}`
  return {
    ok: true as const,
    order: {
      number,
      createdAt: now.toISOString(),
      email: parsed.data.email,
      lines: priced,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.total,
      vat: totals.vat,
      promoCode: totals.promo?.code,
      shippingMethod: shippingMethods.find((m) => m.id === shippingMethod)!.label,
      address: parsed.data.address,
      payment: parsed.data.payment,
      status: "Processing" as const,
    },
  }
}
