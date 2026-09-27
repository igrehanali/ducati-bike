import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { ReadMoreArrowIcon } from "@/components/icons"
import { Price } from "@/components/price"
import { SectionTitle } from "@/components/section-title"
import { PageHeader } from "@/components/site/page-header"
import { productsInCategory } from "@/lib/catalog"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "eBikes",
  description: "Vellora electric mountain, trail, gravel and city bikes — designed in Valdoro with Vellora EP8 motors and 720 Wh batteries.",
  openGraph: { images: ["/media/ebike-mountain.webp"] },
}

const ebikes = productsInCategory("ebikes")
const specsOf = (specs: { label: string; value: string }[]) => specs.filter((s) => s.label !== "SKU")

const TECH_COPY: Record<string, string> = {
  Motor: "Natural, instant assistance with four riding modes — from Eco for long days to Boost for steep climbs.",
  Battery: "Integrated into the down tube for a low centre of gravity and a clean Vellora silhouette.",
  Range: "Enough for a full day on the trails, and removable for charging at home in around five hours.",
  Frame: "Hydroformed and heat-treated for stiffness where it counts and comfort where you need it.",
}

const STORIES = [
  {
    image: "/media/ebike-rider-red.webp",
    eyebrow: "Trail",
    title: "Climb like it's downhill",
    text: "85 Nm of assistance turns technical climbs into part of the fun. Air suspension and tubeless trail tyres keep you in control when the trail points back down.",
    href: "/products/vellora-mig-s-emtb",
    cta: "Discover MIG-S",
  },
  {
    image: "/media/ebike-urban.webp",
    eyebrow: "City",
    title: "The commute, reimagined",
    text: "Integrated lights, a rear rack and a step-through frame make the Urban-e the smartest way across town — arriving fresh, every time.",
    href: "/products/vellora-urban-e-city",
    cta: "Discover Urban-e",
  },
  {
    image: "/media/ebike-fat-rock.webp",
    eyebrow: "Adventure",
    title: "Sabbia spirit, electric soul",
    text: "Fat tyres and a long, flat seat bring the Free Spirit to sand, gravel and forest roads. Pure fun, no fuel required.",
    href: "/products/sabbia-e-fat",
    cta: "Discover e-Fat",
  },
]

