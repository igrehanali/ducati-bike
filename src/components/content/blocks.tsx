import type { ComponentType, ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"

import { SectionTitle } from "@/components/section-title"
import { cn } from "@/lib/utils"

/* Shared building blocks for the content pages (about, service, track days, policies…). */

const buttonBase = "inline-flex h-[42px] items-center justify-center px-8 text-sm leading-[21px] font-medium uppercase transition-colors"
export const buttonPrimary = cn(buttonBase, "bg-black text-white hover:bg-black/85")
export const buttonSecondary = cn(buttonBase, "border border-black bg-white text-black hover:bg-black hover:text-white")
export const buttonWhite = cn(buttonBase, "bg-white text-black hover:bg-white/85")
export const buttonOutlineWhite = cn(buttonBase, "border border-white text-white hover:bg-white hover:text-black")

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("font-mono text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase", className)}>{children}</p>
}

/** Section wrapper with the standard 80px rhythm and optional heading row. */
export function ContentSection({
  id,
  title,
  eyebrow,
  intro,
  action,
  children,
  className,
}: {
  id?: string
  title?: string
  eyebrow?: string
  intro?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} aria-labelledby={id && title ? `${id}-title` : undefined} className={cn("scroll-mt-6 px-5 pt-20", className)}>
      {title ? (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="flex max-w-[720px] flex-col gap-3">
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            <SectionTitle>{id ? <span id={`${id}-title`}>{title}</span> : title}</SectionTitle>
            {intro ? <div className="text-base leading-6 text-subtle">{intro}</div> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  )
}

/** Image + text split, alternating sides on desktop. */
export function SplitFeature({
  image,
  alt,
  eyebrow,
  title,
  children,
  reverse = false,
  action,
  imagePosition,
}: {
  image: string
  alt: string
  eyebrow?: string
  title: string
  children: ReactNode
  reverse?: boolean
  action?: ReactNode
  imagePosition?: string
}) {
  return (
    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-20">
      <div className={cn("relative aspect-[4/3] overflow-hidden bg-surface md:aspect-[5/4]", reverse && "md:order-2")}>
        <Image src={image} alt={alt} fill sizes="(min-width: 768px) 50vw, 100vw" style={{ objectPosition: imagePosition }} className="object-cover" />
      </div>
      <div className="flex max-w-[520px] flex-col gap-4">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h3 className="font-inter text-[26px] leading-[32px] font-medium tracking-[-0.6px] md:text-[32px] md:leading-[38px]">{title}</h3>
        <div className="flex flex-col gap-3 text-base leading-6 text-subtle">{children}</div>
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </div>
  )
}

export function StatsRow({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <dl className="grid grid-cols-2 border-t border-l border-black/15 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col-reverse gap-2 border-r border-b border-black/15 p-5 md:p-8">
          <dt className="text-sm leading-[17px] tracking-[-0.3px] text-subtle">{stat.label}</dt>
          <dd className="font-inter text-[34px] leading-[40px] font-medium tracking-[-1px] md:text-5xl md:leading-[56px]">{stat.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Icon + title + text grid ("why us", "what's included"). */
export function FeatureGrid({
  items,
  columns = 4,
}: {
  items: { icon: ComponentType<{ className?: string }>; title: string; text: string }[]
  columns?: 3 | 4
}) {
  return (
    <ul className={cn("grid gap-2 sm:grid-cols-2", columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
      {items.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex flex-col gap-4 bg-surface p-6">
          <span className="flex size-11 items-center justify-center bg-black text-white">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-2">
            <h3 className="font-inter text-lg leading-[22px] font-medium tracking-[-0.4px]">{title}</h3>
            <p className="text-sm leading-5 text-subtle">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

/** Full-width image band with a call to action. */
export function CtaBand({
  title,
  text,
  image,
  actions,
}: {
  title: string
  text?: string
  image?: string
  actions: { label: string; href: string }[]
}) {
  return (
    <section className="px-5 pt-20">
      <div className="relative isolate flex min-h-[340px] flex-col justify-end overflow-hidden bg-black p-6 text-white md:min-h-[420px] md:p-10">
        {image ? (
          <>
            <Image src={image} alt="" fill sizes="100vw" className="-z-10 object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          </>
        ) : null}
        <div className="flex max-w-[620px] flex-col gap-4">
          <h2 className="font-inter text-[30px] leading-[36px] font-medium tracking-[-0.8px] md:text-[40px] md:leading-[48px]">{title}</h2>
          {text ? <p className="text-base leading-6 text-white/85">{text}</p> : null}
          <div className="flex flex-wrap gap-2 pt-2">
            {actions.map((action, index) => (
              <Link key={action.href} href={action.href} className={index === 0 ? buttonWhite : buttonOutlineWhite}>
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Opening hours as a compact definition list. */
export function HoursList({ hours, className, light = false }: { hours: { days: string; time: string }[]; className?: string; light?: boolean }) {
  return (
    <dl className={cn("flex flex-col text-sm leading-5", className)}>
      {hours.map((row) => (
        <div key={row.days} className={cn("flex justify-between gap-4 border-b py-2.5 last:border-b-0", light ? "border-white/20" : "border-black/10")}>
          <dt className="font-semibold">{row.days}</dt>
          <dd className={cn("text-right font-mono text-[13px]", light ? "text-white/80" : "text-subtle")}>{row.time}</dd>
        </div>
      ))}
    </dl>
  )
}
