"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDownIcon, RotateCcwIcon, TruckIcon } from "lucide-react"
import { toast } from "sonner"

import { formatDate, primaryButton, secondaryButton } from "@/components/account/utils"
import { useCartUI } from "@/components/cart/cart-provider"
import { imageFit } from "@/components/product/product-card"
import { orderStatus, useOrders, type Order, type OrderLine, type User } from "@/lib/account-store"
import { addToCart } from "@/lib/cart-store"
import { getProduct } from "@/lib/catalog"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

export function useUserOrders(email: string) {
  const orders = useOrders()
  return orders.filter((order) => order.email.toLowerCase() === email.toLowerCase())
}

const STATUS_DOT = {
  Processing: "bg-[#ff9800]",
  Dispatched: "bg-[#1a73e8]",
  Delivered: "bg-[#34a853]",
} as const

export function OrderStatusBadge({ order }: { order: Order }) {
  const status = orderStatus(order)
  return (
    <span className="inline-flex items-center gap-2 bg-chip px-2 py-1 font-inter text-xs leading-[14px] font-bold tracking-[-0.2px] uppercase">
      <span aria-hidden="true" className={cn("size-2 rounded-full", STATUS_DOT[status])} />
      {status}
    </span>
  )
}

export function OrderThumbnails({ lines, max = 4 }: { lines: OrderLine[]; max?: number }) {
  const shown = lines.slice(0, max)
  const extra = lines.length - shown.length
  return (
    <ul className="flex flex-wrap gap-2" aria-label={`${lines.length} item${lines.length === 1 ? "" : "s"}`}>
      {shown.map((line, index) => (
        <li key={`${line.slug}-${index}`} className="relative h-[74px] w-14 shrink-0 bg-surface">
          <Image src={line.image} alt={line.name} fill sizes="56px" className={imageFit(line.image)} />
          {line.quantity > 1 ? (
            <span className="absolute right-0.5 bottom-0.5 bg-black px-1 font-mono text-[10px] leading-3 text-white">×{line.quantity}</span>
          ) : null}
        </li>
      ))}
      {extra > 0 ? (
        <li className="flex h-[74px] w-14 items-center justify-center bg-surface font-mono text-xs" aria-label={`and ${extra} more`}>
          +{extra}
        </li>
      ) : null}
    </ul>
  )
}

