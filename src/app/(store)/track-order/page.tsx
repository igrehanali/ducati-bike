import { Suspense } from "react"
import type { Metadata } from "next"

import { TrackOrder } from "@/components/checkout/track-order"
import { PageHeader } from "@/components/site/page-header"

export const metadata: Metadata = {
  title: "Track your order",
  description: "Enter your order number and email address to see the latest status of your Vellora Moto order.",
}

export default function TrackOrderPage() {
  return (
    <>
      <PageHeader
        title="Track your order"
        crumbs={[{ label: "Track your order" }]}
        description="Enter your order number and the email address you used at checkout to see where your order is."
      />
      <Suspense fallback={<div className="mx-5 mb-20 h-[240px] animate-pulse bg-surface" aria-busy="true" />}>
        <TrackOrder />
      </Suspense>
    </>
  )
}
