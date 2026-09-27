"use client"

import { useActionState, useId } from "react"

import { subscribeNewsletter, type FormState } from "@/app/actions"

export function NewsletterForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(subscribeNewsletter, { ok: false })
  const error = state.errors?.email?.[0]
  const id = useId()

  return (
    <form action={action} className="flex flex-col gap-2" noValidate>
      <div className="flex gap-1">
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Enter your Email"
          aria-invalid={Boolean(error) || undefined}
          className="h-[45px] min-w-0 flex-1 rounded-[6px] border-0 bg-white/25 px-4 text-sm text-white outline-none placeholder:text-white focus-visible:ring-2 focus-visible:ring-white/40"
        />
        <button
          type="submit"
          disabled={pending}
          className="my-auto h-[42px] w-[151px] shrink-0 bg-white text-sm leading-[21px] font-medium text-black hover:bg-white/85 disabled:opacity-60"
        >
          {pending ? "SUBSCRIBING…" : "SUBSCRIBE"}
        </button>
      </div>
      <p aria-live="polite" className={state.ok ? "text-xs text-white/80" : "text-xs text-[#ff8a80]"}>
        {state.ok ? state.message : error}
      </p>
    </form>
  )
}
