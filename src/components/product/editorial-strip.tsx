import Image from "next/image"

import { SectionTitle } from "@/components/section-title"
import { editorial } from "@/lib/data"

export function EditorialStrip() {
  return (
    <section className="px-5 pt-20">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <SectionTitle>Engineered for the ride</SectionTitle>
          <p className="max-w-[520px] text-sm leading-[17px] tracking-[-0.3px] text-subtle">
            Every piece is developed with racers and tested on the road, so you can focus on the line ahead.
          </p>
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          {editorial.map((item) => (
            <figure key={item.title} className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden p-6 text-white">
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <figcaption className="flex flex-col gap-2">
                <span className="text-2xl leading-[29px] font-semibold tracking-[-0.5px]">{item.title}</span>
                <span className="max-w-[320px] text-sm leading-[17px] tracking-[-0.3px] text-white/90">{item.text}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
