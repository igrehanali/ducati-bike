"use client"

import { useId, useState, type FormEvent } from "react"
import Image from "next/image"
import { LockIcon, RotateCcwIcon, TagIcon, TruckIcon, XIcon } from "lucide-react"

import { setPromoCode } from "@/components/checkout/checkout-utils"
import { imageFit } from "@/components/product/product-card"
import { formatPrice } from "@/lib/format"
import { computeTotals, findPromo, FREE_SHIPPING_THRESHOLD, type PricedLine } from "@/lib/pricing"
import { cn } from "@/lib/utils"

type Totals = ReturnType<typeof computeTotals>

/* ---------- Promo code ---------- */

export function PromoCodeForm({ lines, code, className }: { lines: PricedLine[]; code: string | null; className?: string }) {
  const id = useId()
  const [value, setValue] = useState("")
  const [error, setError] = useState<string>()
  const totals = computeTotals(lines, "standard", code)
  const applied = code ? findPromo(code) : undefined

  function apply(event: FormEvent) {
    event.preventDefault()
    const entered = value.trim()
    if (!entered) {
      setError("Enter a promo code")
      return
    }
    const promo = findPromo(entered)
    if (!promo) {
      setError(`Sorry, ${entered.toUpperCase()} isn't a valid code`)
      return
    }
    const check = computeTotals(lines, "standard", promo.code)
    if (check.promoError) {
      setError(check.promoError)
      return
    }
    setPromoCode(promo.code)
    setValue("")
    setError(undefined)
  }

  if (applied) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <div className="flex items-center justify-between gap-3 border border-dashed border-black/40 bg-surface px-3.5 py-2.5">
          <p className="flex min-w-0 items-center gap-2 text-sm leading-5">
            <TagIcon className="size-4 shrink-0" aria-hidden="true" />
            <span className="font-mono font-semibold">{applied.code}</span>
            <span className="truncate text-subtle">{applied.label}</span>
          </p>
          <button
            type="button"
            onClick={() => setPromoCode(null)}
            aria-label={`Remove promo code ${applied.code}`}
            className="flex size-7 shrink-0 items-center justify-center hover:bg-black/5"
          >
            <XIcon className="size-4" />
          </button>
        </div>
        {totals.promoError ? (
          <p role="alert" className="text-xs leading-4 text-brand-dark">
            {totals.promoError} — the code will apply once your bag qualifies.
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <form onSubmit={apply} noValidate className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm leading-[17px] font-semibold tracking-[-0.3px]">
        Promo code
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (error) setError(undefined)
          }}
          placeholder="Enter code"
          autoComplete="off"
          autoCapitalize="characters"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-11 min-w-0 flex-1 border border-black/25 bg-white px-3.5 text-sm uppercase outline-none transition-colors placeholder:text-subtle placeholder:normal-case hover:border-black/50 focus:border-black focus-visible:ring-2 focus-visible:ring-black/10 aria-invalid:border-brand-dark"
        />
        <button
          type="submit"
          className="h-11 shrink-0 border border-black bg-white px-5 text-sm leading-[21px] font-medium uppercase transition-colors hover:bg-black hover:text-white"
        >
          Apply
        </button>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs leading-4 text-brand-dark">
          {error}
        </p>
      ) : null}
    </form>
  )
}

/* ---------- Totals ---------- */

