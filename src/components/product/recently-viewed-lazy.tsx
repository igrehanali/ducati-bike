"use client"

import { lazy, Suspense, useSyncExternalStore } from "react"

// Below the fold and needs the catalog: fetched only after the page has hydrated.
const RecentlyViewed = lazy(() => import("@/components/product/recently-viewed").then((m) => ({ default: m.RecentlyViewed })))

const subscribe = () => () => {}

export function RecentlyViewedLazy({ exclude }: { exclude?: string }) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)
  if (!mounted) return null
  return (
    <Suspense fallback={null}>
      <RecentlyViewed exclude={exclude} />
    </Suspense>
  )
}
