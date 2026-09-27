/* Server-side listing logic for the shop: parse search params, filter, facet and sort products. */

import { bikes } from "@/lib/bikes"
import { categories, getCategory, PRICE_BUCKETS, SORTS, type Product, type SortId } from "@/lib/catalog"
import { searchCatalog } from "@/lib/search"

export const PAGE_SIZE = 24

export type RawSearchParams = Record<string, string | string[] | undefined>

export type ListingState = {
  q: string
  category: string[]
  size: string[]
  color: string[]
  price: string[]
  bike: string[]
  sale: boolean
  isNew: boolean
  stock: boolean
  sort: SortId
  page: number
}

export type FacetOption = { value: string; label: string; count: number; hex?: string }

export type Facets = {
  category: FacetOption[]
  price: FacetOption[]
  size: FacetOption[]
  color: FacetOption[]
  bike: FacetOption[]
  sale: number
  isNew: number
  stock: number
}

export type ActiveFilter = { key: string; value: string; label: string }

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? ""
const list = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value.join(",") : (value ?? ""))
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)

export function parseListingState(params: RawSearchParams): ListingState {
  const sort = first(params.sort)
  const page = Number.parseInt(first(params.page), 10)
  return {
    q: first(params.q).trim(),
    category: list(params.category),
    size: list(params.size),
    color: list(params.color),
    price: list(params.price),
    bike: list(params.bike),
    sale: first(params.sale) === "1",
    isNew: first(params.new) === "1",
    stock: first(params.stock) === "1",
    sort: SORTS.some((s) => s.id === sort) ? (sort as SortId) : "featured",
    page: Number.isFinite(page) && page > 1 ? Math.min(page, 50) : 1,
  }
}

export const isNewProduct = (p: Product) => p.isNew || p.badge === "New"

type FilterKey = "category" | "size" | "color" | "price" | "bike" | "sale" | "isNew" | "stock"

function matches(product: Product, state: ListingState, skip?: FilterKey) {
  if (skip !== "category" && state.category.length && !state.category.includes(product.category)) return false
  if (skip !== "size" && state.size.length && !product.sizes.some((s) => state.size.includes(s))) return false
  if (skip !== "color" && state.color.length && !product.colors.some((c) => state.color.includes(c.name))) return false
  if (skip !== "price" && state.price.length) {
    const inBucket = PRICE_BUCKETS.some((b) => state.price.includes(b.id) && product.price >= b.min && product.price < b.max)
    if (!inBucket) return false
  }
  if (skip !== "bike" && state.bike.length && !product.bikes.some((b) => state.bike.includes(b))) return false
  if (skip !== "sale" && state.sale && !product.compareAt) return false
  if (skip !== "isNew" && state.isNew && !isNewProduct(product)) return false
  if (skip !== "stock" && state.stock && product.stock <= 0) return false
  return true
}

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"]
function compareSizes(a: string, b: string) {
  const ia = SIZE_ORDER.indexOf(a)
  const ib = SIZE_ORDER.indexOf(b)
  if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
  const na = Number(a)
  const nb = Number(b)
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
  if (!Number.isNaN(na)) return -1
  if (!Number.isNaN(nb)) return 1
  return a.localeCompare(b)
}

function countBy(products: Product[], keys: (p: Product) => string[]) {
  const counts = new Map<string, number>()
  for (const product of products) for (const key of new Set(keys(product))) counts.set(key, (counts.get(key) ?? 0) + 1)
  return counts
}