export function TotalsRows({ totals, shippingLabel = "Delivery", shippingPending = false }: { totals: Totals; shippingLabel?: string; shippingPending?: boolean }) {
  return (
    <dl className="flex flex-col gap-3 text-sm leading-5">
      <div className="flex justify-between gap-4">
        <dt>Subtotal</dt>
        <dd className="font-mono">{formatPrice(totals.subtotal)}</dd>
      </div>
      {totals.discount > 0 ? (
        <div className="flex justify-between gap-4 text-brand-dark">
          <dt>Discount{totals.promo ? ` (${totals.promo.code})` : ""}</dt>
          <dd className="font-mono">−{formatPrice(totals.discount)}</dd>
        </div>
      ) : null}
      <div className="flex justify-between gap-4">
        <dt>{shippingLabel}</dt>
        <dd className="font-mono">{shippingPending ? <span className="font-sans text-subtle">Calculated at next step</span> : totals.shipping === 0 ? "FREE" : formatPrice(totals.shipping)}</dd>
      </div>
      <div className="flex items-baseline justify-between gap-4 border-t border-rule pt-4">
        <dt className="text-lg leading-[22px] font-semibold tracking-[-0.4px]">Total</dt>
        <dd className="font-mono text-xl leading-6 font-semibold tracking-[-0.4px]">{formatPrice(totals.total)}</dd>
      </div>
      <p className="-mt-1 text-xs leading-4 text-subtle">Including {formatPrice(totals.vat)} VAT</p>
    </dl>
  )
}

/* ---------- Free delivery progress ---------- */

export function FreeShippingProgress({ totals, className }: { totals: Totals; className?: string }) {
  const unlocked = totals.amountToFreeShipping === 0 || totals.promo?.kind === "shipping"
  const progress = unlocked ? 100 : Math.round(((FREE_SHIPPING_THRESHOLD - totals.amountToFreeShipping) / FREE_SHIPPING_THRESHOLD) * 100)
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="flex items-center gap-2 text-[13px] leading-[18px]">
        <TruckIcon className="size-4 shrink-0" aria-hidden="true" />
        {unlocked ? (
          <span>You&apos;ve unlocked <strong className="font-semibold">free standard delivery</strong></span>
        ) : (
          <span>
            You&apos;re <strong className="font-mono font-semibold">{formatPrice(totals.amountToFreeShipping)}</strong> away from free delivery
          </span>
        )}
      </p>
      <div
        role="progressbar"
        aria-label="Progress towards free delivery"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="h-1 w-full bg-chip"
      >
        <div className={cn("h-full transition-[width] duration-500", unlocked ? "bg-[#34a853]" : "bg-black")} style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

/* ---------- Payment + trust ---------- */

const paymentBrands = ["VISA", "MASTERCARD", "AMEX", "PAYPAL", "APPLE PAY"]

export function PaymentBadges({ className }: { className?: string }) {
  return (
    <ul aria-label="Accepted payment methods" className={cn("flex flex-wrap gap-1.5", className)}>
      {paymentBrands.map((brand) => (
        <li key={brand} className="border border-rule px-2 py-1 font-mono text-[10px] leading-3 font-semibold tracking-[0.2px] text-black/80">
          {brand}
        </li>
      ))}
    </ul>
  )
}

const trustPoints = [
  { icon: LockIcon, title: "Secure checkout", text: "256-bit SSL encrypted payment" },
  { icon: RotateCcwIcon, title: "30-day returns", text: "Free, easy returns on full-price items" },
  { icon: TruckIcon, title: "UK delivery", text: `Free standard delivery over £${FREE_SHIPPING_THRESHOLD}` },
]

export function TrustPoints({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {trustPoints.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex items-start gap-3">
          <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p className="text-[13px] leading-[18px]">
            <span className="font-semibold">{title}</span> <span className="text-subtle">— {text}</span>
          </p>
        </li>
      ))}
    </ul>
  )
}

/* ---------- Line thumbnail with quantity badge ---------- */

export function LineThumb({ image, name, quantity, className }: { image: string; name: string; quantity?: number; className?: string }) {
  return (
    <div className={cn("relative h-20 w-16 shrink-0 bg-surface", className)}>
      <Image src={image} alt={name} fill sizes="64px" className={imageFit(image)} />
      {quantity ? (
        <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 font-mono text-[11px] leading-3 font-semibold text-white">
          <span className="sr-only">Quantity </span>
          {quantity}
        </span>
      ) : null}
    </div>
  )
}
