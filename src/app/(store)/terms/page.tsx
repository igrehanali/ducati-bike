import type { Metadata } from "next"
import Link from "next/link"

import { PolicyLayout, PolicyNote, type PolicySection } from "@/components/content/policy-layout"
import { showroom } from "@/lib/experiences"

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms and conditions that apply when you use the Vellora Moto UK website and buy from us.",
}

const sections: PolicySection[] = [
  {
    id: "about",
    title: "About these terms",
    content: (
      <>
        <p>
          These terms apply to your use of this website and to any order you place with Vellora Moto UK, an official Vellora dealer at {showroom.address.join(", ")}.
          Please read them before ordering. By placing an order you agree to be bound by them.
        </p>
        <p>We may update these terms from time to time. The version on the website when you place your order is the one that applies.</p>
      </>
    ),
  },
  {
    id: "ordering",
    title: "Ordering & contract",
    content: (
      <>
        <p>
          When you place an order we&apos;ll email you to acknowledge it. This is not an acceptance. A contract is formed only when we email to confirm your order has been
          dispatched (or is ready to collect).
        </p>
        <p>
          We may decline an order, for example if an item is out of stock, if we can&apos;t authorise payment, if there is an obvious pricing error or if we suspect fraud.
          If we do, we&apos;ll let you know and refund any payment in full.
        </p>
        <p>You must be 18 or over to place an order. Orders are for personal use only and not for resale.</p>
      </>
    ),
  },
  {
    id: "pricing",
    title: "Pricing & VAT",
    content: (
      <>
        <p>
          All prices are in pounds sterling (GBP) and <strong>include VAT</strong> at the current UK rate of 20%. Delivery charges are shown separately at checkout.
        </p>
        <p>
          We work hard to make sure prices are correct. If we discover an error after you order, we&apos;ll contact you to ask whether you want to continue at the correct
          price or cancel for a full refund.
        </p>
        <p>Promotional codes can&apos;t be combined, exchanged for cash, or used on gift cards, track days or services unless stated.</p>
      </>
    ),
  },
  {
    id: "availability",
    title: "Availability",
    content: (
      <>
        <p>
          All products are subject to availability. Stock levels on the website are updated regularly but may occasionally differ from our warehouse. If an item becomes
          unavailable after you order, we&apos;ll tell you as soon as possible and refund you for that item.
        </p>
        <p>Product images are for illustration. Colours may vary slightly depending on your screen.</p>
      </>
    ),
  },
  {
    id: "delivery-returns",
    title: "Delivery & returns",
    content: (
      <p>
        Delivery is to UK addresses only. See our <Link href="/shipping">shipping policy</Link> for methods, costs and timescales and our{" "}
        <Link href="/returns">returns policy</Link> for how to cancel or return an order. Risk in the goods passes to you on delivery; ownership passes once we&apos;ve received
        full payment.
      </p>
    ),
  },
  {
    id: "warranty",
    title: "Warranty",
    content: (
      <>
        <p>
          Goods we sell must be as described, of satisfactory quality and fit for purpose. In addition, apparel and accessories carry a <strong>two-year manufacturer&apos;s
          warranty</strong> against defects in materials and workmanship.
        </p>
        <p>
          The warranty doesn&apos;t cover normal wear and tear, crash damage, misuse, incorrect fitting, modification or failure to follow care instructions. Helmets involved in
          an impact should always be replaced. Parts fitted by our workshop maintain your motorcycle&apos;s Vellora factory warranty.
        </p>
      </>
    ),
  },
  {
    id: "experiences",
    title: "Track days, service & gift cards",
    content: (
      <>
        <p>
          Track day bookings are subject to the circuit&apos;s own rules and the rider declaration you sign on the day. Places can be transferred to another date up to 14 days
          before the event; later cancellations are non-refundable unless we can resell your place.
        </p>
        <p>
          Service bookings are requests until we confirm a drop-off time. Estimates are provided before any additional work is carried out. Gift cards are valid for 24
          months, can&apos;t be exchanged for cash and are covered by the <Link href="/gift-cards">gift card terms</Link>.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Our liability",
    content: (
      <>
        <p>
          If we fail to comply with these terms, we are responsible for loss or damage you suffer that is a foreseeable result of our breach or our negligence. We are not
          responsible for loss or damage that is not foreseeable, or for any business losses.
        </p>
        <PolicyNote>
          Nothing in these terms limits or excludes our liability for death or personal injury caused by our negligence, for fraud or fraudulent misrepresentation, or for
          any other liability that cannot be limited or excluded under English law — including your statutory rights as a consumer.
        </PolicyNote>
      </>
    ),
  },
  {
    id: "website-use",
    title: "Using our website",
    content: (
      <p>
        All content on this site, including text, images and logos, belongs to us or our licensors, including Vellora Motor Holding S.p.A. You may view and print it for
        personal use but must not copy, reproduce or use it commercially without permission. You must not misuse the site by introducing viruses or attempting to gain
        unauthorised access.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    content: (
      <>
        <p>
          These terms are governed by the law of <strong>England and Wales</strong>. You can bring legal proceedings in the courts of England and Wales; if you live in
          Scotland or Northern Ireland you can also bring proceedings in your local courts.
        </p>
        <p>
          If you have a complaint, please <Link href="/contact">contact us</Link> first — we aim to resolve every issue quickly and fairly.
        </p>
      </>
    ),
  },
]

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms of use"
      description="The terms that apply when you browse our website and buy from Vellora Moto UK."
      crumb="Terms of Use"
      updated="1 September 2026"
      sections={sections}
    />
  )
}
