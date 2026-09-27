import Link from "next/link"

import {
  AwardIcon,
  SecureIcon,
  ShippingIcon,
  SocialFacebookIcon,
  SocialInstagramIcon,
  SocialTiktokIcon,
} from "@/components/icons"
import { NewsletterForm } from "@/components/layout/newsletter-form"

const features = [
  { icon: AwardIcon, title: "Award Winning", text: "Vellora Dealer of the Year 2024, 2023, 2021, 2020" },
  { icon: ShippingIcon, title: "UK Shipping Only", text: "Note: helmets & underwear are non-returnable items" },
  { icon: SecureIcon, title: "Secure Checkout", text: "Safe secure checkout Guaranteed" },
]

const linkGroups = [
  {
    title: "Quick Links",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Account", href: "/account" },
      { label: "Check Gift Card Balance", href: "/gift-cards" },
      { label: "Shop All", href: "/shop" },
      { label: "Sale", href: "/shop/sale" },
      { label: "Bestsellers", href: "/shop/bestsellers" },
      { label: "Shop by Bike", href: "/bikes" },
      { label: "Track Days", href: "/track-days" },
      { label: "Service & Workshop", href: "/service" },
      { label: "News", href: "/news" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Return Policy", href: "/returns" },
      { label: "Shipping", href: "/shipping" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faq" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "Track Your Order", href: "/track-order" },
    ],
  },
]

const socials = [
  { label: "Instagram", icon: SocialInstagramIcon, href: "https://www.instagram.com/" },
  { label: "Facebook", icon: SocialFacebookIcon, href: "https://www.facebook.com/" },
  { label: "TikTok", icon: SocialTiktokIcon, href: "https://www.tiktok.com/" },
]

export function SiteFooter() {
  return (
    <footer className="bg-black px-5 py-15 text-white sm:px-8">
      <div className="flex flex-col gap-[50px]">
        <div className="grid gap-10 md:grid-cols-3 md:gap-0">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col gap-4">
              <Icon className="size-12" />
              <div className="flex flex-col gap-5">
                <h3 className="text-2xl leading-[29px] font-medium tracking-[-0.5px]">{title}</h3>
                <p className="text-xs leading-[14px] tracking-[-0.2px]">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="h-px bg-white/20" />

        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:gap-[70px]">
          <div className="flex w-full max-w-[574px] flex-col gap-10">
            <div className="flex flex-col gap-5">
              <h2 className="text-2xl leading-[29px] font-bold tracking-[-0.5px]">GET THE INSIDE LINE</h2>
              <p className="text-sm leading-[17px] tracking-[-0.3px]">
                Sign up for Vellora weekly deals, special offers, and latest news
              </p>
              <NewsletterForm />
            </div>
            <div className="flex flex-col gap-5">
              <h2 className="text-[26px] leading-[33px]">Social Media</h2>
              <ul className="flex gap-5">
                {socials.map(({ label, icon: Icon, href }) => (
                  <li key={label}>
                    <a href={href} target="_blank" rel="noreferrer" aria-label={`${label} (opens in a new tab)`} className="block hover:opacity-70">
                      <Icon className="h-[21px] w-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex gap-[70px]">
            {linkGroups.map((group) => (
              <div key={group.title} className="flex w-[219px] flex-col gap-3">
                <h2 className="text-xl leading-5">{group.title}</h2>
                <ul className="flex flex-col gap-1.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-base leading-[19px] font-semibold tracking-[-0.3px] hover:opacity-70">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 border-t border-white/20 py-6 text-sm leading-[19px] md:flex-row md:gap-[30px]">
          <p className="max-w-[792px]">
            Vellora Moto UK is an official Vellora dealer. All prices include VAT. Showroom &amp; workshop: Brooklands
            Drive, Weybridge, Surrey KT13 0SL.
          </p>
          <p className="shrink-0 font-semibold">© 2026 Eman Labs</p>
        </div>
      </div>
    </footer>
  )
}
