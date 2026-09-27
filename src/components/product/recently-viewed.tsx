"use client"

import { ProductRowSection } from "@/components/product-sections"
import { productsBySlugs } from "@/lib/catalog"
import { useRecentlyViewed } from "@/lib/wishlist-store"

export function RecentlyViewed({ exclude }: { exclude?: string }) {
  const slugs = useRecentlyViewed().filter((slug) => slug !== exclude)
  const products = productsBySlugs(slugs)
  if (products.length < 2) return null
  return <ProductRowSection title="Recently viewed" products={products} />
}
