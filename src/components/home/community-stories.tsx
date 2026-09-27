"use client"

import Image from "next/image"

import { PlayIcon } from "@/components/icons"
import { CarouselArrows, SectionTitle } from "@/components/section-carousel"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { stories } from "@/lib/site-content"

export function CommunityStories() {
  return (
    <section className="px-5 pt-20">
      <Carousel opts={{ align: "start" }} className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <SectionTitle>Stories From the Vellora Community</SectionTitle>
          <CarouselArrows />
        </div>
        <CarouselContent className="-ml-2">
          {stories.map((story) => (
            <CarouselItem key={story.name} className="basis-[80%] pl-2 sm:basis-[45%] lg:basis-[26.78%]">
              <article className="relative isolate flex aspect-[369/542] flex-col justify-end overflow-hidden p-4 text-white">
                <Image
                  src={story.image}
                  alt={`${story.name} with a Vellora`}
                  fill
                  sizes="(min-width: 1024px) 27vw, (min-width: 640px) 45vw, 80vw"
                  className="-z-10 object-cover"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/0 from-55% to-black/70" />
                <button
                  type="button"
                  aria-label={`Play ${story.name}'s story`}
                  className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/40 backdrop-blur-sm transition-colors hover:bg-white/60"
                >
                  <PlayIcon className="ml-0.5 size-6" />
                </button>
                <div className="flex flex-col gap-3">
                  <h3 className="font-inter text-base leading-5">{story.name}</h3>
                  <p className="truncate text-sm leading-[17px] tracking-[-0.1px]">{story.quote}</p>
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
