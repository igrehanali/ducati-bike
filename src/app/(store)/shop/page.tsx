import type { Metadata } from "next"

import { allShop } from "@/components/shop/collections"
import { ShopPage } from "@/components/shop/shop-page"

export async function generateMetadata({ searchParams }: PageProps<"/shop">): Promise<Metadata> {
  const { q } = await searchParams
  const query = Array.isArray(q) ? q[0] : q
  if (query) return { title: `Search results for “${query}”`, robots: { index: false } }
  return { title: "Shop all", description: allShop.description }
}

export default async function ShopAllPage({ searchParams }: PageProps<"/shop">) {
  const params = await searchParams
  return <ShopPage collection={allShop} params={params} />
}
