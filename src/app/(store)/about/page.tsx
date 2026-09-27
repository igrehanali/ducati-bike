import type { Metadata } from "next"
import Link from "next/link"

import { buttonPrimary, buttonSecondary, ContentSection, CtaBand, SplitFeature, StatsRow } from "@/components/content/blocks"
import { PageHeader } from "@/components/site/page-header"

export const metadata: Metadata = {
  title: "About Us",
  description: "Vellora Moto UK has been an official Vellora dealer since 2001 — four-time Vellora Dealer of the Year, with a showroom and workshop in Weybridge, Surrey.",
  openGraph: { images: ["/media/page-showroom-fulmines.webp"] },
}

const stats = [
  { value: "25", label: "Years as an official Vellora dealer" },
  { value: "4×", label: "Vellora UK Dealer of the Year" },
  { value: "12,000+", label: "Riders served in store and online" },
  { value: "6", label: "Factory-trained technicians" },
]

const timeline = [
  { year: "2001", title: "Doors open in Weybridge", text: "Two riders, one workshop bay and a Bestia 900 in the window. Vellora Moto UK becomes an authorised dealer." },
  { year: "2009", title: "A new showroom", text: "We move to our purpose-built showroom at Brooklands, with room for the full range and a dedicated apparel floor." },
  { year: "2015", title: "Track days launch", text: "Our first event at Brands Hatch sells out in a week. Today we run days at five of Britain's best circuits." },
  { year: "2020", title: "Dealer of the Year", text: "Our first Vellora UK Dealer of the Year award, recognising customer satisfaction and workshop quality." },
  { year: "2021", title: "Back-to-back win", text: "Named Dealer of the Year again — the same year our workshop achieved Vellora Service Excellence status." },
  { year: "2023", title: "Third title", text: "Dealer of the Year for a third time, as our community rides pass 200 events." },
  { year: "2024", title: "Four-time winner", text: "A fourth Dealer of the Year award — a first for any UK Vellora dealer." },
  { year: "2026", title: "Online store relaunch", text: "Our new online store brings the full showroom experience — gear, parts, servicing and track days — to riders across the UK." },
]

