import Link from "next/link"

import { SectionTitle } from "@/components/section-title"
import { ProductRowSection } from "@/components/product-sections"
import { PageHeader } from "@/components/site/page-header"
import { catalog, type CategorySlug } from "@/lib/catalog"

import type { ShopCollection } from "./collections"
import { categoryEditorial } from "./editorial"
import { buildListing, type RawSearchParams } from "./listing"
import { ShopListing } from "./shop-listing"
import { CategoryTiles, DepartmentTiles } from "./tiles"

function bestsellersOutside(category: CategorySlug) {
  const others = catalog.filter((p) => p.category !== category && p.stock > 0)
  const best = others.filter((p) => p.badge === "Bestseller")
  const topRated = others.filter((p) => p.badge !== "Bestseller").sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
  return [...best, ...topRated].slice(0, 10)
}

export function ShopPage({ collection, params }: { collection: ShopCollection; params: RawSearchParams }) {
  const pathname = collection.slug ? `/shop/${collection.slug}` : "/shop"
  const listing = buildListing(collection.products, params, { allowCategory: collection.allowCategory })
  const { q } = listing.state
  const count = `${listing.total} ${listing.total === 1 ? "product" : "products"}`

  const header = q ? (
    <PageHeader
      title={`Results for “${q}”`}
      eyebrow={collection.kind === "all" ? "Search" : collection.title}
      crumbs={[...collection.crumbs.slice(0, -1), { label: collection.kind === "all" ? "Shop" : collection.title, href: pathname }, { label: "Search" }]}
      description={`${count} matching your search.`}
      className="pb-6"
    />
  ) : (
    <PageHeader
      title={collection.title}
      eyebrow={collection.eyebrow}
      description={collection.description}
      crumbs={collection.crumbs}
      image={collection.image}
      imagePosition={collection.imagePosition}
      className={collection.image ? undefined : "pb-6"}
    >
      <p className={collection.image ? "font-mono text-xs leading-[14px] tracking-[-0.2px] text-white/80 uppercase" : "font-mono text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase"}>
        {listing.baseCount} products
      </p>
    </PageHeader>
  )

  const editorial = collection.category ? categoryEditorial[collection.category.slug] : undefined

  return (
    <div className="pb-20">
      {header}

      {!q && collection.kind === "all" ? <DepartmentTiles className="pb-12" /> : null}
      {!q && collection.subcategories?.length ? <CategoryTiles items={collection.subcategories} className="pt-10 pb-12" /> : null}
      {collection.image && !q && !collection.subcategories?.length ? <div className="h-10" aria-hidden="true" /> : null}

      <ShopListing listing={listing} pathname={pathname} params={params} showCategory={collection.allowCategory} />

      {editorial && !q ? (
        <section className="px-5 pt-20">
          <div className="grid gap-6 border-t border-black pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
            <SectionTitle>{editorial.title}</SectionTitle>
            <div className="flex max-w-[720px] flex-col gap-4 text-base leading-6 text-subtle">
              {editorial.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className="text-sm">
                Need advice?{" "}
                <Link href="/contact" className="font-medium text-black underline underline-offset-4 hover:opacity-70">
                  Talk to our team
                </Link>{" "}
                or read our{" "}
                <Link href="/size-guide" className="font-medium text-black underline underline-offset-4 hover:opacity-70">
                  size guide
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {collection.category && !q ? (
        <ProductRowSection title="Bestsellers from across the store" products={bestsellersOutside(collection.category.slug)} />
      ) : null}
    </div>
  )
}
