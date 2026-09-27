import type { ReactNode } from "react"
import Image from "next/image"
import { HeartIcon, PackageIcon, SparklesIcon, ZapIcon } from "lucide-react"

import { Breadcrumbs, type Crumb } from "@/components/site/page-header"

type AuthShellProps = {
  image: string
  imagePosition?: string
  eyebrow: string
  headline: string
  text: string
  crumbs: Crumb[]
  children: ReactNode
}

/** Split sign-in / register layout: editorial photo on the left, form on the right. */
export function AuthShell({ image, imagePosition, eyebrow, headline, text, crumbs, children }: AuthShellProps) {
  return (
    <div className="grid lg:grid-cols-2">
      <div className="relative isolate flex min-h-[240px] flex-col justify-end gap-3 overflow-hidden p-5 text-white sm:min-h-[340px] lg:min-h-[820px] lg:p-8">
        <Image
          src={image}
          alt=""
          fill
          loading="eager"
          sizes="(min-width: 1024px) 50vw, 100vw"
          style={{ objectPosition: imagePosition }}
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
        <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-white/80 uppercase">{eyebrow}</p>
        <p className="max-w-[520px] font-inter text-[28px] leading-[34px] font-medium tracking-[-0.8px] md:text-5xl md:leading-[58px]">
          {headline}
        </p>
        <p className="hidden max-w-[401px] text-sm leading-[17px] tracking-[-0.1px] text-white/90 sm:block">{text}</p>
      </div>

      <div className="flex flex-col px-5 pt-6 pb-4 lg:px-12 lg:pt-8 xl:px-20">
        <Breadcrumbs items={crumbs} />
        <div className="mx-auto flex w-full max-w-[460px] flex-col gap-10 pt-10 lg:pt-16">{children}</div>
      </div>
    </div>
  )
}

export function AuthHeading({ title, description }: { title: string; description: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-[32px] leading-[38px] font-semibold tracking-[-0.6px] md:text-[42px] md:leading-[50px]">{title}</h1>
      <p className="text-base leading-6 text-subtle">{description}</p>
    </div>
  )
}

const BENEFITS = [
  { icon: ZapIcon, title: "Faster checkout", text: "Saved addresses and details at the tap of a button." },
  { icon: PackageIcon, title: "Order tracking", text: "Follow every order from our Weybridge showroom to your door." },
  { icon: HeartIcon, title: "Your wishlist", text: "Save pieces for later and share them with friends." },
  { icon: SparklesIcon, title: "Early access", text: "First look at new collections, events and track days." },
]

export function AccountBenefits() {
  return (
    <section aria-labelledby="account-benefits" className="flex flex-col gap-5 border-t border-rule pt-8">
      <h2 id="account-benefits" className="font-inter text-lg leading-[22px] font-medium tracking-[-0.4px]">
        Why create an account?
      </h2>
      <ul className="grid gap-5 sm:grid-cols-2">
        {BENEFITS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center bg-surface">
              <Icon className="size-[18px]" aria-hidden="true" />
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-sm leading-[17px] font-semibold tracking-[-0.3px]">{title}</span>
              <span className="text-[13px] leading-[18px] text-subtle">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function DemoNote() {
  return (
    <p className="text-xs leading-4 text-subtle">
      Demo accounts are stored only in this browser. Please don&apos;t use a password you use anywhere else.
    </p>
  )
}

export function FormSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-5" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex flex-col gap-1.5">
          <span className="h-4 w-24 bg-surface" />
          <span className="h-11 w-full bg-surface" />
        </div>
      ))}
      <span className="h-[46px] w-full bg-black/10" />
    </div>
  )
}
