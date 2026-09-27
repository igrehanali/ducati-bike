import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"

/* Form primitives styled to the store's square, black-bordered look. Work with native forms and server actions. */

export const inputClass =
  "h-11 w-full border border-black/25 bg-white px-3.5 text-sm text-black outline-none transition-colors placeholder:text-subtle hover:border-black/50 focus:border-black focus-visible:ring-2 focus-visible:ring-black/10 aria-invalid:border-brand-dark disabled:opacity-50"

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: {
  label: string
  htmlFor: string
  error?: string | string[]
  hint?: ReactNode
  required?: boolean
  children: ReactNode
  className?: string
}) {
  const message = Array.isArray(error) ? error[0] : error
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm leading-[17px] font-semibold tracking-[-0.3px]">
        {label}
        {required ? <span className="text-brand-dark"> *</span> : null}
      </label>
      {children}
      {message ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs leading-4 text-brand-dark">
          {message}
        </p>
      ) : hint ? (
        <p className="text-xs leading-4 text-subtle">{hint}</p>
      ) : null}
    </div>
  )
}

export function TextInput({ className, invalid, ...props }: ComponentProps<"input"> & { invalid?: boolean }) {
  return (
    <input
      aria-invalid={invalid || undefined}
      aria-describedby={invalid && props.id ? `${props.id}-error` : undefined}
      className={cn(inputClass, className)}
      {...props}
    />
  )
}

export function TextArea({ className, invalid, ...props }: ComponentProps<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      aria-describedby={invalid && props.id ? `${props.id}-error` : undefined}
      className={cn(inputClass, "h-auto min-h-32 py-3 leading-5", className)}
      {...props}
    />
  )
}

export function NativeSelect({ className, invalid, children, ...props }: ComponentProps<"select"> & { invalid?: boolean }) {
  return (
    <div className="relative">
      <select
        aria-invalid={invalid || undefined}
        aria-describedby={invalid && props.id ? `${props.id}-error` : undefined}
        className={cn(inputClass, "appearance-none pr-10", className)}
        {...props}
      >
        {children}
      </select>
      <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2">
        <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </div>
  )
}

export function SubmitButton({ pending, children, className, ...props }: ComponentProps<"button"> & { pending?: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending || props.disabled}
      className={cn(
        "flex h-[46px] items-center justify-center gap-2 bg-black px-8 text-sm leading-[21px] font-medium text-white uppercase transition-colors hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    >
      {pending ? <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> : null}
      {children}
    </button>
  )
}

export function FormMessage({ ok, message, reference }: { ok?: boolean; message?: string; reference?: string }) {
  if (!message) return null
  return (
    <div
      role={ok ? "status" : "alert"}
      className={cn("flex flex-col gap-1 border-l-4 px-4 py-3 text-sm leading-5", ok ? "border-[#34a853] bg-[#34a853]/8" : "border-brand-dark bg-brand-dark/5")}
    >
      <p>{message}</p>
      {reference ? <p className="font-mono text-xs">Reference: {reference}</p> : null}
    </div>
  )
}
