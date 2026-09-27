import Image from "next/image"
import Link from "next/link"

import { promos } from "@/lib/data"

export function PromoTiles() {
  return (
    <section className="px-5 pt-20">
      <div className="grid gap-2 md:grid-cols-2">
        {promos.map((promo) => (
          <article key={promo.title} className="relative isolate flex h-[430px] flex-col justify-end overflow-hidden p-6 text-white">
            <Image src={promo.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="-z-10 object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/40 to-transparent to-60%" />
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl leading-[29px] font-semibold tracking-[-0.5px]">{promo.title}</h2>
                <p className="max-w-[414px] text-sm leading-[17px] tracking-[-0.3px]">{promo.description}</p>
              </div>
              <Link
                href={promo.href}
                className="flex h-[42px] min-w-[151px] items-center justify-center bg-white px-4 text-sm leading-[21px] font-medium text-black hover:bg-white/85"
              >
                {promo.cta}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
