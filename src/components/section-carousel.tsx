"use client"

import { useState } from "react"
import Link from "next/link"

import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons"
import { ProductCard } from "@/components/product/product-card"
import { Carousel, CarouselContent, CarouselItem, useCarousel } from "@/components/ui/carousel"
import type { CardProduct } from "@/lib/catalog"
import { SectionTitle } from "@/components/section-title"
import { cn } from "@/lib/utils"

export { SectionTitle }

export function CarouselArrows({ className }: { className?: string }) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel()
  return (
    <div className={cn("flex shrink-0 gap-2", className)}>
      <button
        type="button"
        aria-label="Previous"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className="size-7 disabled:opacity-30"
      >
        <ArrowLeftIcon className="size-7" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={scrollNext}
        disabled={!canScrollNext}
        className="size-7 disabled:opacity-30"
      >
        <ArrowRightIcon className="size-7" />
      </button>
    </div>
  )
}

export function ViewAllLink({ href = "#", className }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "mx-auto block w-fit border-b border-black pb-2.5 text-sm leading-[17px] font-medium hover:opacity-70",
        className
      )}
    >
      VIEW ALL
    </Link>
  )
}

/** Four-up slider item sizing shared by product rows (344px at the 1440 design width). */
export const fourUpItem = "basis-[80%] pl-2 sm:basis-[45%] lg:basis-1/4"

export type ProductCarouselSectionProps = {
  id?: string
  title?: string
  tabs: Record<string, CardProduct[]>
  /** "inline" puts the tabs in place of the title (New Collection row). */
  layout?: "inline" | "stacked"
  viewAll?: boolean
  viewAllHref?: string
}

export function ProductCarouselSectionClient({ id, title, tabs, layout = "stacked", viewAll = true, viewAllHref = "/shop" }: ProductCarouselSectionProps) {
  const names = Object.keys(tabs)
  const [active, setActive] = useState(names[0])
  const items = tabs[active]

  const tabList = (
    <div role="tablist" className="flex gap-6 overflow-x-auto [scrollbar-width:none]">
      {names.map((name) => (
        <button
          key={name}
          type="button"
          role="tab"
          aria-selected={name === active}
          onClick={() => setActive(name)}
          className={cn(
            "shrink-0 border-b pb-2 text-lg leading-[22px] font-medium tracking-[-0.4px] whitespace-nowrap transition-colors",
            name === active ? "border-black text-black" : "border-transparent text-inactive hover:text-black"
          )}
        >
          {name}
        </button>
      ))}
    </div>
  )

  return (
    <section id={id} className="scroll-mt-4 px-5 pt-20">
      <Carousel key={active} opts={{ align: "start" }} className={cn("flex flex-col", layout === "inline" ? "gap-8" : "gap-6")}>
        <div className="flex flex-col gap-4">
          {layout === "stacked" && title ? <SectionTitle>{title}</SectionTitle> : null}
          {layout === "inline" ? <h2 className="sr-only">{title ?? "Featured products"}</h2> : null}
          <div className="flex items-center justify-between gap-3">
            {tabList}
            <CarouselArrows />
          </div>
        </div>
        <CarouselContent className="-ml-2">
          {items.map((product, index) => (
            <CarouselItem key={`${product.slug}-${index}`} className={fourUpItem}>
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {viewAll ? <ViewAllLink href={viewAllHref} /> : null}
      </Carousel>
    </section>
  )
}

export function ProductRowSectionClient({ title, products }: { title: string; products: CardProduct[] }) {
  return (
    <section className="px-5 pt-20">
      <Carousel opts={{ align: "start" }} className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <SectionTitle>{title}</SectionTitle>
          <CarouselArrows />
        </div>
        <CarouselContent className="-ml-2">
          {products.map((product) => (
            <CarouselItem key={product.slug} className={fourUpItem}>
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
