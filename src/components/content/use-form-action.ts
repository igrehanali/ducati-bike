"use client"

import { startTransition, useActionState, type FormEvent } from "react"

import type { FormState } from "@/app/actions"

type Action = (prev: FormState, formData: FormData) => Promise<FormState>

/**
 * Wraps a server action with useActionState. Spread `formProps` on the <form>:
 * - `action` keeps progressive enhancement (the form posts to the server action before hydration);
 * - `onSubmit` dispatches in a transition and prevents React's automatic form reset, so the
 *   customer keeps what they typed when validation fails.
 */
export function useFormAction(action: Action) {
  const [state, dispatch, pending] = useActionState<FormState, FormData>(action, { ok: false })

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    startTransition(() => dispatch(data))
  }

  const error = (field: string) => state.errors?.[field]?.[0]

  return { state, pending, error, formProps: { action: dispatch, onSubmit } }
}
