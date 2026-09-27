"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckIcon, MailIcon } from "lucide-react"

import { formatDate, formatDeliveryWindow, matchOrder, methodForOrder, useHydrated } from "@/components/checkout/checkout-utils"
import { AddressBlock, InfoBlock, OrderLines, OrderTotals } from "@/components/checkout/order-parts"
import { Breadcrumbs } from "@/components/site/page-header"
import { useCurrentUser, useOrders } from "@/lib/account-store"

const primary = "flex h-[46px] items-center justify-center bg-black px-8 text-sm leading-[21px] font-medium text-white uppercase hover:bg-black/85"
const secondary =
  "flex h-[46px] items-center justify-center border border-black bg-white px-8 text-sm leading-[21px] font-medium text-black uppercase transition-colors hover:bg-black hover:text-white"

export function OrderSuccessSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6 px-5 pt-16 pb-20" aria-busy="true" aria-label="Loading your order">
      <div className="size-16 animate-pulse rounded-full bg-surface" />
      <div className="h-9 w-72 max-w-full animate-pulse bg-surface" />
      <div className="h-5 w-56 max-w-full animate-pulse bg-surface" />
      <div className="mt-6 h-[320px] w-full max-w-[960px] animate-pulse bg-surface" />
    </div>
  )
}

export function OrderSuccess() {
  const params = useSearchParams()
  const number = params.get("order") ?? ""
  const hydrated = useHydrated()
  const orders = useOrders()
  const user = useCurrentUser()

  if (!hydrated) return <OrderSuccessSkeleton />

  const order = number ? matchOrder(orders, number) : undefined

  if (!order) {
    return (
      <>
        <Breadcrumbs items={[{ label: "Order confirmation" }]} className="px-5 pt-6" />
        <section className="mx-5 mt-8 mb-20 flex flex-col items-center gap-4 bg-surface px-5 py-16 text-center md:py-24">
          <h1 className="font-inter text-2xl leading-[30px] font-medium tracking-[-0.6px]">We can&apos;t show this order here</h1>
          <p className="max-w-[520px] text-base leading-6 text-subtle">
            {number ? (
              <>
                Order <span className="font-mono text-black">{number}</span> isn&apos;t saved in this browser.
              </>
            ) : (
              "No order number was provided."
            )}{" "}
            Your confirmation email has all the details, or you can look it up with your order number and email address.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link href={number ? `/track-order?order=${encodeURIComponent(number)}` : "/track-order"} className={primary}>
              Track an order
            </Link>
            <Link href="/shop" className={secondary}>
              Continue shopping
            </Link>
          </div>
        </section>
      </>
    )
  }

  const method = methodForOrder(order)
  const trackHref = `/track-order?order=${encodeURIComponent(order.number)}&email=${encodeURIComponent(order.email)}`
  const ownedByUser = user && user.email.toLowerCase() === order.email.toLowerCase()

  return (
    <div className="flex flex-col gap-10 px-5 pt-6 pb-20">
      <Breadcrumbs items={[{ label: "Order confirmation" }]} />

      <header className="flex flex-col items-center gap-4 pt-6 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-black text-white">
          <CheckIcon className="size-8" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase">Order confirmed</p>
        <h1 className="text-[32px] leading-[38px] font-semibold tracking-[-0.6px] md:text-[42px] md:leading-[50px]">
          Thank you, {order.address.firstName}!
        </h1>
        <p className="text-base leading-6">
          Your order number is <span className="font-mono font-semibold">{order.number}</span>
        </p>
        <p className="flex max-w-[520px] items-start gap-2 text-sm leading-5 text-subtle">
          <MailIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>
            A confirmation email is on its way to <span className="text-black">{order.email}</span>. We&apos;ll email you again when your order ships.
          </span>
        </p>
      </header>

      <div className="mx-auto grid w-full max-w-[1040px] items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section aria-labelledby="success-details" className="flex flex-col gap-8 border border-rule p-5 md:p-8">
          <h2 id="success-details" className="text-xl leading-6 font-semibold tracking-[-0.4px]">
            Order details
          </h2>
          <div className="border-l-4 border-black bg-surface px-4 py-3.5">
            <p className="text-xs leading-4 text-subtle uppercase">{method.id === "collect" ? "Ready to collect" : "Estimated delivery"}</p>
            <p className="text-lg leading-6 font-semibold tracking-[-0.4px]">{formatDeliveryWindow(order)}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <InfoBlock title={method.id === "collect" ? "Collection contact" : "Delivery address"}>
              <AddressBlock address={order.address} />
            </InfoBlock>
            <div className="flex flex-col gap-6">
              <InfoBlock title="Delivery method">
                <p className="text-sm leading-5">{order.shippingMethod}</p>
                <p className="text-[13px] leading-[18px] text-subtle">{method.description}</p>
              </InfoBlock>
              <InfoBlock title="Payment">
                <p className="font-mono text-sm leading-5">
                  {order.payment.brand} •••• {order.payment.last4}
                </p>
              </InfoBlock>
              <InfoBlock title="Order date">
                <p className="text-sm leading-5">{formatDate(order.createdAt, { day: "numeric", month: "long", year: "numeric" })}</p>
              </InfoBlock>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={trackHref} className={primary}>
              Track your order
            </Link>
            <Link href="/shop" className={secondary}>
              Continue shopping
            </Link>
          </div>
          {ownedByUser ? (
            <p className="text-sm leading-5 text-subtle">
              This order is saved to your account.{" "}
              <Link href="/account" className="font-semibold text-black underline underline-offset-2">
                View your account
              </Link>
            </p>
          ) : null}
        </section>

        <aside aria-labelledby="success-summary" className="flex flex-col gap-6 bg-surface p-5 md:p-6 lg:sticky lg:top-6">
          <h2 id="success-summary" className="text-xl leading-6 font-semibold tracking-[-0.4px]">
            Summary
          </h2>
          <OrderLines order={order} thumbClassName="bg-white" />
          <div className="border-t border-rule pt-6">
            <OrderTotals order={order} />
          </div>
        </aside>
      </div>
    </div>
  )
}
