import type { Metadata } from "next"
import Link from "next/link"

import { buttonPrimary, buttonSecondary } from "@/components/content/blocks"
import { faqGroups } from "@/components/content/faq-data"
import { FaqSearch } from "@/components/content/faq-search"
import { PageHeader } from "@/components/site/page-header"
import { showroom } from "@/lib/experiences"

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers to common questions about orders, delivery, returns, sizing, warranty, track days and service at Vellora Moto UK.",
}

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((group) =>
      group.items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } }))
    ),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHeader
        title="Frequently asked questions"
        description="Quick answers about orders, delivery, returns, sizing and everything in between."
        crumbs={[{ label: "FAQs" }]}
        eyebrow="Help centre"
      />
      <section className="px-5 pt-4">
        <FaqSearch />
      </section>
      <section className="px-5 pt-20 pb-20">
        <div className="flex flex-col items-start justify-between gap-6 bg-surface p-6 md:flex-row md:items-center md:p-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl leading-[29px] font-semibold tracking-[-0.5px]">Still need help?</h2>
            <p className="max-w-[520px] text-sm leading-5 text-subtle">
              Our team replies within one working day. Call us on{" "}
              <a href={`tel:${showroom.phone.replace(/\s/g, "")}`} className="font-semibold text-black underline underline-offset-2">
                {showroom.phone}
              </a>{" "}
              during opening hours.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/contact" className={buttonPrimary}>
              Contact us
            </Link>
            <Link href="/track-order" className={buttonSecondary}>
              Track an order
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
