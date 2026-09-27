import type { Metadata } from "next"
import Link from "next/link"

import { PolicyLayout, PolicyNote, PolicyTable, type PolicySection } from "@/components/content/policy-layout"
import { formatPrice } from "@/lib/format"
import { showroom } from "@/lib/experiences"
import { FREE_SHIPPING_THRESHOLD, shippingMethods } from "@/lib/pricing"

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description: `UK delivery options, costs and timescales. Free standard delivery on orders over £${FREE_SHIPPING_THRESHOLD}.`,
}

const FREE = `£${FREE_SHIPPING_THRESHOLD}`

const timescales: Record<string, string> = {
  standard: "2–3 working days",
  express: "1–2 working days",
  "next-day": "Next working day if ordered by 2pm Mon–Fri",
  collect: "Ready within 24 hours",
}

const sections: PolicySection[] = [
  {
    id: "options",
    title: "Delivery options & costs",
    content: (
      <>
        <p>
          We deliver throughout the United Kingdom with tracked couriers. Standard delivery is <strong>free on orders over {FREE}</strong>{" "}
          (after any discounts). Your delivery options and costs are confirmed at checkout before you pay.
        </p>
        <PolicyTable
          caption="Delivery methods, costs and timescales"
          columns={["Method", "Cost", "Delivery time"]}
          rows={shippingMethods.map((method) => [
            method.label,
            <span key="price" className="font-mono">
              {method.price === 0 ? "Free" : formatPrice(method.price)}
              {method.id === "standard" ? ` · free over ${FREE}` : ""}
            </span>,
            timescales[method.id] ?? method.description,
          ])}
        />
        <p>Working days are Monday to Friday, excluding UK bank holidays. Timescales start from dispatch, not from the time you order.</p>
      </>
    ),
  },
  {
    id: "dispatch",
    title: "Order processing & dispatch",
    content: (
      <>
        <p>
          Orders placed before <strong>2pm Monday to Friday</strong> are usually picked, packed and dispatched the same day. Orders placed after 2pm, at the weekend or on a
          bank holiday are dispatched on the next working day.
        </p>
        <p>
          During launches, sales and the run-up to Christmas dispatch can take up to two working days. We&apos;ll always show any expected delays on the product page and at
          checkout.
        </p>
      </>
    ),
  },
  {
    id: "areas",
    title: "Where we deliver",
    content: (
      <>
        <p>
          <strong>We currently ship to UK addresses only.</strong> We don&apos;t deliver to the Channel Islands, the Isle of Man, BFPO addresses or outside the United
          Kingdom.
        </p>
        <PolicyNote title="Scottish Highlands, islands & Northern Ireland">
          We deliver to the Scottish Highlands, Scottish islands, Isles of Scilly and Northern Ireland at no extra cost, but please allow an additional 1–3 working days.
          Next working day delivery is not available to these postcodes (including AB31–38, AB44–56, FK17–21, HS, IV, KA27–28, KW, PA20–49, PA60–78, PH17–26, PH30–44,
          PH49–50, TR21–25, ZE and BT).
        </PolicyNote>
        <p>
          Large items such as eBikes and exhausts are delivered by a two-person courier on a pre-booked day. We&apos;ll contact you to arrange a slot once your order is
          ready.
        </p>
      </>
    ),
  },
  {
    id: "collect",
    title: "Click & collect",
    content: (
      <>
        <p>
          Choose click &amp; collect at checkout to pick your order up free of charge from our showroom at {showroom.address.join(", ")}. We&apos;ll email you when it&apos;s
          ready — usually within 24 hours.
        </p>
        <p>Please bring your order confirmation and photo ID. We&apos;ll hold your order for 14 days; after that it will be cancelled and refunded.</p>
      </>
    ),
  },
  {
    id: "tracking",
    title: "Tracking your parcel",
    content: (
      <>
        <p>
          When your order leaves us you&apos;ll receive a dispatch email with a tracking link. You can also check its progress any time on our{" "}
          <Link href="/track-order">track your order</Link> page using your order number and email address.
        </p>
        <p>If nobody is home, the courier will leave a card or follow your safe-place instructions and try again on the next working day.</p>
      </>
    ),
  },
  {
    id: "problems",
    title: "Missing or damaged deliveries",
    content: (
      <>
        <p>
          Please check your parcel on arrival. If anything is damaged or missing, <Link href="/contact?topic=order">contact us</Link> within 7 days with your order number
          and a photo of the packaging. We&apos;ll send a replacement or issue a full refund.
        </p>
        <p>If your tracking shows delivered but you haven&apos;t received your parcel, let us know within 48 hours so we can open an investigation with the courier.</p>
      </>
    ),
  },
]

export default function ShippingPage() {
  return (
    <PolicyLayout
      title="Shipping & delivery"
      description={`Fast, tracked delivery across the UK — free standard delivery on orders over ${FREE}.`}
      crumb="Shipping"
      updated="1 September 2026"
      sections={sections}
    />
  )
}
