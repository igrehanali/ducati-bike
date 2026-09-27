import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRightIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react"

import { HoursList } from "@/components/content/blocks"
import { ContactForm } from "@/components/content/contact-form"
import { isContactTopic } from "@/components/content/contact-topics"
import { PageHeader } from "@/components/site/page-header"
import { showroom } from "@/lib/experiences"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Vellora Moto UK about orders, products, returns, servicing or track days. Showroom and workshop in Weybridge, Surrey.",
}

const quickLinks = [
  { label: "FAQs", text: "Answers to common questions", href: "/faq" },
  { label: "Returns & exchanges", text: "30-day returns and free exchanges", href: "/returns" },
  { label: "Track your order", text: "See where your parcel is", href: "/track-order" },
]

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const { topic } = await searchParams
  const requested = Array.isArray(topic) ? topic[0] : topic
  const defaultTopic = isContactTopic(requested) ? requested : undefined

  return (
    <>
      <PageHeader
        title="Contact us"
        description="Questions about an order, the right size or booking your bike in? Our team replies within one working day."
        crumbs={[{ label: "Contact Us" }]}
        eyebrow="We’re here to help"
      />

      <div className="grid gap-12 px-5 pb-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <section aria-labelledby="contact-form-heading" className="flex flex-col gap-6">
          <h2 id="contact-form-heading" className="text-[26px] leading-[32px] font-semibold tracking-[-0.6px]">
            Send us a message
          </h2>
          <ContactForm key={defaultTopic ?? "none"} defaultTopic={defaultTopic} />
        </section>

        <aside aria-label="Showroom details" className="flex flex-col gap-6">
          <div className="flex flex-col gap-6 bg-black p-6 text-white md:p-8">
            <div className="flex flex-col gap-1">
              <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-white/60 uppercase">Visit us</p>
              <h2 className="font-inter text-[22px] leading-7 font-medium tracking-[-0.4px]">{showroom.name}</h2>
            </div>
            <ul className="flex flex-col gap-4 text-sm leading-5">
              <li className="flex gap-3">
                <MapPinIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <address className="not-italic">
                  {showroom.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
              <li className="flex gap-3">
                <PhoneIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <a href={`tel:${showroom.phone.replace(/\s/g, "")}`} className="font-semibold hover:underline">
                  {showroom.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <MailIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <a href={`mailto:${showroom.email}`} className="font-semibold hover:underline">
                  {showroom.email}
                </a>
              </li>
            </ul>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold">Opening hours</h3>
              <HoursList hours={showroom.hours} light />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="relative aspect-[4/3] overflow-hidden bg-surface">
              <iframe
                src={showroom.mapEmbed}
                title="Map showing the Vellora Moto UK showroom at Brooklands, Weybridge"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0"
              />
            </div>
            <a
              href={showroom.mapLink}
              target="_blank"
              rel="noreferrer"
              className="flex w-fit items-center gap-1.5 border-b border-black pb-1 text-sm leading-[17px] font-medium hover:opacity-70"
            >
              OPEN IN MAPS
              <ArrowUpRightIcon className="size-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>

          <nav aria-label="Help topics" className="flex flex-col">
            <h2 className="mb-2 text-base leading-5 font-semibold">Quick help</h2>
            <ul className="border-t border-black/15">
              {quickLinks.map((link) => (
                <li key={link.href} className="border-b border-black/15">
                  <Link href={link.href} className="group flex items-center justify-between gap-4 py-4">
                    <span className="flex flex-col gap-0.5">
                      <span className="font-inter text-base leading-5 font-medium tracking-[-0.3px] group-hover:underline">{link.label}</span>
                      <span className="text-xs leading-4 text-subtle">{link.text}</span>
                    </span>
                    <ArrowUpRightIcon className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </>
  )
}
