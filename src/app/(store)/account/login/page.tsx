import type { Metadata } from "next"
import { Suspense } from "react"

import { AccountBenefits, AuthHeading, AuthShell, DemoNote, FormSkeleton } from "@/components/account/auth-shell"
import { LoginForm } from "@/components/account/login-form"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Vellora Moto UK account to track orders, manage addresses and see your wishlist.",
  robots: { index: false, follow: true },
}

export default function LoginPage() {
  return (
    <AuthShell
      image="/media/editorial-leather-suit.webp"
      imagePosition="50% 30%"
      eyebrow="Vellora Moto UK"
      headline="Welcome back, rider."
      text="Pick up where you left off — your orders, saved addresses and wishlist are waiting."
      crumbs={[{ label: "My account", href: "/account" }, { label: "Sign in" }]}
    >
      <AuthHeading title="Sign in" description="Use the email and password you registered with." />
      <div className="flex flex-col gap-4">
        <Suspense fallback={<FormSkeleton rows={2} />}>
          <LoginForm />
        </Suspense>
        <DemoNote />
      </div>
      <AccountBenefits />
    </AuthShell>
  )
}
