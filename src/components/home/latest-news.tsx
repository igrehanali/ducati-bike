"use client"

import Image from "next/image"
import Link from "next/link"

import { ReadMoreArrowIcon } from "@/components/icons"
import { CarouselArrows, fourUpItem, SectionTitle } from "@/components/section-carousel"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

export type NewsItem = { date: string; title: string; excerpt: string; image: string; href: string }

export function LatestNews({ news }: { news: NewsItem[] }) {
  return (
    <section className="px-5 pt-20">
      <Carousel opts={{ align: "start" }} className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <SectionTitle>Trending &amp; latest news</SectionTitle>
          <div className="flex shrink-0 items-center gap-6">
            <Link href="/news" className="hidden text-base leading-[19px] font-semibold tracking-[-0.3px] hover:opacity-70 sm:block">
              View all news
            </Link>
            <CarouselArrows />
          </div>
        </div>

        <CarouselContent className="-ml-2">
          {news.map((item) => (
            <CarouselItem key={item.title} className={fourUpItem}>
              <article className="group flex flex-col gap-6">
                <div className="relative aspect-[344/467] overflow-hidden bg-surface">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 80vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
                    <time className="font-mono text-xs leading-[14px] font-medium tracking-[-0.2px] text-subtle">{item.date}</time>
                    <div className="flex flex-col gap-2">
                      <h3 className="truncate font-inter text-base leading-5 font-medium tracking-[-0.3px]">{item.title}</h3>
                      <p className="line-clamp-2 text-sm leading-[17px] tracking-[-0.3px] text-subtle">{item.excerpt}</p>
                    </div>
                  </div>
                  <Link href={item.href} className="flex w-fit items-center gap-2 text-base leading-5 tracking-[-0.3px] hover:opacity-70">
                    Read More<span className="sr-only">: {item.title}</span>
                    <ReadMoreArrowIcon className="size-5" />
                  </Link>
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
