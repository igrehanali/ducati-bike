"use client"

import Image from "next/image"
import Link from "next/link"
import { HeartIcon } from "lucide-react"
import { toast } from "sonner"

import { useHydrated, usePromoCode } from "@/components/checkout/checkout-utils"
import { FreeShippingProgress, PaymentBadges, PromoCodeForm, TotalsRows, TrustPoints } from "@/components/checkout/summary-parts"
import { imageFit } from "@/components/product/product-card"
import { QuantityStepper } from "@/components/quantity-stepper"
import { ProductRowSection } from "@/components/product-sections"
import { PageHeader } from "@/components/site/page-header"
import { removeFromCart, setQuantity, useCartLines, type CartLine } from "@/lib/cart-store"
import { getProduct, relatedProducts, type Product } from "@/lib/catalog"
import { formatPrice } from "@/lib/format"
import { computeTotals } from "@/lib/pricing"
import { toggleWishlist, useWishlist } from "@/lib/wishlist-store"

export function CartView({ bestsellers }: { bestsellers: Product[] }) {
  const hydrated = useHydrated()
  const lines = useCartLines()
  const promoCode = usePromoCode()
  const count = lines.reduce((sum, line) => sum + line.quantity, 0)

  if (!hydrated) {
    return (
      <>
        <PageHeader title="Your bag" crumbs={[{ label: "Your bag" }]} description={<span className="inline-block h-6 w-24 animate-pulse bg-surface" />} />
        <div className="grid gap-10 px-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-16" aria-busy="true" aria-label="Loading your bag">
          <div className="flex flex-col gap-6">
            {[0, 1].map((i) => (
              <div key={i} className="flex gap-5 border-t border-rule pt-6">
                <div className="h-[160px] w-[120px] animate-pulse bg-surface" />
                <div className="flex flex-1 flex-col gap-3 pt-2">
                  <div className="h-4 w-2/3 animate-pulse bg-surface" />
                  <div className="h-4 w-1/3 animate-pulse bg-surface" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-[420px] animate-pulse bg-surface" />
        </div>
      </>
    )
  }

  if (lines.length === 0) {
    return (
      <>
        <PageHeader title="Your bag" crumbs={[{ label: "Your bag" }]} />
        <section className="mx-5 flex flex-col items-center gap-4 bg-surface px-5 py-16 text-center md:py-24">
          <h2 className="font-inter text-2xl leading-[30px] font-medium tracking-[-0.6px]">Your bag is empty</h2>
          <p className="max-w-[420px] text-base leading-6 text-subtle">
            Nothing in here yet. Explore the latest riding gear, helmets and Vellora lifestyle collections.
          </p>
          <Link
            href="/shop"
            className="mt-2 flex h-[42px] items-center bg-black px-8 text-sm leading-[21px] font-medium text-white uppercase hover:bg-black/85"
          >
            Start shopping
          </Link>
        </section>
        <div className="pb-20">
          <ProductRowSection title="Bestsellers" products={bestsellers} />
        </div>
      </>
    )
  }

  const totals = computeTotals(lines, "standard", promoCode)
  const firstProduct = getProduct(lines[0].slug)
  const inBag = new Set(lines.map((l) => l.slug))
  const related = (firstProduct ? relatedProducts(firstProduct, 12) : bestsellers).filter((p) => !inBag.has(p.slug)).slice(0, 8)
  const alsoLike = related.length >= 4 ? related : bestsellers.filter((p) => !inBag.has(p.slug))

  return (
    <>
      <PageHeader
        title="Your bag"
        crumbs={[{ label: "Your bag" }]}
        description={`${count} ${count === 1 ? "item" : "items"} · ${formatPrice(totals.subtotal)}`}
      />
      <div className="grid items-start gap-10 px-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-16">
        <section aria-labelledby="bag-items">
          <h2 id="bag-items" className="sr-only">
            Items in your bag
          </h2>
          <div className="hidden grid-cols-[minmax(0,1fr)_120px_110px] gap-6 border-b border-rule pb-3 text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase xl:grid">
            <span>Product</span>
            <span>Quantity</span>
            <span className="text-right">Total</span>
          </div>
          <ul className="border-t border-rule xl:border-t-0">
            {lines.map((line) => (
              <BagLine key={line.id} line={line} />
            ))}
          </ul>
          <Link href="/shop" className="mt-6 inline-block border-b border-black pb-1 text-sm leading-[17px] font-medium hover:opacity-70">
            ← CONTINUE SHOPPING
          </Link>
        </section>

        <aside aria-labelledby="summary-title" className="flex flex-col gap-6 border border-rule p-5 md:p-6 lg:sticky lg:top-6">
          <h2 id="summary-title" className="text-xl leading-6 font-semibold tracking-[-0.4px]">
            Order summary
          </h2>
          <FreeShippingProgress totals={totals} />
          <PromoCodeForm lines={lines} code={promoCode} />
          <TotalsRows totals={totals} shippingLabel="Standard delivery" />
          <div className="flex flex-col gap-3">
            <Link
              href="/checkout"
              className="flex h-[46px] items-center justify-center gap-2 bg-black px-8 text-sm leading-[21px] font-medium text-white uppercase hover:bg-black/85"
            >
              Checkout
            </Link>
            <Link href="/shop" className="text-center text-[13px] leading-[18px] text-subtle underline underline-offset-2 hover:text-black">
              Continue shopping
            </Link>
          </div>
          <PaymentBadges className="justify-center" />
          <TrustPoints className="border-t border-rule pt-5" />
        </aside>
      </div>
      <div className="pb-20">
        <ProductRowSection title="You may also like" products={alsoLike} />
      </div>
    </>
  )
}

function BagLine({ line }: { line: CartLine }) {
  const wishlist = useWishlist()
  const href = `/products/${line.slug}`

  function moveToWishlist() {
    if (!wishlist.includes(line.slug)) toggleWishlist(line.slug)
    removeFromCart(line.id)
    toast(`Moved ${line.name} to your wishlist`)
  }

  function remove() {
    removeFromCart(line.id)
    toast(`Removed ${line.name} from your bag`)
  }

  return (
    <li className="flex gap-4 border-b border-rule py-6 md:gap-6">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="relative h-[128px] w-[96px] shrink-0 overflow-hidden bg-surface md:h-[160px] md:w-[120px]">
        <Image src={line.image} alt="" fill sizes="120px" className={`${imageFit(line.image)} transition duration-500 hover:scale-[1.03]`} />
      </Link>
      <div className="grid min-w-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_120px_110px] xl:gap-6">
        <div className="flex min-w-0 flex-col gap-3">
          <Link href={href} className="font-inter text-sm leading-[17px] font-medium tracking-[-0.3px] uppercase hover:underline md:text-base md:leading-5">
            {line.name}
          </Link>
          <div className="flex flex-col gap-1 font-inter text-[13px] leading-[17px] tracking-[-0.3px]">
            {line.size ? (
              <p>
                Size: <span className="text-subtle">{line.size}</span>
              </p>
            ) : null}
            {line.color ? (
              <p>
                Colour: <span className="text-subtle">{line.color}</span>
              </p>
            ) : null}
            <p>
              Price: <span className="font-mono text-subtle">{formatPrice(line.price)}</span>
            </p>
          </div>
          <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
            <button type="button" onClick={moveToWishlist} className="flex items-center gap-1.5 text-[13px] leading-[18px] underline underline-offset-2 hover:text-subtle">
              <HeartIcon className="size-3.5" aria-hidden="true" />
              Move to wishlist
            </button>
            <button type="button" onClick={remove} className="text-[13px] leading-[18px] text-subtle underline underline-offset-2 hover:text-black">
              Remove<span className="sr-only"> {line.name}</span>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 xl:items-start xl:justify-start">
          <QuantityStepper size="sm" value={line.quantity} onChange={(q) => setQuantity(line.id, Math.min(q, 20))} />
          <p className="font-mono text-base leading-[19px] font-semibold tracking-[-0.3px] xl:hidden">{formatPrice(line.price * line.quantity)}</p>
        </div>
        <p className="hidden text-right font-mono text-base leading-[19px] font-semibold tracking-[-0.3px] xl:block">{formatPrice(line.price * line.quantity)}</p>
      </div>
    </li>
  )
}
