"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { CheckboxField, PasswordInput, PasswordStrength } from "@/components/account/fields"
import { EMAIL_RE, passwordIssue, safeNext, textLink, useHydrated } from "@/components/account/utils"
import { Field, FormMessage, SubmitButton, TextInput } from "@/components/site/form"
import { register, useCurrentUser } from "@/lib/account-store"

type Key = "firstName" | "lastName" | "email" | "password" | "confirm" | "terms"
type Errors = Partial<Record<Key | "form", string>>

const ORDER: Key[] = ["firstName", "lastName", "email", "password", "confirm", "terms"]
const fieldId = (key: Key) => `register-${key}`

export function RegisterForm() {
  const params = useSearchParams()
  const next = safeNext(params.get("next"))
  const loginHref = params.get("next") ? `/account/login?next=${encodeURIComponent(next)}` : "/account/login"
  const router = useRouter()
  const user = useCurrentUser()
  const hydrated = useHydrated()
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (hydrated && user) router.replace(next)
  }, [hydrated, user, next, router])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const value = (key: string) => String(data.get(key) ?? "").trim()
    const input = {
      firstName: value("firstName"),
      lastName: value("lastName"),
      email: value("email"),
      password: String(data.get("password") ?? ""),
      marketing: data.get("marketing") === "on",
    }
    const found: Errors = {}
    if (!input.firstName) found.firstName = "Enter your first name"
    if (!input.lastName) found.lastName = "Enter your last name"
    if (!EMAIL_RE.test(input.email)) found.email = "Enter a valid email address"
    const issue = passwordIssue(input.password)
    if (issue) found.password = issue
    if (String(data.get("confirm") ?? "") !== input.password || !input.password) found.confirm = "Passwords don't match"
    if (data.get("terms") !== "on") found.terms = "Please accept the terms to create an account"
    setErrors(found)
    const first = ORDER.find((key) => found[key])
    if (first) {
      document.getElementById(fieldId(first))?.focus()
      return
    }
    setPending(true)
    const result = await register(input)
    setPending(false)
    if (!result.ok) {
      setErrors({ form: result.error })
      document.getElementById(fieldId("email"))?.focus()
      return
    }
    toast.success(`Welcome to Vellora Moto, ${result.user.firstName}`)
  }

  if (hydrated && user) {
    return (
      <p role="status" className="text-sm text-subtle">
        You&apos;re signed in as {user.email}. Taking you to your account…
      </p>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5" aria-label="Create account">
      <FormMessage message={errors.form} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name" htmlFor={fieldId("firstName")} error={errors.firstName} required>
          <TextInput id={fieldId("firstName")} name="firstName" autoComplete="given-name" invalid={Boolean(errors.firstName)} />
        </Field>
        <Field label="Last name" htmlFor={fieldId("lastName")} error={errors.lastName} required>
          <TextInput id={fieldId("lastName")} name="lastName" autoComplete="family-name" invalid={Boolean(errors.lastName)} />
        </Field>
      </div>
      <Field label="Email address" htmlFor={fieldId("email")} error={errors.email} required>
        <TextInput id={fieldId("email")} name="email" type="email" autoComplete="email" inputMode="email" invalid={Boolean(errors.email)} />
      </Field>
      <Field label="Password" htmlFor={fieldId("password")} error={errors.password} required>
        <PasswordInput
          id={fieldId("password")}
          name="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-describedby="register-password-strength"
          invalid={Boolean(errors.password)}
        />
        <PasswordStrength password={password} id="register-password-strength" />
      </Field>
      <Field label="Confirm password" htmlFor={fieldId("confirm")} error={errors.confirm} required>
        <PasswordInput id={fieldId("confirm")} name="confirm" autoComplete="new-password" invalid={Boolean(errors.confirm)} />
      </Field>
      <div className="flex flex-col gap-4 pt-1">
        <CheckboxField id="register-marketing" name="marketing">
          Send me news, new collections and event invitations by email. You can unsubscribe at any time.
        </CheckboxField>
        <CheckboxField id={fieldId("terms")} name="terms" error={errors.terms}>
          I agree to the{" "}
          <Link href="/terms" className={textLink}>
            Terms &amp; Conditions
          </Link>{" "}
          and have read the{" "}
          <Link href="/privacy" className={textLink}>
            Privacy Policy
          </Link>
          . <span className="text-brand-dark">*</span>
        </CheckboxField>
      </div>
      <SubmitButton pending={pending} disabled={!hydrated} className="w-full">
        Create account
      </SubmitButton>
      <p className="text-center text-sm leading-5">
        Already have an account?{" "}
        <Link href={loginHref} className={textLink}>
          Sign in
        </Link>
      </p>
    </form>
  )
}
