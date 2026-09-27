import type { ReactNode } from "react"
import Link from "next/link"

import { LineThumb } from "@/components/checkout/summary-parts"
import type { Order } from "@/lib/account-store"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

export function OrderLines({ order, className, thumbClassName }: { order: Order; className?: string; thumbClassName?: string }) {
  return (
    <ul className={cn("flex flex-col gap-5", className)}>
      {order.lines.map((line, index) => (
        <li key={`${line.slug}-${line.size}-${line.color}-${index}`} className="flex items-center gap-4">
          <LineThumb image={line.image} name={line.name} quantity={line.quantity} className={thumbClassName} />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Link href={`/products/${line.slug}`} className="font-inter text-[13px] leading-4 font-medium tracking-[-0.3px] uppercase hover:underline">
              {line.name}
            </Link>
            <p className="text-xs leading-4 text-subtle">
              {[line.size && `Size ${line.size}`, line.color, `Qty ${line.quantity}`].filter(Boolean).join(" · ")}
            </p>
          </div>
          <p className="shrink-0 font-mono text-sm leading-5 font-semibold">{formatPrice(line.price * line.quantity)}</p>
        </li>
      ))}
    </ul>
  )
}

export function OrderTotals({ order }: { order: Order }) {
  return (
    <dl className="flex flex-col gap-3 text-sm leading-5">
      <div className="flex justify-between gap-4">
        <dt>Subtotal</dt>
        <dd className="font-mono">{formatPrice(order.subtotal)}</dd>
      </div>
      {order.discount > 0 ? (
        <div className="flex justify-between gap-4 text-brand-dark">
          <dt>Discount{order.promoCode ? ` (${order.promoCode})` : ""}</dt>
          <dd className="font-mono">−{formatPrice(order.discount)}</dd>
        </div>
      ) : null}
      <div className="flex justify-between gap-4">
        <dt>{order.shippingMethod}</dt>
        <dd className="font-mono">{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</dd>
      </div>
      <div className="flex items-baseline justify-between gap-4 border-t border-rule pt-4">
        <dt className="text-lg leading-[22px] font-semibold tracking-[-0.4px]">Total</dt>
        <dd className="font-mono text-xl leading-6 font-semibold tracking-[-0.4px]">{formatPrice(order.total)}</dd>
      </div>
      <p className="-mt-1 text-xs leading-4 text-subtle">Including {formatPrice(order.vat)} VAT</p>
    </dl>
  )
}

export function AddressBlock({ address }: { address: Order["address"] }) {
  return (
    <address className="flex flex-col text-sm leading-5 not-italic">
      <span>
        {address.firstName} {address.lastName}
      </span>
      <span>{address.line1}</span>
      {address.line2 ? <span>{address.line2}</span> : null}
      <span>{address.city}</span>
      <span>{address.postcode}</span>
      {address.phone ? <span className="text-subtle">{address.phone}</span> : null}
    </address>
  )
}

export function InfoBlock({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <h3 className="text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase">{title}</h3>
      {children}
    </div>
  )
}
