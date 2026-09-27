import Link from "next/link"
import { XIcon } from "lucide-react"

import { ProductGrid } from "@/components/product/product-card"
import { getCategory, type CategorySlug } from "@/lib/catalog"

import { hrefWith, hrefWithout, PAGE_SIZE, type Listing, type RawSearchParams } from "./listing"
import { FilterPanel, FilterProvider, MobileFilters, ResultsRegion, SortSelect } from "./shop-filters"

const POPULAR: CategorySlug[] = ["helmets", "jackets", "gloves", "hoodies", "exhausts", "ebikes"]

function toQuery(params: RawSearchParams) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    const v = Array.isArray(value) ? value.join(",") : value
    if (v) search.set(key, v)
  }
  return search.toString()
}

type ShopListingProps = {
  listing: Listing
  pathname: string
  params: RawSearchParams
  showCategory: boolean
}

export function ShopListing({ listing, pathname, params, showCategory }: ShopListingProps) {
  const { total, visible, facets, active, state } = listing
  const clearHref = hrefWith(pathname, state.q ? { q: state.q } : {}, {})
  const nextPage = hrefWith(pathname, params, { page: String(state.page + 1) })
  const shown = visible.length

  return (
    <FilterProvider query={toQuery(params)}>
      <section id="products" className="scroll-mt-4 px-5" aria-label="Products">
        <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-6 flex max-h-[calc(100vh-3rem)] flex-col overflow-y-auto pr-2 [scrollbar-width:thin]">
              <h2 className="border-b border-black pb-3 text-sm leading-[17px] font-semibold tracking-[-0.3px] uppercase">Filters</h2>
              <FilterPanel facets={facets} showCategory={showCategory} />
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-3">
              <div className="flex items-center gap-4">
                <div className="lg:hidden">
                  <MobileFilters facets={facets} showCategory={showCategory} total={total} activeCount={active.length} />
                </div>
                <p aria-live="polite" className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase">
                  {total} {total === 1 ? "product" : "products"}
                </p>
              </div>
              <SortSelect className="max-sm:hidden" />
            </div>

            {active.length ? (
              <ul className="flex flex-wrap items-center gap-2 pt-4" aria-label="Active filters">
                {active.map((filter) => (
                  <li key={`${filter.key}-${filter.value}`}>
                    <Link
                      href={hrefWithout(pathname, params, filter)}
                      scroll={false}
                      aria-label={`Remove filter: ${filter.label}`}
                      className="flex h-8 items-center gap-1.5 bg-chip px-3 text-xs leading-[14px] font-medium tracking-[-0.2px] transition-colors hover:bg-black hover:text-white"
                    >
                      {filter.label}
                      <XIcon className="size-3.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={clearHref} scroll={false} className="ml-1 border-b border-black pb-0.5 text-xs leading-[14px] font-medium hover:opacity-70">
                    Clear all
                  </Link>
                </li>
              </ul>
            ) : null}

            <ResultsRegion>
              {total ? (
                <>
                  <h2 className="sr-only">Products</h2>
                  <ProductGrid products={visible} className="pt-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4" />
                  <div className="flex flex-col items-center gap-4 pt-14">
                    <p className="text-sm leading-[17px] tracking-[-0.3px] text-subtle">
                      Showing <span className="font-semibold text-black">{shown}</span> of {total}
                    </p>
                    <div className="h-0.5 w-full max-w-[240px] bg-black/10" aria-hidden="true">
                      <div className="h-full bg-black" style={{ width: `${Math.round((shown / total) * 100)}%` }} />
                    </div>
                    {shown < total ? (
                      <Link
                        href={nextPage}
                        scroll={false}
                        className="flex h-[42px] items-center justify-center border border-black bg-white px-8 text-sm leading-[21px] font-medium text-black uppercase transition-colors hover:bg-black hover:text-white"
                      >
                        Load {Math.min(PAGE_SIZE, total - shown)} more
                      </Link>
                    ) : null}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-start gap-4 py-16 md:items-center md:text-center">
                  <h2 className="text-2xl leading-[29px] font-semibold tracking-[-0.5px]">No products match</h2>
                  <p className="max-w-[420px] text-sm leading-5 text-subtle">
                    {state.q
                      ? `We couldn’t find anything for “${state.q}” with these filters. Try a different search or clear your filters.`
                      : "Try removing a filter, or browse one of our most popular categories."}
                  </p>
                  <Link
                    href={state.q && !active.length ? pathname : clearHref}
                    scroll={false}
                    className="flex h-[42px] items-center justify-center bg-black px-8 text-sm leading-[21px] font-medium text-white uppercase hover:bg-black/85"
                  >
                    {state.q && !active.length ? "Clear search" : "Clear filters"}
                  </Link>
                  <div className="flex flex-col gap-3 pt-6 md:items-center">
                    <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase">Popular categories</p>
                    <ul className="flex flex-wrap gap-2 md:justify-center">
                      {POPULAR.map((slug) => (
                        <li key={slug}>
                          <Link href={`/shop/${slug}`} className="flex h-9 items-center border border-black/20 px-4 text-sm hover:border-black">
                            {getCategory(slug)?.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </ResultsRegion>
          </div>
        </div>
      </section>
    </FilterProvider>
  )
}
