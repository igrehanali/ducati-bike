import type { Metadata } from "next"
import { Suspense } from "react"

import { AccountDashboard, AccountSkeleton } from "@/components/account/account-dashboard"

export const metadata: Metadata = {
  title: "My account",
  description: "Your Vellora Moto UK account: orders, saved addresses, details and wishlist.",
  robots: { index: false, follow: false },
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountSkeleton />}>
      <AccountDashboard />
    </Suspense>
  )
}
