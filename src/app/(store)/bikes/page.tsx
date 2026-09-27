import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { ReadMoreArrowIcon } from "@/components/icons"
import { SectionTitle } from "@/components/section-title"
import { PageHeader } from "@/components/site/page-header"
import { bikes } from "@/lib/bikes"
import { productsForBike } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Shop by bike",
  description: "Riding gear, parts and accessories matched to your Vellora — Fulmine, Rombo, Bestia, Orizzonte, Sabbia and Notturno.",
}

export default function BikesPage() {
  return (
    <div className="pb-20">
      <PageHeader
        title="Shop by bike"
        eyebrow="Six families, one soul"
        description="Gear, performance parts and accessories matched to your Vellora — from track-focused superbikes to the free-spirited Sabbia."
        crumbs={[{ label: "Shop by bike" }]}
        image="/media/page-showroom-fulmines.webp"
        imagePosition="50% 60%"
      />

      <section className="px-5 pt-20">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <SectionTitle>Choose your Vellora</SectionTitle>
            <p className="max-w-[560px] text-sm leading-[17px] tracking-[-0.3px] text-subtle">
              Every model has its own character. Explore the story, key figures and the kit our team recommends for each.
            </p>
          </div>
          <ul className="grid gap-2 md:grid-cols-2">
            {bikes.map((bike, index) => (
              <li key={bike.slug}>
                <Link
                  href={`/bikes/${bike.slug}`}
                  className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden p-6 text-white sm:aspect-[16/11] md:p-8"
                >
                  <Image
                    src={bike.card}
                    alt={`Vellora ${bike.name}`}
                    fill
                    loading={index < 2 ? "eager" : "lazy"}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    style={{ objectPosition: bike.cardPosition }}
                    className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-white/80 uppercase">
                    {String(index + 1).padStart(2, "0")} · {bike.family}
                  </p>
                  <h2 className="mt-2 font-inter text-[34px] leading-[40px] font-medium tracking-[-0.8px] md:text-[44px] md:leading-[52px]">{bike.name}</h2>
                  <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
                    <p className="max-w-[380px] text-sm leading-5 text-white/85 md:text-base md:leading-6">{bike.tagline}</p>
                    <span className="flex items-center gap-1 text-sm leading-[17px] font-medium uppercase transition-transform group-hover:translate-x-1">
                      Explore · {productsForBike(bike.slug).length} products
                      <ReadMoreArrowIcon className="size-5" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-5 pt-20">
        <div className="grid gap-8 bg-surface p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-12">
          <div className="flex flex-col gap-2">
            <SectionTitle>Not sure which Vellora is for you?</SectionTitle>
            <p className="max-w-[560px] text-base leading-6 text-subtle">
              Visit the showroom and our team will match you to the right model — and arrange a test ride on the road.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/contact?topic=product" className="flex h-[42px] items-center justify-center bg-black px-8 text-sm leading-[21px] font-medium text-white uppercase hover:bg-black/85">
              Book a test ride
            </Link>
            <Link
              href="/shop/accessories"
              className="flex h-[42px] items-center justify-center border border-black bg-white px-8 text-sm leading-[21px] font-medium text-black uppercase hover:bg-black hover:text-white"
            >
              All accessories
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
