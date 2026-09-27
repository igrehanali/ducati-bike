"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function StoreError({
  error,
  retry,
  reset,
}: {
  error: Error & { digest?: string }
  retry?: () => void
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="flex min-h-[60vh] flex-col justify-center px-5 py-20">
      <div className="flex max-w-[560px] flex-col gap-5">
        <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-brand-dark uppercase">Something went wrong</p>
        <h1 className="font-inter text-[34px] leading-[42px] font-medium tracking-[-1px] md:text-5xl md:leading-[58px]">We hit a bump in the road.</h1>
        <p className="text-base leading-6 text-subtle">
          Sorry — this page didn&apos;t load properly. Please try again, and if the problem continues our team is happy to help.
        </p>
        {error.digest ? <p className="font-mono text-xs text-inactive">Error reference: {error.digest}</p> : null}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={() => (retry ?? reset)()}
            className="h-[42px] bg-black px-8 text-sm leading-[21px] font-medium text-white uppercase hover:bg-black/85"
          >
            Try again
          </button>
          <Link
            href="/"
            className="flex h-[42px] items-center border border-black px-8 text-sm leading-[21px] font-medium uppercase transition-colors hover:bg-black hover:text-white"
          >
            Back to home
          </Link>
          <Link href="/contact" className="flex h-[42px] items-center px-4 text-sm leading-[21px] font-medium uppercase underline-offset-4 hover:underline">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  )
}
