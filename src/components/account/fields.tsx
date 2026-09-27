"use client"

import { useState, type ComponentProps, type ReactNode } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { inputClass } from "@/components/site/form"
import { cn } from "@/lib/utils"

export function PasswordInput({
  className,
  invalid,
  id,
  "aria-describedby": describedBy,
  ...props
}: ComponentProps<"input"> & { invalid?: boolean; id: string }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        aria-invalid={invalid || undefined}
        className={cn(inputClass, "pr-12", className)}
        {...props}
        aria-describedby={[invalid ? `${id}-error` : "", describedBy ?? ""].join(" ").trim() || undefined}
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-controls={id}
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
        className="absolute top-1/2 right-1 flex size-9 -translate-y-1/2 items-center justify-center text-subtle transition-colors hover:text-black focus-visible:text-black"
      >
        {visible ? <EyeOffIcon className="size-[18px]" /> : <EyeIcon className="size-[18px]" />}
      </button>
    </div>
  )
}

const LEVELS = [
  { label: "Too weak", color: "bg-brand-dark" },
  { label: "Weak", color: "bg-brand-dark" },
  { label: "Fair", color: "bg-[#ff9800]" },
  { label: "Good", color: "bg-[#8bc34a]" },
  { label: "Strong", color: "bg-[#34a853]" },
]

export function passwordScore(password: string) {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score++
  if (/\d/.test(password)) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score++
  // Passwords that miss the store's rules can never read as better than "Weak".
  if (password.length < 8 || !/\d/.test(password)) score = Math.min(score, 1)
  return score
}

export function PasswordStrength({ password, id }: { password: string; id: string }) {
  const score = passwordScore(password)
  const level = LEVELS[score]
  return (
    <div id={id} className="flex flex-col gap-1.5">
      <div className="grid grid-cols-4 gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((step) => (
          <span key={step} className={cn("h-1 transition-colors", password && score >= step ? level.color : "bg-black/10")} />
        ))}
      </div>
      <p className="text-xs leading-4 text-subtle" aria-live="polite">
        {password ? (
          <>
            Strength: <span className="font-semibold text-black">{level.label}</span>
          </>
        ) : (
          "At least 8 characters, including a number."
        )}
      </p>
    </div>
  )
}

export function CheckboxField({
  id,
  children,
  error,
  className,
  ...props
}: Omit<ComponentProps<"input">, "type" | "children"> & { id: string; children: ReactNode; error?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-4 shrink-0 cursor-pointer accent-black"
          {...props}
        />
        <label htmlFor={id} className="cursor-pointer text-sm leading-5 tracking-[-0.2px]">
          {children}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="pl-7 text-xs leading-4 text-brand-dark">
          {error}
        </p>
      ) : null}
    </div>
  )
}
