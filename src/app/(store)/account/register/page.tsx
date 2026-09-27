import type { Metadata } from "next"
import { Suspense } from "react"

import { AccountBenefits, AuthHeading, AuthShell, DemoNote, FormSkeleton } from "@/components/account/auth-shell"
import { RegisterForm } from "@/components/account/register-form"

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a Vellora Moto UK account for faster checkout, order tracking, a saved wishlist and early access to new collections.",
  robots: { index: false, follow: true },
}

export default function RegisterPage() {
  return (
    <AuthShell
      image="/media/page-rider-garage-leathers.webp"
      eyebrow="Join the Vellora Moto community"
      headline="Built for those who live Vellora."
      text="One account for your gear, your orders and your bike — plus first look at new collections and events."
      crumbs={[{ label: "My account", href: "/account" }, { label: "Create account" }]}
    >
      <AuthHeading title="Create an account" description="It takes less than a minute. Fields marked * are required." />
      <div className="flex flex-col gap-4">
        <Suspense fallback={<FormSkeleton rows={5} />}>
          <RegisterForm />
        </Suspense>
        <DemoNote />
      </div>
      <AccountBenefits />
    </AuthShell>
  )
}
