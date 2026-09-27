"use client"

import Image from "next/image"
import Link from "next/link"

import { CarouselArrows, fourUpItem, SectionTitle } from "@/components/section-carousel"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { collections } from "@/lib/site-content"

export function CollectionsSection() {
  return (
    <section id="collections" className="scroll-mt-4 px-5 pt-20">
      <Carousel opts={{ align: "start" }} className="flex flex-col gap-8">
        <div className="flex items-center justify-between gap-3">
          <SectionTitle>Our collections</SectionTitle>
          <CarouselArrows />
        </div>
        <CarouselContent className="-ml-2">
          {collections.map((collection) => (
            <CarouselItem key={collection.name} className={fourUpItem}>
              <Link href={collection.href} className="group flex flex-col gap-3">
                <div className="relative aspect-[344/458] overflow-hidden bg-surface">
                  <Image
                    src={collection.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 80vw"
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <h3 className="font-inter text-base leading-5 font-medium tracking-[-0.3px]">{collection.name}</h3>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