export default function EbikesPage() {
  const tech = specsOf(ebikes[0]?.specs ?? [])

  return (
    <div className="pb-20">
      <PageHeader
        title="Electric. Unmistakably Vellora."
        eyebrow="Vellora eBikes"
        description="Mountain, trail, gravel and city eBikes designed with the Vellora Design Centre — engineered to take you further, faster and with a grin."
        crumbs={[{ label: "eBikes" }]}
        image="/media/ebike-mountain.webp"
        className="min-h-[600px] md:min-h-[760px]"
      >
        <div className="flex flex-wrap gap-2 pt-3">
          <a href="#range" className="flex h-[42px] items-center justify-center bg-white px-8 text-sm leading-[21px] font-medium text-black uppercase hover:bg-white/85">
            Explore the range
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
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-20">
          <div className="flex flex-col gap-4">
            <SectionTitle>Designed in Valdoro</SectionTitle>
            <p className="max-w-[560px] text-base leading-6 text-subtle">
              Vellora&rsquo;s eBikes are developed by the Vellora Design Centre, sharing the same obsession with performance and detail as our motorcycles.
              Every model is available to test ride at our showroom.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-2">
            {[
              { value: "85", unit: "Nm", label: "Motor torque" },
              { value: "720", unit: "Wh", label: "Battery" },
              { value: "120", unit: "km", label: "Max range" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-2 border-t border-black pt-4">
                <dt className="order-2 text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase">{stat.label}</dt>
                <dd className="order-1 font-inter text-[32px] leading-none font-medium tracking-[-1px] md:text-[48px]">
                  {stat.value}
                  <span className="ml-1 font-mono text-sm tracking-normal text-subtle">{stat.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="range" className="scroll-mt-4 px-5 pt-20">
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <SectionTitle>The range</SectionTitle>
            <Link href="/shop/ebikes" className="border-b border-black pb-1 text-sm leading-[17px] font-medium hover:opacity-70">
              SHOP ALL EBIKES
            </Link>
          </div>
          <ul className="grid gap-x-2 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {ebikes.map((bike) => (
              <li key={bike.slug}>
                <Link href={`/products/${bike.slug}`} className="group flex h-full flex-col gap-5">
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                    <Image
                      src={bike.image}
                      alt={bike.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    {bike.badge ? (
                      <span className="absolute top-4 left-4 bg-chip px-2 py-1 font-inter text-xs leading-[14px] font-bold tracking-[-0.2px]">{bike.badge}</span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-inter text-xl leading-6 font-medium tracking-[-0.4px]">{bike.name}</h3>
                      <p className="text-sm leading-5 text-subtle">{bike.description[0]}</p>
                    </div>
                    <dl className="grid grid-cols-3 border-y border-black/10">
                      {specsOf(bike.specs)
                        .slice(0, 3)
                        .map((spec, i) => (
                          <div key={spec.label} className={cn("flex flex-col gap-1 py-3", i > 0 && "border-l border-black/10 pl-3")}>
                            <dt className="text-[11px] leading-[13px] tracking-[-0.1px] text-subtle uppercase">{spec.label}</dt>
                            <dd className="text-xs leading-4 font-semibold">{spec.value}</dd>
                          </div>
                        ))}
                    </dl>
                    <div className="mt-auto flex items-center justify-between gap-3">
                      <Price value={bike.price} compareAt={bike.compareAt} emphasis className="text-base leading-[19px]" />
                      <span className="flex items-center gap-1 text-sm leading-[17px] font-medium uppercase transition-transform group-hover:translate-x-1">
                        View bike
                        <ReadMoreArrowIcon className="size-5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-5 pt-20">
        <div className="grid bg-black text-white lg:grid-cols-2">
          <div className="flex flex-col gap-10 p-8 md:p-12">
            <div className="flex flex-col gap-3">
              <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-white/60 uppercase">Technology</p>
              <h2 className="text-[26px] leading-[32px] font-semibold tracking-[-0.6px] md:text-[32px] md:leading-[38px]">Engineered like a Vellora</h2>
            </div>
            <dl className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {tech.map((spec) => (
                <div key={spec.label} className="flex flex-col gap-2 border-t border-white/25 pt-4">
                  <dt className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-white/60 uppercase">{spec.label}</dt>
                  <dd className="flex flex-col gap-2">
                    <span className="font-inter text-xl leading-6 font-medium tracking-[-0.4px]">{spec.value}</span>
                    {TECH_COPY[spec.label] ? <span className="text-sm leading-5 text-white/70">{TECH_COPY[spec.label]}</span> : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative min-h-[320px] lg:min-h-full">
            <Image src="/media/ebike-emtb-red.webp" alt="Vellora MIG-S eMTB in Vellora Red" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-2 px-5 pt-20" aria-label="Ride stories">
        {STORIES.map((story, index) => (
          <article key={story.title} className="grid bg-surface md:grid-cols-2">
            <div className={cn("relative aspect-[4/3] md:aspect-auto md:min-h-[480px]", index % 2 === 1 && "md:order-2")}>
              <Image src={story.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col justify-center gap-4 p-8 md:p-12 lg:p-20">
              <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase">{story.eyebrow}</p>
              <h2 className="text-[26px] leading-[32px] font-semibold tracking-[-0.6px] md:text-[32px] md:leading-[38px]">{story.title}</h2>
              <p className="max-w-[440px] text-base leading-6 text-subtle">{story.text}</p>
              <Link href={story.href} className="mt-2 w-fit border-b border-black pb-1 text-sm leading-[17px] font-medium uppercase hover:opacity-70">
                {story.cta}
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="px-5 pt-20">
        <div className="relative isolate flex min-h-[460px] flex-col justify-end overflow-hidden p-6 text-white md:min-h-[560px] md:p-12">
          <Image src="/media/ebike-hill.webp" alt="" fill sizes="100vw" className="-z-10 object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="flex max-w-[520px] flex-col gap-4">
            <h2 className="font-inter text-[34px] leading-[42px] font-medium tracking-[-0.8px] md:text-[42px] md:leading-[50px]">Feel it for yourself</h2>
            <p className="text-base leading-6 text-white/90">
              Book a free test ride at our showroom. Our team will set up the bike to your size and take you through every riding mode.
            </p>
            <Link
              href="/contact?topic=product"
              className="flex h-[42px] w-fit items-center justify-center bg-white px-8 text-sm leading-[21px] font-medium text-black uppercase hover:bg-white/85"
            >
              Book a test ride
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
