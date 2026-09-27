import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ReadMoreArrowIcon } from "@/components/icons"
import { ProductGrid } from "@/components/product/product-card"
import { SectionTitle } from "@/components/section-title"
import { ProductRowSection } from "@/components/product-sections"
import { BikeGallery } from "@/components/shop/bike-gallery"
import { PageHeader } from "@/components/site/page-header"
import { bikes, getBike } from "@/lib/bikes"
import { getCategory, productsForBike, type Product } from "@/lib/catalog"

export function generateStaticParams() {
  return bikes.map((bike) => ({ model: bike.slug }))
}

export async function generateMetadata({ params }: PageProps<"/bikes/[model]">): Promise<Metadata> {
  const { model } = await params
  const bike = getBike(model)
  if (!bike) return { title: "Bike not found" }
  const title = `Vellora ${bike.name} gear & accessories`
  return {
    title,
    description: `${bike.tagline} ${bike.intro}`,
    openGraph: { title, description: bike.tagline, images: [bike.hero] },
  }
}

const departmentOf = (p: Product) => getCategory(p.category)?.department
const featuredFirst = (a: Product, b: Product) =>
  Number(b.badge === "Bestseller") - Number(a.badge === "Bestseller") || b.rating - a.rating

export default async function BikePage({ params }: PageProps<"/bikes/[model]">) {
  const { model } = await params
  const bike = getBike(model)
  if (!bike) notFound()

  const compatible = productsForBike(bike.slug)
  const parts = compatible.filter((p) => departmentOf(p) === "accessories").sort(featuredFirst)
  const gear = compatible.filter((p) => departmentOf(p) === "riding-wear").sort(featuredFirst).slice(0, 12)
  const others = bikes.filter((b) => b.slug !== bike.slug)
  const shown = parts.slice(0, 8)

  return (
    <div className="pb-20">
      <PageHeader
        title={`Vellora ${bike.name}`}
        eyebrow={bike.family}
        description={bike.tagline}
        crumbs={[{ label: "Shop by bike", href: "/bikes" }, { label: bike.name }]}
        image={bike.hero}
        className="min-h-[560px] md:min-h-[720px]"
      >
        <div className="flex flex-wrap gap-2 pt-3">
          <a href="#shop-gear" className="flex h-[42px] items-center justify-center bg-white px-8 text-sm leading-[21px] font-medium text-black uppercase hover:bg-white/85">
            Shop gear
          </a>
          <Link
            href="/contact?topic=product"
            className="flex h-[42px] items-center justify-center border border-white px-8 text-sm leading-[21px] font-medium text-white uppercase transition-colors hover:bg-white hover:text-black"
          >
            Book a test ride
          </Link>
        </div>
      </PageHeader>

      <section className="px-5 pt-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-20">
          <div className="flex flex-col gap-6">
            <SectionTitle>The {bike.name} story</SectionTitle>
            <p className="max-w-[640px] font-inter text-lg leading-7 font-medium tracking-[-0.4px] md:text-xl md:leading-8">{bike.intro}</p>
            <div className="flex max-w-[640px] flex-col gap-4 text-base leading-6 text-subtle">
              {bike.story.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="self-start">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="pb-3 text-left font-mono text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase">Key figures</caption>
              <thead>
                <tr className="bg-black text-white">
                  <th scope="col" className="px-4 py-3 font-semibold">Specification</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{bike.name}</th>
                </tr>
              </thead>
              <tbody>
                {bike.figures.map((figure) => (
                  <tr key={figure.label} className="border-b border-black/10 even:bg-surface">
                    <th scope="row" className="px-4 py-3.5 font-semibold">
                      {figure.label}
                    </th>
                    <td className="px-4 py-3.5 font-mono">{figure.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-5 pt-20" aria-label="Highlights">
        <ul className="grid gap-2 md:grid-cols-3">
          {bike.highlights.map((highlight, index) => (
            <li key={highlight.title} className="flex flex-col gap-4 bg-surface p-8">
              <span className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-brand-dark">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="font-inter text-xl leading-6 font-medium tracking-[-0.4px]">{highlight.title}</h3>
              <p className="text-sm leading-5 text-subtle">{highlight.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 pt-20">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <SectionTitle>Gallery</SectionTitle>
            <p className="text-sm leading-[17px] tracking-[-0.3px] text-subtle">Select a photo to view it full screen.</p>
          </div>
          <BikeGallery images={bike.gallery} name={bike.name} />
        </div>
      </section>

      <section id="shop-gear" className="scroll-mt-4 px-5 pt-20">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-2">
              <SectionTitle>Parts &amp; accessories for the {bike.name}</SectionTitle>
              <p className="text-sm leading-[17px] tracking-[-0.3px] text-subtle">
                {parts.length} genuine parts and accessories that fit the {bike.name}.
              </p>
            </div>
            {parts.length > shown.length ? (
              <Link href={`/shop/accessories?bike=${bike.slug}`} className="border-b border-black pb-1 text-sm leading-[17px] font-medium hover:opacity-70">
                VIEW ALL {parts.length}
              </Link>
            ) : null}
          </div>
          {shown.length ? (
            <ProductGrid products={shown} className="md:grid-cols-3 lg:grid-cols-4" />
          ) : (
            <p className="bg-surface p-8 text-sm text-subtle">
              Parts for the {bike.name} are available to order in store. <Link href="/contact" className="font-medium text-black underline">Contact our team</Link>.
            </p>
          )}
        </div>
      </section>

      {gear.length ? <ProductRowSection title={`Riding gear for the ${bike.name}`} products={gear} /> : null}

      <section className="px-5 pt-20">
        <div className="flex flex-col gap-6">
          <SectionTitle>Explore other models</SectionTitle>
          <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
            {others.map((other) => (
              <li key={other.slug}>
                <Link href={`/bikes/${other.slug}`} className="group relative isolate flex aspect-[4/3] flex-col justify-end overflow-hidden p-4 text-white">
                  <Image
                    src={other.card}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
                    style={{ objectPosition: other.cardPosition }}
                    className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 to-transparent" />
                  <p className="font-mono text-[10px] leading-3 tracking-[-0.2px] text-white/80 uppercase">{other.family}</p>
                  <span className="mt-1 flex items-center justify-between gap-2 font-inter text-lg leading-[22px] font-medium tracking-[-0.4px]">
                    {other.name}
                    <ReadMoreArrowIcon className="size-5 shrink-0 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
