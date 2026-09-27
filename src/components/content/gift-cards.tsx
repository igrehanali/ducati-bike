"use client"

import { useState, useSyncExternalStore, type FormEvent } from "react"
import { toast } from "sonner"

import { checkGiftCard } from "@/app/actions"
import { Logo } from "@/components/brand/logo"
import { useCartUI } from "@/components/cart/cart-provider"
import { useFormAction } from "@/components/content/use-form-action"
import { Field, FormMessage, SubmitButton, TextArea, TextInput } from "@/components/site/form"
import { addToCart } from "@/lib/cart-store"
import type { Product } from "@/lib/catalog"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

type GiftProduct = Pick<Product, "slug" | "name" | "image" | "price">

const MESSAGE_MAX = 200
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const noop = () => () => {}

function today() {
  const date = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function whole(value: number) {
  return `£${value.toLocaleString("en-GB")}`
}

/* ---------- Digital card preview ---------- */

export function GiftCardPreview({ amount, to, from, message, className }: { amount: number; to?: string; from?: string; message?: string; className?: string }) {
  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <div className="relative isolate flex aspect-[1.586] flex-col justify-between overflow-hidden bg-black p-5 text-white shadow-[0_24px_48px_-24px_rgba(0,0,0,0.6)] sm:p-7">
        <div aria-hidden="true" className="absolute -right-16 -bottom-24 -z-10 size-72 rounded-full bg-brand/80 blur-3xl" />
        <div aria-hidden="true" className="absolute inset-y-0 right-[18%] -z-10 w-10 skew-x-[-18deg] bg-white/5" />
        <div className="flex items-start justify-between gap-4">
          <div className="relative h-7 w-[96px] sm:h-8 sm:w-[110px]">
            <Logo tone="light" className="h-full w-full" />
          </div>
          <span className="font-mono text-[10px] leading-3 tracking-[0.1em] text-white/70 uppercase">Digital gift card</span>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-inter text-[40px] leading-[44px] font-medium tracking-[-1.2px] sm:text-[52px] sm:leading-[56px]">{whole(amount)}</p>
          {message ? <p className="line-clamp-2 max-w-[90%] text-xs leading-4 text-white/80 italic sm:text-sm sm:leading-5">&ldquo;{message}&rdquo;</p> : null}
          <div className="flex justify-between gap-4 font-mono text-[11px] leading-4 text-white/70 uppercase">
            <span className="truncate">To: {to || "Recipient"}</span>
            <span className="truncate">From: {from || "You"}</span>
          </div>
        </div>
      </div>
      <figcaption className="text-xs leading-4 text-subtle">Preview of the email your recipient will receive.</figcaption>
    </figure>
  )
}

/* ---------- Builder ---------- */

type Errors = Partial<Record<"recipientName" | "recipientEmail" | "senderName", string>>

