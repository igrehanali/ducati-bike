import Image from "next/image"
import Link from "next/link"

import { ReadMoreArrowIcon } from "@/components/icons"
import { SectionTitle } from "@/components/section-title"
import { velloraRange } from "@/lib/data"

export function RangeSection() {
  return (
    <section id="range" className="scroll-mt-4 px-5 pt-20">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <SectionTitle>Shop by bike</SectionTitle>
          <p className="max-w-[520px] text-sm leading-[17px] tracking-[-0.3px] text-subtle">
            Gear, accessories and parts matched to your Vellora — from track-focused superbikes to the free-spirited Sabbia.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {velloraRange.map((model) => (
            <Link
              key={model.name}
              href={model.href}
              className="group relative isolate flex aspect-[16/10] flex-col justify-end overflow-hidden p-6 text-white"
            >
              <Image
                src={model.image}
                alt={`Vellora ${model.name}`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                style={{ objectPosition: model.position }}
                className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-white/80 uppercase">{model.tagline}</p>
              <div className="mt-1 flex items-end justify-between gap-4">
                <h3 className="font-inter text-[28px] leading-[34px] font-medium tracking-[-0.6px]">{model.name}</h3>
                <span className="flex items-center gap-1 pb-1 text-sm leading-[17px] font-medium opacity-90 transition-transform group-hover:translate-x-1">
                  Shop gear
                  <ReadMoreArrowIcon className="size-5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
