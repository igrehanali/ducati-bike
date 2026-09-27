import type { Metadata } from "next"

import { CartView } from "@/components/checkout/cart-view"
import { catalog } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Your bag",
  description: "Review the items in your bag, apply a promo code and check out securely.",
  robots: { index: false },
}

function bestsellers() {
  const flagged = catalog.filter((p) => p.badge === "Bestseller" && p.stock > 0)
  const topRated = [...catalog].filter((p) => p.stock > 0 && !flagged.includes(p)).sort((a, b) => b.reviewCount - a.reviewCount)
  return [...flagged, ...topRated].slice(0, 8)
}

export default function CartPage() {
  return <CartView bestsellers={bestsellers()} />
}