export function GiftCardBuilder({ products }: { products: GiftProduct[] }) {
  const { setOpen } = useCartUI()
  const [slug, setSlug] = useState(products[1]?.slug ?? products[0]?.slug)
  const [to, setTo] = useState("")
  const [email, setEmail] = useState("")
  const [from, setFrom] = useState("")
  const [message, setMessage] = useState("")
  const [date, setDate] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const minDate = useSyncExternalStore(noop, today, () => undefined)
  const product = products.find((p) => p.slug === slug) ?? products[0]

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: Errors = {}
    if (to.trim().length < 2) next.recipientName = "Enter the recipient's name"
    if (!EMAIL.test(email.trim())) next.recipientEmail = "Enter a valid email address"
    if (from.trim().length < 2) next.senderName = "Enter your name"
    setErrors(next)
    const first = Object.keys(next)[0]
    if (first) {
      document.getElementById(`gift-${first}`)?.focus()
      return
    }
    addToCart(product, { color: `To: ${to.trim()}` })
    setOpen(true)
    const when = date && date !== minDate ? ` on ${new Date(`${date}T09:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}` : " straight away"
    toast.success(`${whole(product.price)} gift card added to your bag`, { description: `We'll email it to ${to.trim()}${when}.` })
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
      <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
        <GiftCardPreview amount={product.price} to={to.trim()} from={from.trim()} message={message.trim()} />
        <ul className="grid grid-cols-3 gap-2 text-center text-xs leading-4 text-subtle">
          <li className="bg-surface p-3">Delivered by email</li>
          <li className="bg-surface p-3">Valid for 24 months</li>
          <li className="bg-surface p-3">Online &amp; in store</li>
        </ul>
      </div>

      <form onSubmit={submit} noValidate className="flex flex-col gap-6">
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-sm leading-[17px] font-semibold tracking-[-0.3px]">Choose an amount</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {products.map((p) => (
              <label
                key={p.slug}
                className="flex h-14 cursor-pointer items-center justify-center border border-black/25 font-mono text-lg transition-colors hover:border-black has-[:checked]:border-black has-[:checked]:bg-black has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-black/30"
              >
                <input type="radio" name="amount" value={p.slug} checked={slug === p.slug} onChange={() => setSlug(p.slug)} className="sr-only" />
                <span className="sr-only">Gift card </span>
                {whole(p.price)}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Recipient's name" htmlFor="gift-recipientName" error={errors.recipientName} required>
            <TextInput id="gift-recipientName" value={to} onChange={(e) => setTo(e.target.value)} maxLength={40} autoComplete="off" invalid={Boolean(errors.recipientName)} />
          </Field>
          <Field label="Recipient's email" htmlFor="gift-recipientEmail" error={errors.recipientEmail} required>
            <TextInput
              id="gift-recipientEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              invalid={Boolean(errors.recipientEmail)}
            />
          </Field>
          <Field label="Your name" htmlFor="gift-senderName" error={errors.senderName} required>
            <TextInput id="gift-senderName" value={from} onChange={(e) => setFrom(e.target.value)} maxLength={40} autoComplete="name" invalid={Boolean(errors.senderName)} />
          </Field>
          <Field label="Delivery date" htmlFor="gift-date" hint="Leave blank to send as soon as you order">
            <TextInput id="gift-date" type="date" value={date} min={minDate} onChange={(e) => setDate(e.target.value)} />
          </Field>
        </div>

        <Field
          label="Personal message"
          htmlFor="gift-message"
          hint={
            <span className="flex justify-between gap-4">
              <span>Optional — shown on the card</span>
              <span aria-live="polite" className={cn("font-mono", message.length >= MESSAGE_MAX && "text-brand-dark")}>
                {message.length}/{MESSAGE_MAX}
              </span>
            </span>
          }
        >
          <TextArea id="gift-message" value={message} onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX))} maxLength={MESSAGE_MAX} rows={3} className="min-h-24" />
        </Field>

        <div className="flex flex-col gap-3 border-t border-black/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-baseline gap-2">
            <span className="text-sm font-semibold">Total</span>
            <span className="font-mono text-xl leading-7">{formatPrice(product.price)}</span>
          </p>
          <button type="submit" className="flex h-[46px] items-center justify-center bg-black px-10 text-sm leading-[21px] font-medium text-white uppercase transition-colors hover:bg-black/85">
            Add to bag
          </button>
        </div>
      </form>
    </div>
  )
}

/* ---------- Balance checker ---------- */

export function GiftCardBalance() {
  const { state, pending, formProps, error } = useFormAction(checkGiftCard)
  const balance = state.ok && typeof state.data?.balance === "number" ? state.data.balance : undefined

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-16">
      <form {...formProps} noValidate className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_120px]">
          <Field label="Gift card number" htmlFor="balance-code" error={error("code")} required>
            <TextInput id="balance-code" name="code" placeholder="VELLORA-GIFT-0000" autoComplete="off" spellCheck={false} className="font-mono uppercase" invalid={Boolean(error("code"))} disabled={pending} />
          </Field>
          <Field label="PIN" htmlFor="balance-pin" error={error("pin")} required>
            <TextInput id="balance-pin" name="pin" inputMode="numeric" maxLength={4} autoComplete="off" className="font-mono" invalid={Boolean(error("pin"))} disabled={pending} />
          </Field>
        </div>
        <p className="text-xs leading-4 text-subtle">
          Demo: try <span className="font-mono text-black">VELLORA-GIFT-0001</span> with PIN <span className="font-mono text-black">1234</span>
        </p>
        <SubmitButton pending={pending} className="w-full sm:w-fit">
          {pending ? "Checking…" : "Check balance"}
        </SubmitButton>
      </form>

      <div aria-live="polite" className="flex flex-col justify-center">
        {balance !== undefined ? (
          <div className="flex flex-col gap-2 bg-surface p-6">
            <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase">Available balance</p>
            <p className="font-inter text-[44px] leading-[52px] font-medium tracking-[-1.2px]">{formatPrice(balance)}</p>
            <p className="text-sm leading-5 text-subtle">
              {balance > 0 ? `Valid until ${state.data?.expires}. Use it at checkout or in our showroom.` : "This card has been fully used."}
            </p>
          </div>
        ) : state.message && !state.errors ? (
          <FormMessage ok={false} message={state.message} />
        ) : (
          <div className="flex flex-col gap-2 border border-dashed border-black/25 p-6 text-sm leading-5 text-subtle">
            <p className="font-semibold text-black">Where to find your details</p>
            <p>Your 16-character card number and 4-digit PIN are in your gift card email, or on the back of a physical card.</p>
          </div>
        )}
      </div>
    </div>
  )
}
