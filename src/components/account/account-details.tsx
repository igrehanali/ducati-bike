"use client"

import { useState, type FormEvent } from "react"
import { toast } from "sonner"

import { CheckboxField, PasswordInput, PasswordStrength } from "@/components/account/fields"
import { passwordIssue } from "@/components/account/utils"
import { Field, SubmitButton, TextInput } from "@/components/site/form"
import { changePassword, updateUser, type User } from "@/lib/account-store"

const panel = "flex flex-col gap-6 border border-rule p-5 md:p-8"
const panelTitle = "font-inter text-xl leading-[26px] font-medium tracking-[-0.4px]"

export function AccountDetails({ user }: { user: User }) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="font-inter text-2xl leading-[30px] font-medium tracking-[-0.6px]">Your details</h2>
      <div className="grid gap-8 xl:grid-cols-2">
        <ProfileForm key={user.email} user={user} />
        <PasswordForm user={user} />
      </div>
    </div>
  )
}

type ProfileErrors = Partial<Record<"firstName" | "lastName" | "phone", string>>

function ProfileForm({ user }: { user: User }) {
  const [errors, setErrors] = useState<ProfileErrors>({})

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const firstName = String(data.get("firstName") ?? "").trim()
    const lastName = String(data.get("lastName") ?? "").trim()
    const phone = String(data.get("phone") ?? "").trim()
    const found: ProfileErrors = {}
    if (!firstName) found.firstName = "Enter your first name"
    if (!lastName) found.lastName = "Enter your last name"
    if (phone && !/^\+?[\d\s()-]{10,20}$/.test(phone)) found.phone = "Enter a valid phone number"
    setErrors(found)
    const first = (["firstName", "lastName", "phone"] as const).find((key) => found[key])
    if (first) {
      document.getElementById(`profile-${first}`)?.focus()
      return
    }
    updateUser(user.email, { firstName, lastName, phone: phone || undefined, marketing: data.get("marketing") === "on" })
    toast.success("Your details have been updated")
  }

  return (
    <section aria-labelledby="profile-title" className={panel}>
      <div className="flex flex-col gap-1">
        <h3 id="profile-title" className={panelTitle}>
          Profile
        </h3>
        <p className="text-sm text-subtle">How we address you and keep in touch.</p>
      </div>
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="First name" htmlFor="profile-firstName" error={errors.firstName} required>
            <TextInput id="profile-firstName" name="firstName" autoComplete="given-name" defaultValue={user.firstName} invalid={Boolean(errors.firstName)} />
          </Field>
          <Field label="Last name" htmlFor="profile-lastName" error={errors.lastName} required>
            <TextInput id="profile-lastName" name="lastName" autoComplete="family-name" defaultValue={user.lastName} invalid={Boolean(errors.lastName)} />
          </Field>
        </div>
        <Field label="Email address" htmlFor="profile-email" hint="Your email is your sign-in and can't be changed in this demo.">
          <TextInput id="profile-email" type="email" value={user.email} readOnly className="bg-surface text-subtle" />
        </Field>
        <Field label="Phone" htmlFor="profile-phone" error={errors.phone}>
          <TextInput id="profile-phone" name="phone" type="tel" autoComplete="tel" defaultValue={user.phone} invalid={Boolean(errors.phone)} />
        </Field>
        <CheckboxField id="profile-marketing" name="marketing" defaultChecked={user.marketing}>
          Email me about new collections, events and track days.
        </CheckboxField>
        <SubmitButton className="sm:self-start">Save details</SubmitButton>
      </form>
    </section>
  )
}

type PasswordErrors = Partial<Record<"current" | "next" | "confirm", string>>

function PasswordForm({ user }: { user: User }) {
  const [errors, setErrors] = useState<PasswordErrors>({})
  const [next, setNext] = useState("")
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const current = String(data.get("current") ?? "")
    const confirm = String(data.get("confirm") ?? "")
    const found: PasswordErrors = {}
    if (!current) found.current = "Enter your current password"
    const issue = passwordIssue(next)
    if (issue) found.next = issue
    else if (next === current) found.next = "Choose a password you haven't used here before"
    if (confirm !== next || !next) found.confirm = "Passwords don't match"
    setErrors(found)
    const first = (["current", "next", "confirm"] as const).find((key) => found[key])
    if (first) {
      document.getElementById(`password-${first}`)?.focus()
      return
    }
    setPending(true)
    const result = await changePassword(user.email, current, next)
    setPending(false)
    if (!result.ok) {
      setErrors({ current: result.error })
      document.getElementById("password-current")?.focus()
      return
    }
    form.reset()
    setNext("")
    toast.success("Your password has been changed")
  }

  return (
    <section aria-labelledby="password-title" className={panel}>
      <div className="flex flex-col gap-1">
        <h3 id="password-title" className={panelTitle}>
          Change password
        </h3>
        <p className="text-sm text-subtle">At least 8 characters, including a number.</p>
      </div>
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <Field label="Current password" htmlFor="password-current" error={errors.current} required>
          <PasswordInput id="password-current" name="current" autoComplete="current-password" invalid={Boolean(errors.current)} />
        </Field>
        <Field label="New password" htmlFor="password-next" error={errors.next} required>
          <PasswordInput
            id="password-next"
            name="next"
            autoComplete="new-password"
            value={next}
            onChange={(event) => setNext(event.target.value)}
            aria-describedby="password-next-strength"
            invalid={Boolean(errors.next)}
          />
          <PasswordStrength password={next} id="password-next-strength" />
        </Field>
        <Field label="Confirm new password" htmlFor="password-confirm" error={errors.confirm} required>
          <PasswordInput id="password-confirm" name="confirm" autoComplete="new-password" invalid={Boolean(errors.confirm)} />
        </Field>
        <SubmitButton pending={pending} className="sm:self-start">
          Update password
        </SubmitButton>
      </form>
    </section>
  )
}
