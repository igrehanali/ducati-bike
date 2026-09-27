import { NewsletterForm } from "@/components/layout/newsletter-form"

export function NewsletterBand() {
  return (
    <section className="pt-20" aria-labelledby="news-newsletter-title">
      <div className="flex flex-col gap-8 bg-black px-5 py-14 text-white md:flex-row md:items-end md:justify-between md:gap-16 md:px-10 md:py-20">
        <div className="flex max-w-[560px] flex-col gap-4">
          <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-white/60 uppercase">The Vellora Moto journal</p>
          <h2 id="news-newsletter-title" className="font-inter text-[28px] leading-[34px] font-medium tracking-[-0.8px] md:text-[40px] md:leading-[48px]">
            Stories from the paddock, straight to your inbox.
          </h2>
          <p className="text-sm leading-[17px] tracking-[-0.3px] text-white/80">
            New collections, track day dates and workshop advice — plus early access to offers. No spam, unsubscribe any time.
          </p>
        </div>
        <div className="w-full md:max-w-[480px]">
          <NewsletterForm />
        </div>
      </div>
    </section>
  )
}
