import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { RulerIcon, ShirtIcon, StoreIcon, ThermometerIcon } from "lucide-react"

import { buttonOutlineWhite, buttonWhite, FeatureGrid } from "@/components/content/blocks"
import { SizeTableView } from "@/components/product/size-guide-dialog"
import { SectionTitle } from "@/components/section-title"
import { PageHeader } from "@/components/site/page-header"
import { showroom } from "@/lib/experiences"
import { sizeTables } from "@/lib/size-guide"

export const metadata: Metadata = {
  title: "Size Guide",
  description: "Find your size in Vellora helmets, jackets, race suits, gloves, boots and eBike frames with our measuring guides.",
}

const tips = [
  { icon: RulerIcon, title: "Use a soft tape", text: "Measure over light clothing with a soft tape measure, keeping it snug but not tight." },
  { icon: ShirtIcon, title: "Think about layers", text: "Wear thermals or a hoodie under your jacket? Measure over them, or go up a size." },
  { icon: ThermometerIcon, title: "Leather gives", text: "Leather softens and moulds to you over the first few rides — a snug fit is right." },
  { icon: StoreIcon, title: "Try it in store", text: "Visit our Weybridge showroom for a free fitting with our riding-gear specialists." },
]

export default function SizeGuidePage() {
  return (
    <>
      <PageHeader
        title="Size guide"
        description="Protective gear only works when it fits. Find your size for every category below — and if you’re between sizes, we’re happy to help."
        crumbs={[{ label: "Size Guide" }]}
        eyebrow="Fit & sizing"
      />

      <nav aria-label="Size guide categories" className="sticky top-0 z-10 border-y border-black/10 bg-white/95 backdrop-blur">
        <ul className="flex gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none]">
          {sizeTables.map((table) => (
            <li key={table.id} className="shrink-0">
              <a href={`#${table.id}`} className="flex h-9 items-center border border-black/20 px-4 text-sm leading-[17px] font-medium tracking-[-0.3px] whitespace-nowrap transition-colors hover:border-black hover:bg-black hover:text-white">
                {table.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-col px-5">
        {sizeTables.map((table) => (
          <section key={table.id} id={table.id} aria-labelledby={`${table.id}-heading`} className="grid scroll-mt-20 gap-6 border-b border-black/10 py-14 last:border-b-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase">{table.columns.slice(1).join(" · ")}</p>
              <h2 id={`${table.id}-heading`} className="text-[26px] leading-[32px] font-semibold tracking-[-0.6px]">
                {table.title}
              </h2>
            </div>
            <SizeTableView table={table} />
          </section>
        ))}
      </div>

      <section className="px-5 pt-20">
        <div className="mb-8 flex flex-col gap-3">
          <SectionTitle>Measuring tips</SectionTitle>
          <p className="max-w-[640px] text-base leading-6 text-subtle">A few minutes with a tape measure saves a return — here’s how to get it right.</p>
        </div>
        <FeatureGrid items={tips} />
      </section>

      <section className="px-5 pt-20 pb-20">
        <div className="grid overflow-hidden bg-black text-white md:grid-cols-2">
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[360px]">
            <Image src="/media/page-store-rack.webp" alt="Riding jackets on a rack in the Vellora Moto UK showroom" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center gap-4 p-6 md:p-12">
            <h2 className="font-inter text-[28px] leading-[34px] font-medium tracking-[-0.6px]">Still unsure? Ask a specialist.</h2>
            <p className="text-base leading-6 text-white/80">
              Tell us your measurements and the product you&apos;re looking at, and our team will recommend a size. Or call us on{" "}
              <a href={`tel:${showroom.phone.replace(/\s/g, "")}`} className="font-semibold text-white underline underline-offset-2">
                {showroom.phone}
              </a>
              .
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Link href="/contact?topic=product" className={buttonWhite}>
                Contact us
              </Link>
              <Link href="/returns" className={buttonOutlineWhite}>
                Returns policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
