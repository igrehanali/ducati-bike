"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { CheckboxField, PasswordInput } from "@/components/account/fields"
import { EMAIL_RE, dialogContent, primaryButton, safeNext, secondaryButton, textLink, useHydrated } from "@/components/account/utils"
import { Field, FormMessage, SubmitButton, TextInput } from "@/components/site/form"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { login, useCurrentUser } from "@/lib/account-store"

type Errors = Partial<Record<"email" | "password" | "form", string>>

export function LoginForm() {
  const params = useSearchParams()
  const next = safeNext(params.get("next"))
  const registerHref = params.get("next") ? `/account/register?next=${encodeURIComponent(next)}` : "/account/register"
  const router = useRouter()
  const user = useCurrentUser()
  const hydrated = useHydrated()
  const [errors, setErrors] = useState<Errors>({})
  const [pending, setPending] = useState(false)

  // Already signed in (or just signed in): send them on. Navigation only — no state is set here.
  useEffect(() => {
    if (hydrated && user) router.replace(next)
  }, [hydrated, user, next, router])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get("email") ?? "").trim()
    const password = String(data.get("password") ?? "")
    const found: Errors = {}
    if (!EMAIL_RE.test(email)) found.email = "Enter a valid email address"
    if (!password) found.password = "Enter your password"
    setErrors(found)
    if (found.email || found.password) {
      document.getElementById(found.email ? "login-email" : "login-password")?.focus()
      return
    }
    setPending(true)
    const result = await login(email, password, data.get("remember") === "on")
    setPending(false)
    if (!result.ok) {
      setErrors({ form: result.error })
      return
    }
    toast.success(`Welcome back, ${result.user.firstName}`)
  }

  if (hydrated && user) {
    return (
      <p role="status" className="text-sm text-subtle">
        You&apos;re signed in as {user.email}. Taking you to your account…
      </p>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5" aria-label="Sign in">
      <FormMessage message={errors.form} />
      <Field label="Email address" htmlFor="login-email" error={errors.email} required>
        <TextInput id="login-email" name="email" type="email" autoComplete="email" inputMode="email" invalid={Boolean(errors.email)} />
      </Field>
      <Field label="Password" htmlFor="login-password" error={errors.password} required>
        <PasswordInput id="login-password" name="password" autoComplete="current-password" invalid={Boolean(errors.password)} />
      </Field>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CheckboxField id="login-remember" name="remember" defaultChecked>
          Remember me
        </CheckboxField>
        <ForgotPasswordDialog registerHref={registerHref} />
      </div>
      <SubmitButton pending={pending} disabled={!hydrated} className="w-full">
        Sign in
      </SubmitButton>
      <p className="text-center text-sm leading-5">
        New to Vellora Moto?{" "}
        <Link href={registerHref} className={textLink}>
          Create an account
        </Link>
      </p>
    </form>
  )
}

function ForgotPasswordDialog({ registerHref }: { registerHref: string }) {
  return (
    <Dialog>
      <DialogTrigger className="text-sm leading-5 underline underline-offset-4 hover:opacity-70">Forgot password?</DialogTrigger>
      <DialogContent className={dialogContent}>
        <DialogTitle className="text-xl font-semibold">Forgotten your password?</DialogTitle>
        <DialogDescription className="text-sm leading-5 text-subtle">
          This is a demo store: accounts live only in this browser, so we have no way to email you a reset link.
        </DialogDescription>
        <p className="text-sm leading-5">
          The quickest fix is to create a new account — it only takes a minute, and anything in your bag or wishlist stays right where it is.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href={registerHref} className={`${primaryButton} flex-1`}>
            Create an account
          </Link>
          <DialogClose className={`${secondaryButton} flex-1`}>Back to sign in</DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
