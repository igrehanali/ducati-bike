import type { Metadata } from "next"

import { ContentSection } from "@/components/content/blocks"
import { GiftCardBalance, GiftCardBuilder } from "@/components/content/gift-cards"
import { PageHeader } from "@/components/site/page-header"
import { getProduct } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Gift Cards",
  description: "Give the gift of Vellora. Digital gift cards from £25, delivered by email and redeemable online or in our Weybridge showroom.",
  openGraph: { images: ["/media/page-gift-red.webp"] },
}

const GIFT_SLUGS = ["vellora-gift-card-25", "vellora-gift-card-50", "vellora-gift-card-100", "vellora-gift-card-250"]

const terms = [
  "Gift cards are valid for 24 months from the date of purchase.",
  "Redeemable online at velloramoto.co.uk and in our Weybridge showroom and workshop — including servicing and track days.",
  "Use your card across multiple orders until the balance runs out. If your order costs more, pay the difference by card or PayPal.",
  "Gift cards can’t be exchanged for cash, used to buy other gift cards or combined with promotional codes.",
  "Treat your gift card like cash: we can’t replace lost or stolen cards or refund unused balances.",
  "Gift cards are non-returnable, but you can change the delivery date or recipient email before it is sent by contacting us.",
]

export default function GiftCardsPage() {
  const products = GIFT_SLUGS.map((slug) => getProduct(slug))
    .filter((p) => p !== undefined)
    .map(({ slug, name, image, price }) => ({ slug, name, image, price }))

  return (
    <>
      <PageHeader
        title="Give the gift of Vellora"
        description="Digital gift cards from £25, delivered by email in minutes or on the date you choose. Perfect for gear, parts, servicing and track days."
        crumbs={[{ label: "Gift Cards" }]}
        image="/media/page-gift-red.webp"
        eyebrow="Gift cards"
      >
        <div className="flex flex-wrap gap-2 pt-3">
          <a href="#buy" className="flex h-[42px] items-center bg-white px-8 text-sm leading-[21px] font-medium text-black uppercase hover:bg-white/85">
            Buy a gift card
          </a>
          <a
            href="#balance"
            className="flex h-[42px] items-center border border-white px-8 text-sm leading-[21px] font-medium text-white uppercase transition-colors hover:bg-white hover:text-black"
          >
            Check balance
          </a>
        </div>
      </PageHeader>

      <ContentSection id="buy" title="Buy a gift card" eyebrow="Digital · delivered by email" intro="Choose an amount, add a personal message and pick when it arrives.">
        <GiftCardBuilder products={products} />
      </ContentSection>

      <ContentSection id="balance" title="Check your balance" eyebrow="Already have a card?">
        <GiftCardBalance />
      </ContentSection>

      <ContentSection id="terms" title="Gift card terms" className="pb-20">
        <ol className="grid gap-x-16 border-t border-black/15 md:grid-cols-2">
          {terms.map((term, index) => (
            <li key={term} className="flex gap-4 border-b border-black/15 py-5 text-sm leading-6 text-subtle">
              <span className="font-mono text-xs leading-6 text-black">{String(index + 1).padStart(2, "0")}</span>
              {term}
            </li>
          ))}
        </ol>
      </ContentSection>
    </>
  )
}
