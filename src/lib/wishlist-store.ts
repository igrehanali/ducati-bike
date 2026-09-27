import { createLocalStore } from "@/lib/local-store"

const wishlist = createLocalStore<string[]>("vellora-moto-wishlist", [])
const recentlyViewed = createLocalStore<string[]>("vellora-moto-recently-viewed", [])

export const useWishlist = wishlist.useValue

export function toggleWishlist(slug: string) {
  let added = false
  wishlist.set((list) => {
    added = !list.includes(slug)
    return added ? [slug, ...list] : list.filter((s) => s !== slug)
  })
  return added
}

export function removeFromWishlist(slug: string) {
  wishlist.set((list) => list.filter((s) => s !== slug))
}

export function clearWishlist() {
  wishlist.set([])
}

export const useRecentlyViewed = recentlyViewed.useValue

export function trackRecentlyViewed(slug: string) {
  recentlyViewed.set((list) => [slug, ...list.filter((s) => s !== slug)].slice(0, 12))
}
