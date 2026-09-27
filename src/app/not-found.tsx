import type { Metadata } from "next"
import Link from "next/link"

import { buttonPrimary, buttonSecondary } from "@/components/content/blocks"
import { SearchButton } from "@/components/content/search-button"
import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { ProductGrid } from "@/components/product/product-card"
import { SectionTitle } from "@/components/section-title"
import { catalog } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
}

const popular = [
  { label: "New 2026 collection", href: "/shop/new-2026" },
  { label: "Helmets", href: "/shop/helmets" },
  { label: "Track days", href: "/track-days" },
  { label: "Gift cards", href: "/gift-cards" },
]

export default function NotFound() {
  const bestsellers = catalog.filter((product) => product.badge === "Bestseller").slice(0, 4)

  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main id="main" className="flex-1 pb-20">
        <section className="relative isolate overflow-hidden px-5 pt-16 pb-4 md:pt-24">
          <p
            aria-hidden="true"
            className="pointer-events-none absolute -top-4 right-0 -z-10 font-inter text-[160px] leading-none font-medium tracking-[-8px] text-surface select-none md:-top-10 md:text-[360px] md:tracking-[-20px]"
          >
            404
          </p>
          <div className="flex max-w-[640px] flex-col gap-5">
            <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-brand-dark uppercase">Error 404</p>
            <h1 className="font-inter text-[34px] leading-[42px] font-medium tracking-[-1px] md:text-5xl md:leading-[58px]">This page took a wrong turn.</h1>
            <p className="text-base leading-6 text-subtle">
              The page you&apos;re looking for may have moved, sold out or never existed. Try a search, or head back to familiar roads.
            </p>
            <SearchButton />
            <div className="flex flex-wrap gap-2 pt-2">
              <Link href="/shop" className={buttonPrimary}>
                Shop all
              </Link>
              <Link href="/" className={buttonSecondary}>
                Home
              </Link>
              <Link href="/contact" className={buttonSecondary}>
                Contact us
              </Link>
            </div>
            <nav aria-label="Popular pages" className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 text-sm leading-[17px]">
              <span className="text-subtle">Popular:</span>
              {popular.map((link) => (
                <Link key={link.href} href={link.href} className="font-semibold underline-offset-2 hover:underline">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </section>

        {bestsellers.length ? (
          <section className="px-5 pt-20">
            <SectionTitle className="mb-6">Our bestsellers</SectionTitle>
            <ProductGrid products={bestsellers} />
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  )
}
