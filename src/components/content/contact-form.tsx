"use client"

import { useState } from "react"
import Link from "next/link"

import { sendContactMessage } from "@/app/actions"
import { contactTopics, type ContactTopic } from "@/components/content/contact-topics"
import { useFormAction } from "@/components/content/use-form-action"
import { Field, FormMessage, NativeSelect, SubmitButton, TextArea, TextInput } from "@/components/site/form"

export function ContactForm({ defaultTopic }: { defaultTopic?: ContactTopic }) {
  const { state, pending, formProps, error } = useFormAction(sendContactMessage)
  const [topic, setTopic] = useState<string>(defaultTopic ?? "")
  const [sent, setSent] = useState<string | undefined>()

  // Show the success panel for the latest successful submission until the customer starts a new message.
  const success = state.ok && state.reference !== sent

  if (success) {
    return (
      <div className="flex flex-col items-start gap-5 bg-surface p-6 md:p-10">
        <span className="flex size-12 items-center justify-center bg-black text-white" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="size-6">
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
        <h2 className="text-2xl leading-[29px] font-semibold tracking-[-0.5px]">Message sent</h2>
        <FormMessage ok message={state.message} reference={state.reference} />
        <button
          type="button"
          onClick={() => setSent(state.reference)}
          className="h-[42px] border border-black px-8 text-sm leading-[21px] font-medium uppercase transition-colors hover:bg-black hover:text-white"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form {...formProps} noValidate aria-describedby="contact-form-status" className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="contact-name" error={error("name")} required>
          <TextInput id="contact-name" name="name" autoComplete="name" required invalid={Boolean(error("name"))} disabled={pending} />
        </Field>
        <Field label="Email address" htmlFor="contact-email" error={error("email")} required>
          <TextInput id="contact-email" name="email" type="email" autoComplete="email" required invalid={Boolean(error("email"))} disabled={pending} />
        </Field>
        <Field label="Phone" htmlFor="contact-phone" error={error("phone")} hint="Optional — for a call back">
          <TextInput id="contact-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" invalid={Boolean(error("phone"))} disabled={pending} />
        </Field>
        <Field label="Topic" htmlFor="contact-topic" error={error("topic")} required>
          <NativeSelect
            id="contact-topic"
            name="topic"
            required
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            invalid={Boolean(error("topic"))}
            disabled={pending}
          >
            <option value="" disabled>
              Choose a topic
            </option>
            {contactTopics.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect>
        </Field>
      </div>

      {topic === "order" ? (
        <Field label="Order number" htmlFor="contact-order" error={error("orderNumber")} hint="You’ll find it in your confirmation email, e.g. DS2609-12345">
          <TextInput id="contact-order" name="orderNumber" autoComplete="off" className="font-mono uppercase" invalid={Boolean(error("orderNumber"))} disabled={pending} />
        </Field>
      ) : null}

      <Field label="Message" htmlFor="contact-message" error={error("message")} required>
        <TextArea id="contact-message" name="message" rows={6} maxLength={2000} required invalid={Boolean(error("message"))} disabled={pending} />
      </Field>

      <div id="contact-form-status" aria-live="polite">
        {!state.ok ? <FormMessage ok={false} message={state.message} /> : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-4 text-subtle">
          We reply within one working day. See our{" "}
          <Link href="/privacy" className="underline underline-offset-2">
            privacy policy
          </Link>
          .
        </p>
        <SubmitButton pending={pending} className="w-full sm:w-auto">
          {pending ? "Sending…" : "Send message"}
        </SubmitButton>
      </div>
    </form>
  )
}
