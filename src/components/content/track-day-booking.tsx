"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { bookTrackDay } from "@/app/actions"
import { SelectAndScrollButton, useSelection } from "@/components/content/selection"
import { useFormAction } from "@/components/content/use-form-action"
import { Field, FormMessage, NativeSelect, SubmitButton, TextInput } from "@/components/site/form"
import { formatPrice } from "@/lib/format"
import { trackDays, trackGroups, type TrackDay } from "@/lib/experiences"
import { cn } from "@/lib/utils"

const LEATHERS_PRICE = 60

/* ---------- Event cards ---------- */

function SpacesBadge({ event }: { event: TrackDay }) {
  if (event.spacesLeft === 0) {
    return <span className="bg-black px-2 py-1 font-inter text-xs leading-[14px] font-bold tracking-[-0.2px] text-white">Fully booked</span>
  }
  const low = event.spacesLeft <= 8
  return (
    <span className={cn("px-2 py-1 font-inter text-xs leading-[14px] font-bold tracking-[-0.2px]", low ? "bg-brand-dark text-white" : "bg-chip text-black")}>
      {low ? `Only ${event.spacesLeft} spaces left` : `${event.spacesLeft} spaces left`}
    </span>
  )
}

export function TrackDayCards() {
  const { value } = useSelection()
  return (
    <ul className="grid gap-x-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {trackDays.map((event) => {
        const full = event.spacesLeft === 0
        const selected = value === event.id
        return (
          <li key={event.id}>
            <article className={cn("group flex h-full flex-col gap-5", full && "opacity-80")}>
              <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                <Image
                  src={event.image}
                  alt={`${event.circuit} circuit`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className={cn("object-cover transition duration-500 group-hover:scale-[1.03]", full && "grayscale")}
                />
                <div className="absolute top-4 left-4 flex gap-1">
                  <SpacesBadge event={event} />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase">
                  <time dateTime={event.isoDate}>{event.date}</time>
                </p>
                <h3 className="font-inter text-xl leading-6 font-medium tracking-[-0.4px]">{event.circuit}</h3>
                <p className="text-sm leading-[17px] tracking-[-0.3px] text-subtle">
                  {event.location} · {event.lengthMiles} mile lap
                </p>
                <div className="mt-auto flex items-center justify-between gap-4 pt-3">
                  <p className="flex flex-col">
                    <span className="text-xs leading-4 text-subtle">From</span>
                    <span className="font-mono text-lg leading-6">{formatPrice(event.price)}</span>
                  </p>
                  <SelectAndScrollButton
                    value={event.id}
                    target="book"
                    focusId="track-name"
                    disabled={full}
                    label={full ? `${event.circuit} is fully booked` : `Book ${event.circuit} on ${event.date}`}
                    className={cn(
                      "flex h-[42px] min-w-[132px] items-center justify-center px-6 text-sm leading-[21px] font-medium uppercase transition-colors disabled:cursor-not-allowed",
                      full ? "bg-chip text-subtle" : selected ? "bg-brand-dark text-white" : "bg-black text-white hover:bg-black/85"
                    )}
                  >
                    {full ? "Fully booked" : selected ? "Selected" : "Book"}
                  </SelectAndScrollButton>
                </div>
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}

/* ---------- Booking form ---------- */

export function TrackDayForm() {
  const [attempt, setAttempt] = useState(0)
  return <TrackDayFormInner key={attempt} onReset={() => setAttempt((n) => n + 1)} />
}

function TrackDayFormInner({ onReset }: { onReset: () => void }) {
  const { state, pending, formProps, error } = useFormAction(bookTrackDay)
  const { value: eventId, setValue: setEventId } = useSelection()
  const [leathers, setLeathers] = useState(false)
  const event = trackDays.find((t) => t.id === eventId)
  const total = (event?.price ?? 0) + (leathers ? LEATHERS_PRICE : 0)

  if (state.ok) {
    return (
      <div className="flex flex-col items-start gap-5 bg-surface p-6 md:p-10" role="status">
        <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase">Booking reference</p>
        <p className="font-mono text-[32px] leading-10 tracking-[-0.5px]">{state.reference}</p>
        <h3 className="text-2xl leading-[29px] font-semibold tracking-[-0.5px]">You&apos;re on the grid!</h3>
        <p className="max-w-[560px] text-base leading-6 text-subtle">{state.message}</p>
        <p className="max-w-[560px] text-sm leading-5 text-subtle">
          Joining instructions, the rider declaration and noise limits will follow by email a week before the event.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setEventId("")
              onReset()
            }}
            className="h-[42px] bg-black px-8 text-sm leading-[21px] font-medium text-white uppercase hover:bg-black/85"
          >
            Book another date
          </button>
          <Link href="/shop/suits" className="flex h-[42px] items-center border border-black px-8 text-sm leading-[21px] font-medium uppercase transition-colors hover:bg-black hover:text-white">
            Shop race suits
          </Link>
        </div>
      </div>
    )
  }

  const groupError = error("group")
  const termsError = error("terms")

  return (
    <form {...formProps} noValidate className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-5" disabled={pending}>
        <legend className="mb-4 font-inter text-lg leading-[22px] font-medium tracking-[-0.4px]">1. Choose your event</legend>
        <Field label="Event" htmlFor="track-event" error={error("event")} required>
          <NativeSelect id="track-event" name="event" required value={eventId} onChange={(e) => setEventId(e.target.value)} invalid={Boolean(error("event"))}>
            <option value="" disabled>
              Choose a date
            </option>
            {trackDays.map((t) => (
              <option key={t.id} value={t.id} disabled={t.spacesLeft === 0}>
                {t.circuit} — {t.date} — {formatPrice(t.price)}
                {t.spacesLeft === 0 ? " (fully booked)" : ""}
              </option>
            ))}
          </NativeSelect>
        </Field>

        <div role="radiogroup" aria-labelledby="track-group-label" aria-describedby={groupError ? "track-group-error" : undefined} className="flex flex-col gap-2">
          <p id="track-group-label" className="text-sm leading-[17px] font-semibold tracking-[-0.3px]">
            Riding group<span className="text-brand-dark"> *</span>
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {trackGroups.map((group) => (
              <label
                key={group.id}
                className={cn(
                  "relative flex cursor-pointer flex-col gap-1.5 border p-4 transition-colors has-[:checked]:border-black has-[:checked]:bg-black has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-black/30",
                  groupError ? "border-brand-dark" : "border-black/25 hover:border-black"
                )}
              >
                <input type="radio" name="group" value={group.id} className="sr-only" />
                <span className="font-inter text-base leading-5 font-medium">{group.label}</span>
                <span className="text-xs leading-4 opacity-75">{group.description}</span>
              </label>
            ))}
          </div>
          {groupError ? (
            <p id="track-group-error" role="alert" className="text-xs leading-4 text-brand-dark">
              {groupError}
            </p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5" disabled={pending}>
        <legend className="mb-4 font-inter text-lg leading-[22px] font-medium tracking-[-0.4px]">2. Rider details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="track-name" error={error("name")} required>
            <TextInput id="track-name" name="name" autoComplete="name" invalid={Boolean(error("name"))} />
          </Field>
          <Field label="Email address" htmlFor="track-email" error={error("email")} required>
            <TextInput id="track-email" name="email" type="email" autoComplete="email" invalid={Boolean(error("email"))} />
          </Field>
          <Field label="Mobile number" htmlFor="track-phone" error={error("phone")} required>
            <TextInput id="track-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" invalid={Boolean(error("phone"))} />
          </Field>
          <Field label="Your bike" htmlFor="track-bike" error={error("bike")} hint="Make, model and year, e.g. Fulmine V4 S 2025" required>
            <TextInput id="track-bike" name="bike" invalid={Boolean(error("bike"))} />
          </Field>
        </div>
        <label className="flex cursor-pointer items-start gap-3 border border-black/25 p-4 transition-colors hover:border-black has-[:checked]:border-black">
          <input
            type="checkbox"
            name="leathers"
            checked={leathers}
            onChange={(e) => setLeathers(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-black"
          />
          <span className="flex flex-1 flex-col gap-0.5">
            <span className="text-sm leading-5 font-semibold">Hire race leathers, boots & gloves</span>
            <span className="text-xs leading-4 text-subtle">Vellora Corse one-piece suit in your size, collected at signing-on.</span>
          </span>
          <span className="font-mono text-sm">+{formatPrice(LEATHERS_PRICE)}</span>
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-5" disabled={pending}>
        <legend className="mb-4 font-inter text-lg leading-[22px] font-medium tracking-[-0.4px]">3. Emergency contact</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Contact name" htmlFor="track-emergency-name" error={error("emergencyName")} required>
            <TextInput id="track-emergency-name" name="emergencyName" invalid={Boolean(error("emergencyName"))} />
          </Field>
          <Field label="Contact phone" htmlFor="track-emergency-phone" error={error("emergencyPhone")} required>
            <TextInput id="track-emergency-phone" name="emergencyPhone" type="tel" inputMode="tel" invalid={Boolean(error("emergencyPhone"))} />
          </Field>
        </div>
      </fieldset>

      <div className="flex flex-col gap-4 border-t border-black/15 pt-6">
        <div className="flex flex-col gap-1.5">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-5">
            <input
              type="checkbox"
              name="terms"
              disabled={pending}
              aria-invalid={Boolean(termsError) || undefined}
              aria-describedby={termsError ? "track-terms-error" : undefined}
              className="mt-0.5 size-4 shrink-0 accent-black"
            />
            <span>
              I have a full motorcycle licence, will wear full protective gear and accept the{" "}
              <Link href="/terms#experiences" className="font-semibold underline underline-offset-2">
                track day terms
              </Link>
              .<span className="text-brand-dark"> *</span>
            </span>
          </label>
          {termsError ? (
            <p id="track-terms-error" role="alert" className="text-xs leading-4 text-brand-dark">
              {termsError}
            </p>
          ) : null}
        </div>

        <div aria-live="polite">{state.message ? <FormMessage ok={false} message={state.message} /> : null}</div>

        <div className="flex flex-col gap-4 bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-0.5">
            <p className="text-xs leading-4 text-subtle">{event ? `${event.circuit} · ${event.date}${leathers ? " · leathers hire" : ""}` : "Choose an event to see your total"}</p>
            <p className="flex items-baseline gap-2">
              <span className="text-sm font-semibold">Total</span>
              <span className="font-mono text-xl leading-7">{formatPrice(total)}</span>
            </p>
          </div>
          <SubmitButton pending={pending} className="w-full sm:w-auto">
            {pending ? "Booking…" : "Request booking"}
          </SubmitButton>
        </div>
        <p className="text-xs leading-4 text-subtle">No payment is taken now — we&apos;ll email a secure payment link to confirm your place.</p>
      </div>
    </form>
  )
}
