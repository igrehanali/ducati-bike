import type { Metadata } from "next"
import { Suspense } from "react"

import { WishlistSkeleton, WishlistView } from "@/components/account/wishlist-view"

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved Vellora Moto UK pieces — add them to your bag or share the list.",
  robots: { index: false, follow: true },
}

export default function WishlistPage() {
  return (
    <Suspense fallback={<WishlistSkeleton />}>
      <WishlistView />
    </Suspense>
  )
}
