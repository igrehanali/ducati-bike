import type { Metadata } from "next"
import Image from "next/image"
import { CameraIcon, CoffeeIcon, FlagIcon, GraduationCapIcon, ShieldCheckIcon, TimerIcon, UsersIcon, WrenchIcon } from "lucide-react"

import { ContentSection, FeatureGrid } from "@/components/content/blocks"
import { FaqList } from "@/components/content/faq-list"
import { SelectionProvider } from "@/components/content/selection"
import { TrackDayCards, TrackDayForm } from "@/components/content/track-day-booking"
import { PageHeader } from "@/components/site/page-header"
import { trackDays, trackGroups } from "@/lib/experiences"

export const metadata: Metadata = {
  title: "Track Days",
  description: "Ride your Vellora at Donington, Brands Hatch, Silverstone and more with Vellora Moto UK track days — novice to fast groups, instructors and leathers hire.",
  openGraph: { images: ["/media/page-track-aerial-sunset.webp"] },
}

const included = [
  { icon: TimerIcon, title: "Open pit lane", text: "Up to five 20-minute sessions in your group, from 9am until the chequered flag." },
  { icon: GraduationCapIcon, title: "Expert instructors", text: "ACU-qualified instructors on track for free one-to-one tuition in every group." },
  { icon: WrenchIcon, title: "Trackside support", text: "Our Vellora technicians on hand for tyre pressures, set-up and quick fixes." },
  { icon: ShieldCheckIcon, title: "Safety first", text: "Noise testing, medical team, marshals and a full rider briefing before sessions." },
  { icon: CameraIcon, title: "Pro photography", text: "On-track photos of you in action, ready to download the following week." },
  { icon: CoffeeIcon, title: "Hospitality", text: "Breakfast rolls, lunch and unlimited hot drinks in our Vellora paddock garage." },
  { icon: UsersIcon, title: "Small groups", text: "Capped numbers in every group so you get more clear laps and less traffic." },
  { icon: FlagIcon, title: "All Velloras welcome", text: "From Fulmine to Sabbia — plus friends on other makes, space permitting." },
]

const faqs = [
  {
    id: "licence",
    q: "Do I need a full motorcycle licence?",
    a: "Yes. You'll need to bring a valid full UK or EU motorcycle licence to signing-on. Provisional licence holders can't take part.",
  },
  {
    id: "kit",
    q: "What kit do I need?",
    a: "A full-face helmet (ACU gold stamp or ECE 22.06), one-piece or zip-together leathers, boots, gloves and a back protector. Leathers, boots and gloves can be hired for £60.",
  },
  {
    id: "noise",
    q: "Is there a noise limit?",
    a: "Most circuits run a 102 dB(A) static limit and some drive-by limits. Road-legal Velloras with standard or homologated exhausts are usually fine — ask us if you're unsure.",
  },
  {
    id: "weather",
    q: "What happens if it rains?",
    a: "Track days run in all weathers — wet sessions are brilliant for building feel. If the circuit cancels the event, you'll get a full refund or transfer.",
  },
  {
    id: "transfer",
    q: "Can I cancel or transfer my booking?",
    a: "You can transfer to another date free of charge up to 14 days before the event. Later cancellations are non-refundable unless we can resell your place.",
  },
]

const gallery = [
  { image: "/media/page-track-aerial.webp", alt: "Aerial view of a race circuit" },
  { image: "/media/gallery-track-straight.webp", alt: "Vellora on the main straight" },
  { image: "/media/promo-track-days.webp", alt: "Riders lined up in the pit lane" },
  { image: "/media/page-track-circuit.webp", alt: "Circuit sweeping through the countryside" },
  { image: "/media/news-track-day.webp", alt: "Rider leaning into a corner at a track day" },
  { image: "/media/page-track-aerial-clouds.webp", alt: "Circuit from above under dramatic clouds" },
]

