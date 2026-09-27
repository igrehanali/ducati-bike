import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { RiderGallery } from "@/components/home/rider-gallery"
import { EditorialStrip } from "@/components/product/editorial-strip"
import { PairWith } from "@/components/product/pair-with"
import { ProductAccordion } from "@/components/product/product-accordion"
import { ProductView } from "@/components/product/product-view"
import { RecentlyViewedLazy } from "@/components/product/recently-viewed-lazy"
import { Reviews } from "@/components/product/reviews"
import { ProductRowSection } from "@/components/product-sections"
import { Breadcrumbs } from "@/components/site/page-header"
import { catalog, getCategory, getProduct, pairingsFor, relatedProducts, toCard } from "@/lib/catalog"
import { productDetail, riderGallery } from "@/lib/data"
import { reviewsFor } from "@/lib/reviews"
import { sizeTableFor } from "@/lib/size-guide"

const DESIGNED = "veloce-5-perforated-leather-motorcycle-jacket-men"

export function generateStaticParams() {
  return catalog.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return { title: "Product not found" }
  return {
    title: product.name,
    description: product.description[0],
    openGraph: { title: product.name, description: product.description[0], images: [product.image] },
  }
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const designed = product.slug === DESIGNED
  const category = getCategory(product.category)!
  const pairWith = designed ? productDetail.pairWith : pairingsFor(product)
  const youMayAlsoLike = designed ? productDetail.youMayAlsoLike : relatedProducts(product)
  const { summary, reviews } = reviewsFor(product)
  const specs = product.specs.map((s) => `${s.label}: ${s.value}`)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    image: product.images.map((src) => `https://velloramoto.co.uk${src}`),
    description: product.description.join(" "),
    brand: { "@type": "Brand", name: "Vellora" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount },
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Breadcrumbs
        className="px-5 pt-4"
        items={[
          { label: category.name, href: `/shop/${category.slug}` },
          { label: product.name },
        ]}
      />
      <ProductView product={product} sizeTable={sizeTableFor(product.category)}>
        {pairWith.length ? <PairWith items={pairWith.map(toCard)} /> : null}
        <ProductAccordion
          sections={[
            { value: "description", title: "Description", paragraphs: product.description },
            designed
              ? { value: "construction", title: "Construction", paragraphs: productDetail.construction }
              : { value: "construction", title: "Features & Specifications", paragraphs: [...product.features, ...specs] },
            { value: "shipping", title: "Shipping & Returns", paragraphs: productDetail.shipping },
          ]}
        />
      </ProductView>
      {designed || category.department === "riding-wear" ? <EditorialStrip /> : null}
      <ProductRowSection title="You May Also Like" products={youMayAlsoLike} />
      <Reviews summary={summary} reviews={reviews} productSlug={product.slug} productName={product.name} />
      <RecentlyViewedLazy exclude={product.slug} />
      <RiderGallery title="Riders in the wild" images={riderGallery.slice(12, 18)} layout="strip" className="pb-20" />
    </>
  )
}
