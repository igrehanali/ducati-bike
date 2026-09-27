import { Suspense } from "react"
import type { Metadata } from "next"

import { OrderSuccess, OrderSuccessSkeleton } from "@/components/checkout/order-success"

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false },
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<OrderSuccessSkeleton />}>
      <OrderSuccess />
    </Suspense>
  )
}