export default function TrackDaysPage() {
  const next = trackDays.find((t) => t.spacesLeft > 0)

  return (
    <SelectionProvider>
      <PageHeader
        title="Vellora Moto UK track days"
        description="Take your Vellora where it was born to be ridden. Five of Britain's best circuits, small groups, instructors and our workshop team trackside."
        crumbs={[{ label: "Track Days" }]}
        image="/media/page-track-aerial-sunset.webp"
        eyebrow={next ? `Next event · ${next.circuit} · ${next.date}` : "2026–27 season"}
      >
        <div className="flex flex-wrap gap-2 pt-3">
          <a href="#events" className="flex h-[42px] items-center bg-white px-8 text-sm leading-[21px] font-medium text-black uppercase hover:bg-white/85">
            See dates
          </a>
          <a href="#book" className="flex h-[42px] items-center border border-white px-8 text-sm leading-[21px] font-medium text-white uppercase transition-colors hover:bg-white hover:text-black">
            Book now
          </a>
        </div>
      </PageHeader>

      <section className="px-5 pt-20">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-20">
          <h2 className="font-inter text-[28px] leading-[34px] font-medium tracking-[-0.8px] md:text-[40px] md:leading-[48px]">
            Faster, smoother, safer — whatever your level.
          </h2>
          <div className="flex flex-col gap-4 text-base leading-6 text-subtle">
            <p>
              Since 2015 we&apos;ve taken thousands of riders on track, from first-timers nervously rolling out of the pit lane to club racers chasing tenths. Every event is
              run by our own team with the same attention to detail as our workshop.
            </p>
            <p>
              Riders are split into novice, intermediate and fast groups, so you share the circuit with people riding at your pace — and there&apos;s free tuition all day
              if you want it.
            </p>
          </div>
        </div>
      </section>

      <ContentSection id="included" title="What's included" eyebrow="Every event">
        <FeatureGrid items={included} />
      </ContentSection>

      <ContentSection id="events" title="Upcoming events" eyebrow="2026–27 calendar" intro="Prices are per rider and include VAT. Spaces are limited in every group.">
        <TrackDayCards />
      </ContentSection>

      <ContentSection id="groups" title="Choose your group" eyebrow="Ride at your pace">
        <ol className="grid gap-2 md:grid-cols-3">
          {trackGroups.map((group, index) => (
            <li key={group.id} className="flex flex-col gap-4 border border-black/15 p-6">
              <span className="font-mono text-sm text-subtle">0{index + 1}</span>
              <h3 className="font-inter text-2xl leading-[29px] font-medium tracking-[-0.5px]">{group.label}</h3>
              <p className="text-sm leading-5 text-subtle">{group.description}</p>
            </li>
          ))}
        </ol>
      </ContentSection>

      <section id="book" aria-labelledby="book-title" className="scroll-mt-6 px-5 pt-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
            <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase">Booking</p>
            <h2 id="book-title" className="text-[26px] leading-[32px] font-semibold tracking-[-0.6px] md:text-[32px] md:leading-[38px]">
              Book your track day
            </h2>
            <p className="text-base leading-6 text-subtle">
              Reserve your place in under two minutes. We&apos;ll email a secure payment link and joining instructions — your place is held for 48 hours.
            </p>
            <div className="relative mt-2 hidden aspect-[4/3] overflow-hidden bg-surface lg:block">
              <Image src="/media/promo-track-days.webp" alt="Vellora riders on track" fill sizes="40vw" className="object-cover" />
            </div>
          </div>
          <TrackDayForm />
        </div>
      </section>

      <ContentSection id="faq" title="Track day FAQs">
        <FaqList items={faqs} defaultOpen={[faqs[0].id]} />
      </ContentSection>

      <section aria-label="Track day gallery" className="px-5 pt-20 pb-20">
        <ul className="grid grid-cols-3 gap-2 md:grid-cols-6">
          {gallery.map((item) => (
            <li key={item.image} className="group relative aspect-square overflow-hidden bg-surface">
              <Image src={item.image} alt={item.alt} fill sizes="(min-width: 768px) 17vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </li>
          ))}
        </ul>
      </section>
    </SelectionProvider>
  )
}
