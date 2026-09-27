import type { Metadata } from "next"
import Image from "next/image"
import { BadgeCheckIcon, CpuIcon, PackageCheckIcon, TruckIcon } from "lucide-react"

import { ContentSection, FeatureGrid, HoursList } from "@/components/content/blocks"
import { SelectionProvider } from "@/components/content/selection"
import { ServiceForm, ServicePackageCards } from "@/components/content/service-booking"
import { PageHeader } from "@/components/site/page-header"
import { showroom } from "@/lib/experiences"

export const metadata: Metadata = {
  title: "Service & Workshop",
  description: "Vellora servicing, Major services, MOTs, tyres and accessory fitting by factory-trained technicians in Weybridge, Surrey. Book online.",
  openGraph: { images: ["/media/promo-workshop.webp"] },
}

const reasons = [
  { icon: BadgeCheckIcon, title: "Factory-trained technicians", text: "Six Vellora-certified technicians trained in Bologna, working on nothing but Velloras." },
  { icon: PackageCheckIcon, title: "Genuine Vellora parts", text: "Original parts and Shell Advance oils that protect your warranty and resale value." },
  { icon: CpuIcon, title: "VDS 2.0 diagnostics", text: "The official Vellora Diagnosis System for software updates, fault finding and set-up." },
  { icon: TruckIcon, title: "Collection & delivery", text: "Door-to-door collection within 30 miles of Weybridge, from £45 each way." },
]

export default function ServicePage() {
  return (
    <SelectionProvider>
      <PageHeader
        title="Service & workshop"
        description="Keep your Vellora at its best with our factory-trained team — from annual services and major valve checks to MOTs, tyres and accessory fitting."
        crumbs={[{ label: "Service & Workshop" }]}
        image="/media/promo-workshop.webp"
        eyebrow="Authorised Vellora service centre"
      >
        <div className="flex flex-wrap gap-2 pt-3">
          <a href="#book" className="flex h-[42px] items-center bg-white px-8 text-sm leading-[21px] font-medium text-black uppercase hover:bg-white/85">
            Book a service
          </a>
          <a
            href={`tel:${showroom.phone.replace(/\s/g, "")}`}
            className="flex h-[42px] items-center border border-white px-8 text-sm leading-[21px] font-medium text-white uppercase transition-colors hover:bg-white hover:text-black"
          >
            Call {showroom.phone}
          </a>
        </div>
      </PageHeader>

      <ContentSection id="why" title="Why service with us" eyebrow="The Vellora standard">
        <FeatureGrid items={reasons} />
      </ContentSection>

      <ContentSection id="packages" title="Service packages" eyebrow="Transparent pricing" intro="All prices include VAT, labour and genuine parts for the standard schedule. We’ll always call before carrying out additional work.">
        <ServicePackageCards />
      </ContentSection>

      <section id="book" aria-labelledby="book-title" className="scroll-mt-6 px-5 pt-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
            <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase">Booking</p>
            <h2 id="book-title" className="text-[26px] leading-[32px] font-semibold tracking-[-0.6px] md:text-[32px] md:leading-[38px]">
              Book your bike in
            </h2>
            <p className="text-base leading-6 text-subtle">
              Choose a service and your preferred date. We&apos;ll confirm a drop-off time within one working day and send you a video health check once your bike is on
              the ramp.
            </p>
            <div className="relative mt-2 hidden aspect-[4/3] overflow-hidden bg-surface lg:block">
              <Image src="/media/gallery-workshop-fulmine.webp" alt="Motorcycle in the workshop" fill sizes="40vw" className="object-cover" />
            </div>
          </div>
          <ServiceForm />
        </div>
      </section>

      <section aria-labelledby="hours-title" className="px-5 pt-20 pb-20">
        <div className="grid gap-8 bg-black p-6 text-white md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:p-10">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-white/60 uppercase">Workshop hours</p>
            <h2 id="hours-title" className="font-inter text-[26px] leading-[32px] font-medium tracking-[-0.6px]">
              Drop-off from 8:30am, Monday to Saturday
            </h2>
            <p className="text-sm leading-5 text-white/75">
              {showroom.address.join(", ")} ·{" "}
              <a href={`tel:${showroom.phone.replace(/\s/g, "")}`} className="font-semibold text-white underline underline-offset-2">
                {showroom.phone}
              </a>
            </p>
          </div>
          <HoursList hours={showroom.hours} light />
        </div>
      </section>
    </SelectionProvider>
  )
}