export function AccountOrders({ user }: { user: User }) {
  const orders = useUserOrders(user.email)

  if (!orders.length) {
    return (
      <div className="flex flex-col items-start gap-3 border border-rule p-6 md:p-10">
        <h2 className="font-inter text-2xl leading-[30px] font-medium tracking-[-0.6px]">No orders yet</h2>
        <p className="text-base leading-6 text-subtle">Your orders will appear here as soon as you check out.</p>
        <Link href="/shop" className={`${primaryButton} mt-3`}>
          Shop the collection
        </Link>
      </div>
    )
  }

  return (
    <section aria-labelledby="orders-title" className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-3">
        <h2 id="orders-title" className="font-inter text-2xl leading-[30px] font-medium tracking-[-0.6px]">
          Orders
        </h2>
        <p className="text-sm text-subtle">
          {orders.length} order{orders.length === 1 ? "" : "s"}
        </p>
      </div>
      <ul className="flex flex-col gap-4">
        {orders.map((order) => (
          <li key={order.number}>
            <OrderCard order={order} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false)
  const { setOpen: openCart } = useCartUI()
  const detailsId = `order-${order.number}-details`
  const itemCount = order.lines.reduce((sum, line) => sum + line.quantity, 0)
  const trackHref = `/track-order?order=${encodeURIComponent(order.number)}&email=${encodeURIComponent(order.email)}`

  function buyAgain() {
    let added = 0
    const missing: string[] = []
    for (const line of order.lines) {
      const product = getProduct(line.slug)
      if (!product || product.stock === 0) {
        missing.push(line.name)
        continue
      }
      addToCart(product, { size: line.size, color: line.color, image: line.image, quantity: line.quantity })
      added += line.quantity
    }
    if (added) {
      toast.success(`Added ${added} item${added === 1 ? "" : "s"} to your bag`, {
        description: missing.length ? `Unavailable: ${missing.join(", ")}` : undefined,
      })
      openCart(true)
    } else {
      toast.error("These items are no longer available")
    }
  }

  return (
    <article className="border border-rule" aria-labelledby={`order-${order.number}`}>
      <div className="flex flex-col gap-5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 sm:flex sm:flex-wrap">
            <div className="flex flex-col gap-1">
              <dt className="text-xs leading-4 text-subtle">Order</dt>
              <dd id={`order-${order.number}`} className="font-mono text-sm leading-5 font-semibold">
                {order.number}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-xs leading-4 text-subtle">Placed</dt>
              <dd className="font-mono text-sm leading-5">
                <time dateTime={order.createdAt}>{formatDate(order.createdAt)}</time>
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-xs leading-4 text-subtle">Items</dt>
              <dd className="font-mono text-sm leading-5">{itemCount}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-xs leading-4 text-subtle">Total</dt>
              <dd className="font-mono text-sm leading-5 font-semibold">{formatPrice(order.total)}</dd>
            </div>
          </dl>
          <OrderStatusBadge order={order} />
        </div>
        <OrderThumbnails lines={order.lines} max={6} />
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={detailsId}
            onClick={() => setOpen((v) => !v)}
            className={cn(secondaryButton, "px-5")}
          >
            {open ? "Hide details" : "View details"}
            <ChevronDownIcon className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
          </button>
          <Link href={trackHref} className={cn(secondaryButton, "px-5")}>
            <TruckIcon className="size-4" aria-hidden="true" />
            Track
          </Link>
          <button type="button" onClick={buyAgain} className={cn(primaryButton, "px-5")}>
            <RotateCcwIcon className="size-4" aria-hidden="true" />
            Buy again
          </button>
        </div>
      </div>

      <div id={detailsId} hidden={!open} className="border-t border-rule">
        {open ? <OrderDetails order={order} /> : null}
      </div>
    </article>
  )
}

function OrderDetails({ order }: { order: Order }) {
  const { address } = order
  const rows = [
    { label: "Subtotal", value: formatPrice(order.subtotal) },
    ...(order.discount ? [{ label: order.promoCode ? `Discount (${order.promoCode})` : "Discount", value: `−${formatPrice(order.discount)}` }] : []),
    { label: `Delivery (${order.shippingMethod})`, value: order.shipping ? formatPrice(order.shipping) : "Free" },
  ]

  return (
    <div className="grid gap-8 p-5 lg:grid-cols-[minmax(0,1fr)_280px]">
      <ul className="flex flex-col divide-y divide-rule">
        {order.lines.map((line, index) => (
          <li key={`${line.slug}-${index}`} className="flex gap-4 py-4 first:pt-0 last:pb-0">
            <Link href={`/products/${line.slug}`} className="relative h-[93px] w-[70px] shrink-0 bg-surface">
              <Image src={line.image} alt={line.name} fill sizes="70px" className={imageFit(line.image)} />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Link href={`/products/${line.slug}`} className="font-inter text-sm leading-[18px] font-medium tracking-[-0.3px] hover:underline">
                {line.name}
              </Link>
              <p className="text-xs leading-4 text-subtle">
                {[line.size && `Size ${line.size}`, line.color, `Qty ${line.quantity}`].filter(Boolean).join(" · ")}
              </p>
              <p className="font-mono text-sm">{formatPrice(line.price * line.quantity)}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-6 text-sm leading-5">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold">Delivery address</h3>
          <address className="text-subtle not-italic">
            {address.firstName} {address.lastName}
            <br />
            {address.line1}
            {address.line2 ? (
              <>
                <br />
                {address.line2}
              </>
            ) : null}
            <br />
            {address.city}, {address.postcode}
          </address>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold">Payment</h3>
          <p className="text-subtle">
            {order.payment.brand} ending <span className="font-mono">{order.payment.last4}</span>
          </p>
        </div>
        <dl className="flex flex-col gap-2 border-t border-rule pt-4">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between gap-4">
              <dt className="text-subtle">{row.label}</dt>
              <dd className="font-mono">{row.value}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-4 border-t border-rule pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd className="font-mono">{formatPrice(order.total)}</dd>
          </div>
        </dl>
        <p className="-mt-4 text-xs text-subtle">
          Includes VAT of <span className="font-mono">{formatPrice(order.vat)}</span>
        </p>
      </div>
    </div>
  )
}
