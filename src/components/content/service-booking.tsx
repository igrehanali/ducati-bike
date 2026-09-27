"use client"

import { useState, useSyncExternalStore } from "react"

import { bookService } from "@/app/actions"
import { SelectAndScrollButton, useSelection } from "@/components/content/selection"
import { useFormAction } from "@/components/content/use-form-action"
import { Field, FormMessage, NativeSelect, SubmitButton, TextArea, TextInput } from "@/components/site/form"
import { formatPrice } from "@/lib/format"
import { bikeModels, servicePackages } from "@/lib/experiences"
import { cn } from "@/lib/utils"

/* ---------- Package cards ---------- */

export function ServicePackageCards() {
  const { value } = useSelection()
  return (
    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {servicePackages.map((pkg) => {
        const selected = value === pkg.id
        return (
          <li key={pkg.id}>
            <article className={cn("flex h-full flex-col gap-5 border p-6 transition-colors", selected ? "border-black bg-surface" : "border-black/15")}>
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-inter text-xl leading-6 font-medium tracking-[-0.4px]">{pkg.label}</h3>
                <span className="shrink-0 bg-chip px-2 py-1 font-mono text-xs leading-[14px]">{pkg.duration}</span>
              </div>
              <p className="text-sm leading-5 text-subtle">{pkg.description}</p>
              <div className="mt-auto flex items-center justify-between gap-4 pt-2">
                <p className="flex flex-col">
                  <span className="text-xs leading-4 text-subtle">{pkg.id === "tyres" ? "Per wheel" : "From"}</span>
                  <span className="font-mono text-lg leading-6">{formatPrice(pkg.price)}</span>
                </p>
                <SelectAndScrollButton
                  value={pkg.id}
                  target="book"
                  focusId="service-name"
                  label={`Book ${pkg.label.toLowerCase()}`}
                  className={cn(
                    "flex h-[42px] items-center justify-center px-6 text-sm leading-[21px] font-medium uppercase transition-colors",
                    selected ? "bg-brand-dark text-white" : "border border-black bg-white text-black hover:bg-black hover:text-white"
                  )}
                >
                  {selected ? "Selected" : "Book this"}
                </SelectAndScrollButton>
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}

/* ---------- Booking form ---------- */

const noop = () => () => {}

function tomorrow() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function ServiceForm() {
  const [attempt, setAttempt] = useState(0)
  return <ServiceFormInner key={attempt} onReset={() => setAttempt((n) => n + 1)} />
}

function ServiceFormInner({ onReset }: { onReset: () => void }) {
  const { state, pending, formProps, error } = useFormAction(bookService)
  const { value: service, setValue: setService } = useSelection()
  // Local "tomorrow" in the customer's timezone; only known on the client.
  const minDate = useSyncExternalStore(noop, tomorrow, () => undefined)
  const pkg = servicePackages.find((s) => s.id === service)

  if (state.ok) {
    return (
      <div className="flex flex-col items-start gap-5 bg-surface p-6 md:p-10" role="status">
        <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase">Booking reference</p>
        <p className="font-mono text-[32px] leading-10 tracking-[-0.5px]">{state.reference}</p>
        <h3 className="text-2xl leading-[29px] font-semibold tracking-[-0.5px]">Booking requested</h3>
        <p className="max-w-[560px] text-base leading-6 text-subtle">{state.message}</p>
        <button
          type="button"
          onClick={() => {
            setService("")
            onReset()
          }}
          className="h-[42px] bg-black px-8 text-sm leading-[21px] font-medium text-white uppercase hover:bg-black/85"
        >
          Book another service
        </button>
      </div>
    )
  }

  return (
    <form {...formProps} noValidate className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-5" disabled={pending}>
        <legend className="mb-4 font-inter text-lg leading-[22px] font-medium tracking-[-0.4px]">1. Your details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="service-name" error={error("name")} required className="sm:col-span-2">
            <TextInput id="service-name" name="name" autoComplete="name" invalid={Boolean(error("name"))} />
          </Field>
          <Field label="Email address" htmlFor="service-email" error={error("email")} required>
            <TextInput id="service-email" name="email" type="email" autoComplete="email" invalid={Boolean(error("email"))} />
          </Field>
          <Field label="Phone" htmlFor="service-phone" error={error("phone")} required>
            <TextInput id="service-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" invalid={Boolean(error("phone"))} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5" disabled={pending}>
        <legend className="mb-4 font-inter text-lg leading-[22px] font-medium tracking-[-0.4px]">2. Your motorcycle</legend>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Model" htmlFor="service-model" error={error("model")} required>
            <NativeSelect id="service-model" name="model" defaultValue="" invalid={Boolean(error("model"))}>
              <option value="" disabled>
                Choose model
              </option>
              {bikeModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Registration" htmlFor="service-registration" error={error("registration")} required>
            <TextInput id="service-registration" name="registration" autoComplete="off" maxLength={10} placeholder="AB12 CDE" className="font-mono uppercase" invalid={Boolean(error("registration"))} />
          </Field>
          <Field label="Mileage" htmlFor="service-mileage" error={error("mileage")} required>
            <TextInput id="service-mileage" name="mileage" type="number" inputMode="numeric" min={0} max={300000} step={1} placeholder="e.g. 7500" invalid={Boolean(error("mileage"))} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5" disabled={pending}>
        <legend className="mb-4 font-inter text-lg leading-[22px] font-medium tracking-[-0.4px]">3. Service & date</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Service"
            htmlFor="service-service"
            error={error("service")}
            hint={pkg ? `${formatPrice(pkg.price)} · ${pkg.duration}` : undefined}
            required
          >
            <NativeSelect id="service-service" name="service" value={service} onChange={(e) => setService(e.target.value)} invalid={Boolean(error("service"))}>
              <option value="" disabled>
                Choose a service
              </option>
              {servicePackages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} — {formatPrice(s.price)}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Preferred date" htmlFor="service-date" error={error("date")} hint="We’ll confirm a drop-off time by email" required>
            <TextInput id="service-date" name="date" type="date" min={minDate} invalid={Boolean(error("date"))} />
          </Field>
        </div>
        <Field label="Notes" htmlFor="service-notes" error={error("notes")} hint="Optional — warning lights, parts to fit, collection & delivery…">
          <TextArea id="service-notes" name="notes" rows={4} maxLength={1000} invalid={Boolean(error("notes"))} />
        </Field>
      </fieldset>

      <div aria-live="polite">{state.message ? <FormMessage ok={false} message={state.message} /> : null}</div>

      <div className="flex flex-col gap-3 border-t border-black/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-4 text-subtle">No payment now — you pay when you collect your bike.</p>
        <SubmitButton pending={pending} className="w-full sm:w-auto">
          {pending ? "Sending…" : "Request booking"}
        </SubmitButton>
      </div>
    </form>
  )
}
