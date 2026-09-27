"use client"

import { useMemo, useState, type ComponentType, type SVGProps } from "react"
import Image from "next/image"

import {
  CaretDownIcon,
  SearchIcon,
  Stars1Icon,
  Stars2Icon,
  Stars3Icon,
  Stars45Icon,
  Stars4Icon,
  StarsSummaryIcon,
  VerifiedIcon,
} from "@/components/icons"
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { WriteReviewDialog } from "@/components/product/write-review-dialog"
import { useUserReviews } from "@/lib/account-store"
import type { Review, ReviewSummary } from "@/lib/reviews"

type StarIcon = ComponentType<SVGProps<SVGSVGElement>>

const starsByRating: Record<number, StarIcon> = {
  5: Stars45Icon,
  4: Stars4Icon,
  3: Stars3Icon,
  2: Stars2Icon,
  1: Stars1Icon,
}

const sortOptions = {
  newest: "Sort by date",
  oldest: "Oldest first",
  rating: "Highest rating",
} as const

type SortKey = keyof typeof sortOptions

const PAGE_SIZE = 3

type ReviewsProps = {
  summary: ReviewSummary
  reviews: Review[]
  productSlug: string
  productName: string
}

export function Reviews({ summary: baseSummary, reviews: baseReviews, productSlug, productName }: ReviewsProps) {
  const mine = useUserReviews()[productSlug]
  const reviews = useMemo(() => [...(mine ?? []), ...baseReviews], [mine, baseReviews])
  const summary = mine?.length
    ? {
        ...baseSummary,
        total: baseSummary.total + mine.length,
        breakdown: baseSummary.breakdown.map((row) => ({ ...row, count: row.count + mine.filter((r) => r.rating === row.stars).length })),
      }
    : baseSummary
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortKey>("newest")
  const [visible, setVisible] = useState(PAGE_SIZE)
  const maxCount = Math.max(...summary.breakdown.map((row) => row.count))

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = q ? reviews.filter((r) => `${r.author} ${r.title ?? ""} ${r.body}`.toLowerCase().includes(q)) : reviews
    return [...matches].sort((a, b) =>
      sort === "rating" ? b.rating - a.rating : sort === "oldest" ? b.daysAgo - a.daysAgo : a.daysAgo - b.daysAgo
    )
  }, [query, reviews, sort])

  return (
    <section id="reviews" className="flex scroll-mt-4 flex-col gap-10 px-5 py-20 font-paralucent md:px-10 lg:flex-row">
      {/* Summary */}
      <div className="flex w-full flex-col gap-4 lg:w-[424px] lg:shrink-0">
        <div className="flex items-center gap-2">
          <p className="text-[32px] leading-[41px] font-medium">{summary.average.toFixed(1)}</p>
          <div className="flex flex-col gap-[5px]">
            <StarsSummaryIcon aria-label={`${summary.average} out of 5 stars`} className="h-4 w-[84px]" />
            <p className="text-sm leading-[17px] text-[#212326]/70 uppercase">{summary.total} reviews</p>
          </div>
        </div>
        <ul className="flex flex-col gap-[13px]">
          {summary.breakdown.map((row) => {
            const Stars = starsByRating[row.stars]
            return (
              <li key={row.stars} className="flex items-center gap-5">
                <Stars aria-label={`${row.stars} stars`} className="h-4 w-[84px] shrink-0" />
                <span className="h-2 flex-1 bg-[#e0e0e0]/50">
                  <span className="block h-full bg-black" style={{ width: `${(row.count / maxCount) * 88}%` }} />
                </span>
                <span className="w-8 text-sm leading-[17px] text-[#212326]">{row.count}</span>
              </li>
            )
          })}
        </ul>
      </div>

      {/* List */}
      <div className="flex min-w-0 flex-1 flex-col gap-6 pb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#8f90a6] pb-4">
          <h2 className="font-sans text-[28px] leading-[36px] font-semibold md:text-[32px] md:leading-[41px]">Customer Reviews</h2>
          <WriteReviewDialog productSlug={productSlug} productName={productName} />
        </div>

        <div className="flex flex-wrap gap-5">
          <label className="flex h-[47px] w-full max-w-[230px] items-center gap-2.5 border border-black/60 px-5">
            <SearchIcon className="size-[25px] shrink-0" />
            <span className="sr-only">Search reviews</span>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setVisible(PAGE_SIZE)
              }}
              placeholder="SEARCH FOR REVIEWS"
              className="w-full min-w-0 bg-transparent text-sm leading-[17px] text-[#212326] outline-none placeholder:text-[#212326]"
            />
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-[47px] items-center gap-2.5 border border-black/60 px-5 text-sm leading-[17px] text-[#212326] uppercase">
              {sortOptions[sort]}
              <CaretDownIcon className="h-[11px] w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 rounded-none">
              <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(value as SortKey)}>
                {(Object.keys(sortOptions) as SortKey[]).map((key) => (
                  <DropdownMenuRadioItem key={key} value={key} className="rounded-none">
                    {key === "newest" ? "Newest first" : sortOptions[key]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-subtle">No reviews match “{query}”.</p>
        ) : (
          <ul className="flex flex-col gap-6">
            {filtered.slice(0, visible).map((review, index) => {
              const Stars = starsByRating[review.rating]
              return (
                <li key={review.id ?? index} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-4">
                      <Stars aria-label={`${review.rating} out of 5 stars`} className="h-4 w-[84px]" />
                      <p className="p-2.5 text-sm leading-[17px] capitalize">
                        {review.daysAgo === 0 ? "Today" : `${review.daysAgo} ${review.daysAgo === 1 ? "day" : "days"} ago`}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-lg leading-[22px] font-medium">{review.author}</p>
                      {review.verified ? (
                        <p className="flex items-center gap-[3px] text-sm leading-[17px]">
                          <VerifiedIcon className="size-[13px]" />
                          Verified Purchase
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {review.title ? <p className="text-base leading-5 font-semibold">{review.title}</p> : null}
                    <p className="text-sm leading-[17px] capitalize">{review.body}</p>
                  </div>
                  {review.image ? (
                    <div className="relative size-[141px] bg-[#f7f7f7]">
                      <Image src={review.image} alt="Photo attached to review" fill sizes="141px" className="object-contain p-1.5" />
                    </div>
                  ) : null}
                </li>
              )
            })}
          </ul>
        )}

        {visible < filtered.length ? (
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="mx-auto h-[42px] border border-[#0b0b0b] px-8 text-sm leading-[19px] font-semibold uppercase hover:bg-black hover:text-white"
          >
            Load more
          </button>
        ) : null}
      </div>
    </section>
  )
}
