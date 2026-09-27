/* Listing options, safe for client components. */

export const PRICE_BUCKETS = [
  { id: "0-50", label: "Under £50", min: 0, max: 50 },
  { id: "50-150", label: "£50 – £150", min: 50, max: 150 },
  { id: "150-500", label: "£150 – £500", min: 150, max: 500 },
  { id: "500-1500", label: "£500 – £1,500", min: 500, max: 1500 },
  { id: "1500+", label: "£1,500+", min: 1500, max: Infinity },
]

export const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
] as const

export type SortId = (typeof SORTS)[number]["id"]
