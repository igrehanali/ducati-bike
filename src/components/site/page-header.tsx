import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

export type Crumb = { label: string; href?: string }

export function Breadcrumbs({ items, className, light = false }: { items: Crumb[]; className?: string; light?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={cn("flex flex-wrap items-center gap-1.5 text-xs leading-[14px] tracking-[-0.2px]", light ? "text-white/80" : "text-subtle")}>
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <span aria-hidden="true">/</span>
            {item.href ? (
              <Link href={item.href} className="hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className={light ? "text-white" : "text-black"}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

type PageHeaderProps = {
  title: string
  description?: ReactNode
  crumbs: Crumb[]
  /** With an image the header becomes a full-bleed hero with white text. */
  image?: string
  imagePosition?: string
  eyebrow?: string
  children?: ReactNode
  className?: string
}

export function PageHeader({ title, description, crumbs, image, imagePosition, eyebrow, children, className }: PageHeaderProps) {
  if (image) {
    return (
      <section className={cn("relative isolate flex min-h-[380px] flex-col justify-end overflow-hidden px-5 pt-6 pb-10 text-white md:min-h-[480px] md:pb-14", className)}>
        <Image src={image} alt="" fill loading="eager" fetchPriority="high" sizes="100vw" style={{ objectPosition: imagePosition }} className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/25 to-black/20" />
        <Breadcrumbs items={crumbs} light className="absolute top-6 left-5" />
        <div className="flex max-w-[760px] flex-col gap-3">
          {eyebrow ? <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-white/80 uppercase">{eyebrow}</p> : null}
          <h1 className="font-inter text-[34px] leading-[42px] font-medium tracking-[-0.8px] md:text-5xl md:leading-[58px]">{title}</h1>
          {description ? <div className="max-w-[560px] text-base leading-6 text-white/90">{description}</div> : null}
          {children}
        </div>
      </section>
    )
  }

  return (
    <section className={cn("flex flex-col gap-4 px-5 pt-6 pb-8", className)}>
      <Breadcrumbs items={crumbs} />
      <div className="flex flex-col gap-3 pt-4">
        {eyebrow ? <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase">{eyebrow}</p> : null}
        <h1 className="text-[32px] leading-[38px] font-semibold tracking-[-0.6px] md:text-[42px] md:leading-[50px]">{title}</h1>
        {description ? <div className="max-w-[640px] text-base leading-6 text-subtle">{description}</div> : null}
        {children}
      </div>
    </section>
  )
}
