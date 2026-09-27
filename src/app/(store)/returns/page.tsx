import type { Metadata } from "next"
import Link from "next/link"

import { PolicyLayout, PolicyNote, PolicyTable, type PolicySection } from "@/components/content/policy-layout"
import { showroom } from "@/lib/experiences"

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description: "30-day returns on unworn items, free exchanges and fast refunds. Helmets and underwear are non-returnable for hygiene reasons.",
}

const sections: PolicySection[] = [
  {
    id: "overview",
    title: "Our 30-day returns promise",
    content: (
      <>
        <p>
          If you&apos;re not completely happy, you can return most items within <strong>30 days of delivery</strong> for a full refund or exchange. Items must be unworn,
          unwashed and unused, in their original packaging with all tags and labels attached.
        </p>
        <p>
          This is in addition to your statutory rights under the Consumer Rights Act 2015 and the Consumer Contracts Regulations 2013, including your right to cancel an
          online order within 14 days of delivery.
        </p>
      </>
    ),
  },
  {
    id: "non-returnable",
    title: "Non-returnable items",
    content: (
      <>
        <PolicyNote title="Hygiene exclusions">
          For health and hygiene reasons, <strong>helmets and underwear</strong> (including base layers, balaclavas and socks) cannot be returned once the protective seal or
          packaging has been opened or the item has been tried on, unless they are faulty.
        </PolicyNote>
        <p>We&apos;re also unable to accept returns of:</p>
        <ul>
          <li>Gift cards and track day or service bookings (see their own terms)</li>
          <li>Personalised or made-to-measure items, including custom race suits</li>
          <li>Parts that have been fitted to a motorcycle, or electrical parts removed from sealed packaging</li>
          <li>Items showing signs of wear, damage or odours such as smoke or perfume</li>
        </ul>
        <p>
          Unsure about helmet sizing? Visit our showroom for a free fitting, or check the <Link href="/size-guide#helmets">helmet size guide</Link> before you order.
        </p>
      </>
    ),
  },
  {
    id: "how-to-return",
    title: "How to return an item",
    content: (
      <>
        <ol>
          <li>
            <strong>Start your return.</strong> Sign in to your <Link href="/account">account</Link> or <Link href="/contact?topic=returns">contact us</Link> with your order
            number and the items you&apos;d like to send back.
          </li>
          <li>
            <strong>Print your label.</strong> We&apos;ll email a prepaid Royal Mail Tracked returns label (£3.95, deducted from your refund — free for exchanges and faulty
            items).
          </li>
          <li>
            <strong>Pack it up.</strong> Use the original packaging where possible and include the returns slip from your parcel.
          </li>
          <li>
            <strong>Drop it off.</strong> Take your parcel to any Post Office or parcel locker and keep your proof of postage.
          </li>
        </ol>
        <p>
          You can also return items in person at our showroom: {showroom.address.join(", ")}. In-store returns are free and refunded immediately to your original payment
          method.
        </p>
      </>
    ),
  },
  {
    id: "refunds",
    title: "Refunds",
    content: (
      <>
        <p>Once your return arrives we&apos;ll inspect it and email you to confirm your refund. Refunds go back to your original payment method.</p>
        <PolicyTable
          caption="Refund timelines"
          columns={["Stage", "Typical time"]}
          rows={[
            ["Return in transit to us", "2–4 working days with Royal Mail Tracked"],
            ["Inspection & refund issued", "Within 3 working days of arrival"],
            ["Money back in your account", "3–5 working days, depending on your bank"],
            ["PayPal refunds", "Usually within 24 hours of being issued"],
          ]}
        />
        <p>
          Original delivery charges are refunded if you return your whole order within 14 days, or if the item is faulty or we sent the wrong thing. Express and next-day
          upgrade fees are non-refundable.
        </p>
      </>
    ),
  },
  {
    id: "exchanges",
    title: "Exchanges",
    content: (
      <>
        <p>
          Need a different size or colour? Exchanges are <strong>free</strong>. Choose exchange when you start your return and we&apos;ll reserve the replacement straight
          away, then dispatch it as soon as your original item is scanned by the courier.
        </p>
        <p>If the replacement costs more or less, we&apos;ll take or refund the difference. If your new size is out of stock we&apos;ll refund you in full instead.</p>
      </>
    ),
  },
  {
    id: "faulty",
    title: "Faulty or incorrect items",
    content: (
      <>
        <p>
          If an item is faulty, damaged or not what you ordered, <Link href="/contact?topic=returns">contact us</Link> with your order number and photos. We&apos;ll arrange a free
          collection and send a replacement or refund in full, including delivery costs.
        </p>
        <p>
          Apparel and accessories carry a two-year manufacturer&apos;s warranty. Faults caused by normal wear and tear, crashes, incorrect fitting or care are not covered.
        </p>
      </>
    ),
  },
]

export default function ReturnsPage() {
  return (
    <PolicyLayout
      title="Returns & exchanges"
      description="30 days to change your mind, free exchanges and quick refunds — here’s how it works."
      crumb="Returns"
      updated="1 September 2026"
      sections={sections}
    />
  )
}
