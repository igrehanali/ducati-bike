import type { Metadata } from "next"

import { CheckoutView } from "@/components/checkout/checkout-view"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout — delivery details, shipping and payment.",
  robots: { index: false },
}

export default function CheckoutPage() {
  return <CheckoutView />
}
