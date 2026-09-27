import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { resolveCollection, shopSlugs } from "@/components/shop/collections"
import { ShopPage } from "@/components/shop/shop-page"

export function generateStaticParams() {
  return shopSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const collection = resolveCollection(slug)
  if (!collection) return { title: "Collection not found" }
  const image = collection.image ?? collection.category?.image
  return {
    title: collection.title,
    description: collection.description,
    alternates: { canonical: `/shop/${slug}` },
    openGraph: { title: collection.title, description: collection.description, images: image ? [image] : undefined },
  }
}

export default async function ShopCollectionPage({ params, searchParams }: PageProps<"/shop/[slug]">) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const collection = resolveCollection(slug)
  if (!collection) notFound()
  return <ShopPage collection={collection} params={query} />
}