function computeFacets(base: Product[], state: ListingState): Facets {
  const pool = (skip: FilterKey) => base.filter((p) => matches(p, state, skip))

  const categoryCounts = countBy(pool("category"), (p) => [p.category])
  const priceCounts = countBy(pool("price"), (p) =>
    PRICE_BUCKETS.filter((b) => p.price >= b.min && p.price < b.max).map((b) => b.id)
  )
  const sizeCounts = countBy(pool("size"), (p) => (p.sizes.length > 1 ? p.sizes : []))
  const colorPool = pool("color")
  const colorCounts = countBy(colorPool, (p) => p.colors.map((c) => c.name))
  const hexes = new Map<string, string>()
  for (const p of colorPool) for (const c of p.colors) if (!hexes.has(c.name)) hexes.set(c.name, c.hex)
  const bikeCounts = countBy(pool("bike"), (p) => p.bikes)

  // Keep selected options visible even when their count drops to zero, so they can be unticked.
  const withSelected = (counts: Map<string, number>, selected: string[]) => {
    for (const value of selected) if (!counts.has(value)) counts.set(value, 0)
    return counts
  }

  return {
    category: categories
      .filter((c) => withSelected(categoryCounts, state.category).has(c.slug))
      .map((c) => ({ value: c.slug, label: c.name, count: categoryCounts.get(c.slug) ?? 0 })),
    price: PRICE_BUCKETS.filter((b) => withSelected(priceCounts, state.price).has(b.id)).map((b) => ({
      value: b.id,
      label: b.label,
      count: priceCounts.get(b.id) ?? 0,
    })),
    size: [...withSelected(sizeCounts, state.size).entries()]
      .sort(([a], [b]) => compareSizes(a, b))
      .map(([value, count]) => ({ value, label: value, count })),
    color: [...withSelected(colorCounts, state.color).entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([value, count]) => ({ value, label: value, count, hex: hexes.get(value) ?? "#cccccc" })),
    bike: bikes
      .filter((b) => withSelected(bikeCounts, state.bike).has(b.slug))
      .map((b) => ({ value: b.slug, label: b.name, count: bikeCounts.get(b.slug) ?? 0 })),
    sale: pool("sale").filter((p) => p.compareAt).length,
    isNew: pool("isNew").filter(isNewProduct).length,
    stock: pool("stock").filter((p) => p.stock > 0).length,
  }
}

const featuredRank = (p: Product) => (p.badge === "Bestseller" ? 0 : isNewProduct(p) ? 1 : 2)

function sortProducts(products: Product[], sort: SortId, hasQuery: boolean) {
  const sorted = [...products]
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price)
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price)
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    default:
      // Search results keep relevance order; otherwise bestsellers and new arrivals lead.
      return hasQuery ? sorted : sorted.sort((a, b) => featuredRank(a) - featuredRank(b))
  }
}

function activeFilters(state: ListingState, facets: Facets): ActiveFilter[] {
  const label = (options: FacetOption[], value: string) => options.find((o) => o.value === value)?.label ?? value
  return [
    ...state.category.map((v) => ({ key: "category", value: v, label: getCategory(v)?.name ?? v })),
    ...state.price.map((v) => ({ key: "price", value: v, label: PRICE_BUCKETS.find((b) => b.id === v)?.label ?? v })),
    ...state.size.map((v) => ({ key: "size", value: v, label: `Size ${v}` })),
    ...state.color.map((v) => ({ key: "color", value: v, label: v })),
    ...state.bike.map((v) => ({ key: "bike", value: v, label: `Vellora ${label(facets.bike, v)}` })),
    ...(state.sale ? [{ key: "sale", value: "1", label: "On sale" }] : []),
    ...(state.isNew ? [{ key: "new", value: "1", label: "New in" }] : []),
    ...(state.stock ? [{ key: "stock", value: "1", label: "In stock" }] : []),
  ]
}

export type Listing = {
  state: ListingState
  total: number
  visible: Product[]
  facets: Facets
  active: ActiveFilter[]
  /** Size of the collection before filters and search, for the header. */
  baseCount: number
}

export function buildListing(collection: Product[], params: RawSearchParams, { allowCategory }: { allowCategory: boolean }): Listing {
  const state = parseListingState(params)
  if (!allowCategory) state.category = []

  let base = collection
  if (state.q) {
    const allowed = new Set(collection.map((p) => p.slug))
    base = searchCatalog(state.q, 1000)
      .flatMap((hit) => (hit.kind === "product" && allowed.has(hit.product.slug) ? [hit.product] : []))
  }

  const facets = computeFacets(base, state)
  const filtered = sortProducts(
    base.filter((p) => matches(p, state)),
    state.sort,
    Boolean(state.q)
  )

  return {
    state,
    total: filtered.length,
    visible: filtered.slice(0, state.page * PAGE_SIZE),
    facets,
    active: activeFilters(state, facets),
    baseCount: collection.length,
  }
}

/** Serialise params back to a query string, applying overrides (null removes a key). */
export function hrefWith(pathname: string, params: RawSearchParams, overrides: Record<string, string | null>) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    const v = Array.isArray(value) ? value.join(",") : value
    if (v) search.set(key, v)
  }
  for (const [key, value] of Object.entries(overrides)) {
    if (value === null || value === "") search.delete(key)
    else search.set(key, value)
  }
  const qs = search.toString()
  return qs ? `${pathname}?${qs}` : pathname
}

/** Href with one value removed from a (possibly multi-value) filter. */
export function hrefWithout(pathname: string, params: RawSearchParams, filter: ActiveFilter) {
  const current = list(params[filter.key]).filter((v) => v !== filter.value)
  return hrefWith(pathname, params, { [filter.key]: current.length ? current.join(",") : null, page: null })
}