const team = [
  { name: "Marco Bellini", role: "Dealer Principal", text: "Born in Bologna, riding Velloras for 30 years and running the store since day one." },
  { name: "Sarah Whitfield", role: "Workshop Manager", text: "Vellora Master Technician and the person to ask about Major services and set-up." },
  { name: "James Okafor", role: "Riding Gear Specialist", text: "Fits helmets and leathers for road riders and racers alike. Brands Hatch regular." },
  { name: "Chloe Harrington", role: "Track Day Coordinator", text: "ACU instructor who has coached over 2,000 riders through their first track day." },
]

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Riders first, since 2001."
        description="Vellora Moto UK is an official Vellora dealer and four-time Vellora UK Dealer of the Year — a showroom, workshop and community built around the bikes we love."
        crumbs={[{ label: "About Us" }]}
        image="/media/page-showroom-fulmines.webp"
        eyebrow="About Vellora Moto UK"
      />

      <section className="px-5 pt-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-20">
          <h2 className="font-inter text-[28px] leading-[34px] font-medium tracking-[-0.8px] md:text-[40px] md:leading-[48px]">
            For those who live Vellora — on the road, on the track and beyond.
          </h2>
          <div className="flex flex-col gap-4 text-base leading-6 text-subtle">
            <p>
              We opened our doors in Weybridge in 2001 with a simple idea: a Vellora dealer run by riders, for riders. A quarter of a century later that hasn&apos;t changed.
              Everyone on our team rides, and most of us have spent more weekends at Brands Hatch than we&apos;d like to admit.
            </p>
            <p>
              Today we&apos;re one of the UK&apos;s longest-standing official Vellora dealers, named Vellora Dealer of the Year in 2020, 2021, 2023 and 2024. Whether you&apos;re
              choosing your first Sabbia, speccing a Fulmine for the track or looking for the perfect helmet, you&apos;ll get the same expert advice — in the showroom
              or online.
            </p>
          </div>
        </div>
        <div className="pt-12">
          <StatsRow stats={stats} />
        </div>
      </section>

      <ContentSection className="flex flex-col gap-20">
        <SplitFeature
          image="/media/page-showroom-lounge.webp"
          alt="The Vellora Moto UK showroom lounge"
          eyebrow="The showroom"
          title="The full Vellora range under one roof"
          action={
            <Link href="/contact" className={buttonSecondary}>
              Plan your visit
            </Link>
          }
        >
          <p>
            Our Brooklands showroom houses the latest Fulmine, Rombo, Orizzonte, Bestia, Notturno and Sabbia models alongside the complete Vellora apparel and
            accessories collection.
          </p>
          <p>Grab a coffee in the lounge, try on leathers with our fitting specialists or book a test ride — no appointment needed.</p>
        </SplitFeature>
        <SplitFeature
          image="/media/promo-workshop.webp"
          alt="A Vellora technician working in the Vellora Moto UK workshop"
          eyebrow="The workshop"
          title="Factory standards, every time"
          reverse
          action={
            <Link href="/service" className={buttonSecondary}>
              Book a service
            </Link>
          }
        >
          <p>
            Six factory-trained technicians, the official Vellora VDS 2.0 diagnostic system and genuine parts on the shelf. From annual services to major valve checks and
            performance upgrades, your bike is in expert hands.
          </p>
          <p>We send a video health check of every bike on the ramp, and we&apos;ll never carry out extra work without your approval.</p>
        </SplitFeature>
        <SplitFeature
          image="/media/page-riders-group.webp"
          alt="A group of Vellora riders together on a club ride"
          eyebrow="The community"
          title="More than a dealership"
          action={
            <Link href="/track-days" className={buttonSecondary}>
              Ride with us
            </Link>
          }
        >
          <p>
            Sunday breakfast rides, European tours, bike nights and our track day programme bring together thousands of Velloristi every year. Our Vellora Owners Club chapter
            is one of the most active in the country.
          </p>
          <p>Wherever you ride, you&apos;re part of the family the moment you walk through the door.</p>
        </SplitFeature>
      </ContentSection>

      <ContentSection id="history" title="Our story so far" eyebrow="2001 — 2026">
        <ol className="relative flex flex-col border-l border-black/15 md:ml-[120px]">
          {timeline.map((item) => (
            <li key={item.year} className="relative flex flex-col gap-2 pb-10 pl-6 last:pb-0 md:pl-10">
              <span aria-hidden="true" className="absolute top-1.5 -left-[5px] size-2.5 bg-brand" />
              <p className="font-mono text-sm leading-5 text-subtle md:absolute md:top-0 md:-left-[120px] md:w-[96px] md:text-right md:text-base">{item.year}</p>
              <h3 className="font-inter text-xl leading-6 font-medium tracking-[-0.4px]">{item.title}</h3>
              <p className="max-w-[620px] text-sm leading-6 text-subtle">{item.text}</p>
            </li>
          ))}
        </ol>
      </ContentSection>

      <ContentSection id="team" title="Meet the team" eyebrow="The people behind the store" intro="Riders, racers and technicians — here are a few of the faces you'll meet in Weybridge.">
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((person) => (
            <li key={person.name} className="flex flex-col gap-5 bg-surface p-5">
              <div aria-hidden="true" className="flex aspect-square items-center justify-center bg-black font-inter text-[56px] leading-none font-medium tracking-[-2px] text-white">
                {initials(person.name)}
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-inter text-lg leading-[22px] font-medium tracking-[-0.4px]">{person.name}</h3>
                <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-brand-dark uppercase">{person.role}</p>
                <p className="pt-1 text-sm leading-5 text-subtle">{person.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </ContentSection>

      <CtaBand
        title="Come and say hello."
        text="Visit the showroom in Weybridge, get in touch with our team, or explore the full collection online."
        image="/media/page-showroom-white-fulmine.webp"
        actions={[
          { label: "Contact us", href: "/contact" },
          { label: "Shop now", href: "/shop" },
        ]}
      />
      <div className="px-5 pt-10 pb-20 text-center">
        <Link href="/news" className={buttonPrimary}>
          Read our latest news
        </Link>
      </div>
    </>
  )
}
