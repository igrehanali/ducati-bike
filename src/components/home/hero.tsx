"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { SiteHeader } from "@/components/layout/site-header"
import { heroSlides } from "@/lib/site-content"
import { cn } from "@/lib/utils"

const SLIDE_MS = 6000

export function Hero() {
  // The outgoing slide stays opaque underneath while the next one fades in over it.
  const [{ active, previous }, setSlides] = useState({ active: 0, previous: 0 })
  // Only the first slide (the LCP image) is rendered up front. The other slides load, and autoplay starts,
  // once the visitor first interacts with the page — so the first paint stays fast and nothing moves unasked.
  const [playing, setPlaying] = useState(false)
  const slide = heroSlides[active]
  const goTo = (index: number) => {
    setPlaying(true)
    setSlides((s) => (index === s.active ? s : { active: index, previous: s.active }))
  }

  useEffect(() => {
    const events = ["pointerdown", "pointermove", "keydown", "scroll", "touchstart", "wheel"] as const
    const start = () => {
      setPlaying(true)
      events.forEach((e) => window.removeEventListener(e, start))
    }
    events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }))
    return () => events.forEach((e) => window.removeEventListener(e, start))
  }, [])

  useEffect(() => {
    if (!playing || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = window.setTimeout(
      () => setSlides((s) => ({ active: (s.active + 1) % heroSlides.length, previous: s.active })),
      SLIDE_MS
    )
    return () => window.clearTimeout(timer)
  }, [active, playing])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative isolate flex h-[640px] bg-black flex-col justify-end overflow-hidden pb-4 text-white md:h-[800px]"
    >
      {heroSlides.map((item, index) =>
        index === 0 || playing ? (
        <Image
          key={item.image}
          src={item.image}
          alt={index === active ? item.alt : ""}
          aria-hidden={index !== active}
          fill
          loading="eager"
          fetchPriority={index === 0 ? "high" : "auto"}
          sizes="100vw"
          className={cn(
            "object-cover transition-opacity duration-1000 ease-out",
            index === active
              ? "-z-10 opacity-100"
              : index === previous
                ? "-z-20 opacity-100"
                : "-z-30 opacity-0"
          )}
        />
        ) : null
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/50 via-black/5 to-black/25" />
      <SiteHeader variant="overlay" />

      <div className="flex flex-col gap-4 px-5">
        <div key={active} className={cn("flex flex-col gap-3", active !== previous && "animate-in duration-700 fade-in slide-in-from-bottom-3")}>
          <h1 className="font-inter text-[34px] leading-[42px] font-normal tracking-[-0.8px] md:text-[42px] md:leading-[50px]">
            {slide.title}
          </h1>
          <p className="max-w-[406px] text-lg leading-[27px] font-medium">{slide.description}</p>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href={slide.href}
            className="flex h-[42px] w-[151px] items-center justify-center bg-white text-sm leading-[21px] font-medium text-black hover:bg-white/85"
          >
            SHOP NOW
          </Link>
          <div className="flex h-9 items-center gap-2 pr-8">
            {heroSlides.map((item, index) => (
              <button
                key={item.image}
                type="button"
                aria-label={`Show slide ${index + 1} of ${heroSlides.length}`}
                aria-current={index === active}
                onClick={() => goTo(index)}
                className="group flex h-6 w-[126px] items-center"
              >
                <span className="h-px w-full overflow-hidden bg-white/30 transition-[height] group-hover:h-0.5">
                  <span
                    key={index === active ? `${active}-${playing}` : undefined}
                    className={cn("block h-full w-full origin-left bg-white", index > active && "scale-x-0")}
                    style={index === active && playing ? { animation: `hero-progress ${SLIDE_MS}ms linear forwards` } : undefined}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
