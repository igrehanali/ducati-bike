"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckIcon } from "lucide-react"

import { deliveryWindow, formatDate, formatDeliveryWindow, matchOrder, methodForOrder, useHydrated, useNow, validateEmail } from "@/components/checkout/checkout-utils"
import { AddressBlock, InfoBlock, OrderLines, OrderTotals } from "@/components/checkout/order-parts"
import { Field, FormMessage, SubmitButton, TextInput } from "@/components/site/form"
import { orderStatus, useOrders, type Order } from "@/lib/account-store"
import { cn } from "@/lib/utils"

type Query = { number: string; email: string }

export function TrackOrder() {
  const params = useSearchParams()
  const initialNumber = params.get("order") ?? ""
  const initialEmail = params.get("email") ?? ""
  const [number, setNumber] = useState(initialNumber)
  const [email, setEmail] = useState(initialEmail)
  const [errors, setErrors] = useState<{ number?: string; email?: string }>({})
  const [query, setQuery] = useState<Query | null>(initialNumber && initialEmail ? { number: initialNumber, email: initialEmail } : null)
  const hydrated = useHydrated()
  const orders = useOrders()
  const now = useNow()

  function submit(event: FormEvent) {
    event.preventDefault()
    const next: typeof errors = {}
    if (!number.trim()) next.number = "Enter your order number"
    const emailError = validateEmail(email)
    if (emailError) next.email = emailError
    setErrors(next)
    if (next.number || next.email) {
      document.getElementById(next.number ? "track-number" : "track-email")?.focus()
      return
    }
    setQuery({ number: number.trim(), email: email.trim() })
  }

  const order = hydrated && query ? matchOrder(orders, query.number, query.email) : undefined

  return (
    <div className="flex flex-col gap-10 px-5 pb-20">
      <form onSubmit={submit} noValidate className="grid max-w-[880px] gap-5 border border-rule p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-start md:p-6">
        <Field label="Order number" htmlFor="track-number" error={errors.number} required hint="e.g. DS2609-12345 — it's in your confirmation email">
          <TextInput
            id="track-number"
            value={number}
            autoComplete="off"
            className="font-mono uppercase"
            invalid={Boolean(errors.number)}
            onChange={(e) => setNumber(e.target.value)}
          />
        </Field>
        <Field label="Email address" htmlFor="track-email" error={errors.email} required>
          <TextInput id="track-email" type="email" autoComplete="email" value={email} invalid={Boolean(errors.email)} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <SubmitButton className="md:mt-[23px]">Track order</SubmitButton>
      </form>

      <div aria-live="polite">
        {query && !hydrated ? <div className="h-[240px] animate-pulse bg-surface" aria-busy="true" /> : null}
        {query && hydrated && !order ? (
          <div className="flex max-w-[880px] flex-col gap-4">
            <FormMessage message={`We couldn't find order ${query.number.toUpperCase()} for ${query.email}.`} />
            <p className="text-sm leading-6 text-subtle">
              Please check the order number and email match your confirmation. In this demo store, orders are only saved in the browser they
              were placed in — if you ordered on another device, or need a hand, please{" "}
              <Link href="/contact" className="font-semibold text-black underline underline-offset-2">
                contact us
              </Link>{" "}
              and we&apos;ll help.
            </p>
          </div>
        ) : null}
        {order && now ? <OrderTracking order={order} now={now} /> : null}
      </div>
    </div>
  )
}

function OrderTracking({ order, now }: { order: Order; now: number }) {
  const status = orderStatus(order, now)
  const method = methodForOrder(order)
  const created = new Date(order.createdAt)
  const dispatchedAt = new Date(created.getTime() + 4 * 3_600_000)
  const { from } = deliveryWindow(order)
  const deliveredAt = new Date(Math.min(created.getTime() + 72 * 3_600_000, Math.max(from.getTime(), dispatchedAt.getTime())))
  const reachedIndex = { Processing: 1, Dispatched: 2, Delivered: 3 }[status]
  const collect = method.id === "collect"
  const time = (d: Date) => `${formatDate(d, { day: "numeric", month: "short" })}, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`

  const steps = [
    { label: "Ordered", date: time(created) },
    { label: "Processing", date: reachedIndex >= 1 ? time(created) : "" },
    { label: collect ? "Ready to collect" : "Dispatched", date: reachedIndex >= 2 ? time(dispatchedAt) : `Expected ${formatDate(dispatchedAt)}` },
    { label: collect ? "Collected" : "Delivered", date: reachedIndex >= 3 ? formatDate(deliveredAt, { weekday: "short", day: "numeric", month: "short" }) : `Estimated ${formatDeliveryWindow(order)}` },
  ]

  return (
    <section aria-labelledby="track-result" className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="flex flex-col gap-8 border border-rule p-5 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase">Order {order.number}</p>
            <h2 id="track-result" className="text-2xl leading-[30px] font-semibold tracking-[-0.6px]">
              {status === "Delivered" ? (collect ? "Collected" : "Delivered") : status === "Dispatched" ? (collect ? "Ready to collect" : "On its way") : "We're preparing your order"}
            </h2>
          </div>
          <p className="text-sm leading-5 text-subtle">Placed {formatDate(order.createdAt, { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>

        <ol className="flex flex-col md:grid md:grid-cols-4">
          {steps.map((step, index) => {
            const done = index <= reachedIndex
            const current = index === reachedIndex
            return (
              <li key={step.label} aria-current={current ? "step" : undefined} className="relative flex gap-4 pb-8 last:pb-0 md:flex-col md:gap-3 md:pr-4 md:pb-0">
                {index < steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-7 bottom-0 left-[13px] w-0.5 md:top-[13px] md:right-0 md:bottom-auto md:left-7 md:h-0.5 md:w-auto",
                      index < reachedIndex ? "bg-black" : "bg-chip"
                    )}
                  />
                ) : null}
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border-2",
                    done ? "border-black bg-black text-white" : "border-chip bg-white",
                    current && "ring-4 ring-black/10"
                  )}
                >
                  {done ? <CheckIcon className="size-4" strokeWidth={2.5} /> : null}
                </span>
                <div className="flex flex-col gap-0.5 pt-0.5 md:pt-0">
                  <p className={cn("text-sm leading-5 font-semibold", !done && "text-subtle")}>
                    {step.label}
                    <span className="sr-only">{done ? " — complete" : " — upcoming"}</span>
                  </p>
                  {step.date ? <p className="font-mono text-xs leading-4 text-subtle">{step.date}</p> : null}
                </div>
              </li>
            )
          })}
        </ol>

        <div className="grid gap-8 border-t border-rule pt-8 sm:grid-cols-2">
          <InfoBlock title={collect ? "Collection contact" : "Delivery address"}>
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
          </div>
        </div>
        <p className="text-sm leading-5 text-subtle">
          Something not right?{" "}
          <Link href={`/contact`} className="font-semibold text-black underline underline-offset-2">
            Contact our team
          </Link>{" "}
          and quote your order number.
        </p>
      </div>

      <aside aria-label="Items in this order" className="flex flex-col gap-6 bg-surface p-5 md:p-6">
        <h3 className="text-xl leading-6 font-semibold tracking-[-0.4px]">Items</h3>
        <OrderLines order={order} thumbClassName="bg-white" />
        <div className="border-t border-rule pt-6">
          <OrderTotals order={order} />
        </div>
      </aside>
    </section>
  )
}
