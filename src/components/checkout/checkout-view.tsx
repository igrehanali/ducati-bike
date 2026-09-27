"use client"

import { useId, useState, useTransition, type FormEvent, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckIcon, ChevronDownIcon, CreditCardIcon, LockIcon, PencilIcon } from "lucide-react"

import { placeOrder } from "@/app/actions"
import {
  detectBrand,
  formatCardNumber,
  formatExpiry,
  formatPostcode,
  setPromoCode,
  UK_POSTCODE,
  useHydrated,
  usePromoCode,
  validateAddress,
  validateCard,
  validateEmail,
  type AddressFields,
  type FieldErrors,
} from "@/components/checkout/checkout-utils"
import { LineThumb, PaymentBadges, PromoCodeForm, TotalsRows, TrustPoints } from "@/components/checkout/summary-parts"
import { Field, FormMessage, SubmitButton, TextInput } from "@/components/site/form"
import { PageHeader } from "@/components/site/page-header"
import { addOrder, saveAddress, useCurrentUser, type Address } from "@/lib/account-store"
import { clearCart, useCartLines, type CartLine } from "@/lib/cart-store"
import { formatPrice } from "@/lib/format"
import { computeTotals, shippingMethods, type ShippingMethodId } from "@/lib/pricing"
import { cn } from "@/lib/utils"

type Step = 1 | 2 | 3
type Totals = ReturnType<typeof computeTotals>

const crumbs = [{ label: "Your bag", href: "/cart" }, { label: "Checkout" }]

function focusSoon(id: string) {
  window.setTimeout(() => document.getElementById(id)?.focus(), 0)
}

export function CheckoutView() {
  const hydrated = useHydrated()
  const lines = useCartLines()
  const promoCode = usePromoCode()
  const user = useCurrentUser()
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [placed, setPlaced] = useState(false)

  const [step, setStep] = useState<Step>(1)
  const [reached, setReached] = useState<Step>(1)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serverMessage, setServerMessage] = useState<string>()

  // Contact — `null` means "not edited yet", so signed-in details can prefill without effects.
  const [emailInput, setEmailInput] = useState<string | null>(null)
  const [marketingInput, setMarketingInput] = useState<boolean | null>(null)

  // Delivery
  const [addressChoice, setAddressChoice] = useState<string | null>(null)
  const [newAddress, setNewAddress] = useState<Partial<AddressFields>>({})
  const [phoneInput, setPhoneInput] = useState<string | null>(null)
  const [saveToAccount, setSaveToAccount] = useState(true)
  const [method, setMethod] = useState<ShippingMethodId>("standard")

  // Payment (kept in memory only — never sent anywhere)
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" })
  const [billingSame, setBillingSame] = useState(true)
  const [billing, setBilling] = useState({ line1: "", city: "", postcode: "" })

  const email = emailInput ?? user?.email ?? ""
  const marketing = marketingInput ?? user?.marketing ?? false
  const saved = user?.addresses ?? []
  const defaultSaved = saved.find((a) => a.isDefault) ?? saved[0]
  const choice = addressChoice ?? (defaultSaved ? defaultSaved.id : "new")
  const selectedSaved = saved.find((a) => a.id === choice)
  const address: AddressFields = selectedSaved
    ? {
        firstName: selectedSaved.firstName,
        lastName: selectedSaved.lastName,
        line1: selectedSaved.line1,
        line2: selectedSaved.line2 ?? "",
        city: selectedSaved.city,
        postcode: selectedSaved.postcode,
        phone: phoneInput ?? selectedSaved.phone ?? user?.phone ?? "",
      }
    : {
        firstName: newAddress.firstName ?? user?.firstName ?? "",
        lastName: newAddress.lastName ?? user?.lastName ?? "",
        line1: newAddress.line1 ?? "",
        line2: newAddress.line2 ?? "",
        city: newAddress.city ?? "",
        postcode: newAddress.postcode ?? "",
        phone: phoneInput ?? user?.phone ?? "",
      }

  if (!hydrated) return <CheckoutSkeleton />

  if (placed) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-5 py-20 text-center" role="status">
        <span className="size-8 animate-spin rounded-full border-2 border-black/15 border-t-black" aria-hidden="true" />
        <p className="text-base leading-6">Confirming your order…</p>
      </div>
    )
  }

  if (lines.length === 0) {
    return (
      <>
        <PageHeader title="Checkout" crumbs={crumbs} />
        <section className="mx-5 mb-20 flex flex-col items-center gap-4 bg-surface px-5 py-16 text-center md:py-24">
          <h2 className="font-inter text-2xl leading-[30px] font-medium tracking-[-0.6px]">Your bag is empty</h2>
          <p className="max-w-[420px] text-base leading-6 text-subtle">Add something you love to your bag, then come back here to check out.</p>
          <Link href="/shop" className="mt-2 flex h-[42px] items-center bg-black px-8 text-sm leading-[21px] font-medium text-white uppercase hover:bg-black/85">
            Continue shopping
          </Link>
        </section>
      </>
    )
  }

  const totals = computeTotals(lines, method, promoCode)
  const methodInfo = shippingMethods.find((m) => m.id === method) ?? shippingMethods[0]

  function clearError(key: string) {
    if (!errors[key]) return
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function advance(from: Step) {
    const next = (reached > from ? reached : from + 1) as Step
    setStep(next)
    setReached((r) => (next > r ? next : r))
    setErrors({})
    focusSoon(`step-${next}-title`)
  }

  function edit(target: Step) {
    setStep(target)
    setErrors({})
    focusSoon(`step-${target}-title`)
  }

  function showErrors(next: FieldErrors) {
    setErrors(next)
    const first = Object.keys(next)[0]
    if (first) focusSoon(`co-${first}`)
  }

  function submitContact(event: FormEvent) {
    event.preventDefault()
    const error = validateEmail(email)
    if (error) return showErrors({ email: error })
    advance(1)
  }

  function submitDelivery(event: FormEvent) {
    event.preventDefault()
    const next = validateAddress(address)
    if (Object.keys(next).length) {
      // Saved addresses only expose the phone field — anything else wrong means the saved address needs editing.
      if (selectedSaved && Object.keys(next).some((k) => k !== "phone")) {
        setAddressChoice("new")
        setNewAddress({ ...address })
      }
      return showErrors(next)
    }
    advance(2)
  }

  function submitPayment(event: FormEvent) {
    event.preventDefault()
    setServerMessage(undefined)
    const next: FieldErrors = { ...validateCard(card) }
    if (!billingSame) {
      if (billing.line1.trim().length < 3) next.billingLine1 = "Enter your billing address"
      if (billing.city.trim().length < 2) next.billingCity = "Enter your town or city"
      if (!UK_POSTCODE.test(billing.postcode.trim())) next.billingPostcode = "Enter a valid UK postcode"
    }
    if (Object.keys(next).length) return showErrors(next)

    const emailError = validateEmail(email)
    if (emailError) {
      setErrors({ email: emailError })
      return edit(1)
    }
    if (Object.keys(validateAddress(address)).length) return edit(2)

    const digits = card.number.replace(/\D/g, "")
    const payment = { brand: detectBrand(digits), last4: digits.slice(-4) }
    const deliveryAddress = {
      firstName: address.firstName.trim(),
      lastName: address.lastName.trim(),
      line1: address.line1.trim(),
      line2: address.line2.trim() || undefined,
      city: address.city.trim(),
      postcode: formatPostcode(address.postcode),
      phone: address.phone.trim(),
    }

    startTransition(async () => {
      const result = await placeOrder({
        email: email.trim(),
        lines: lines.map((l) => ({ slug: l.slug, quantity: l.quantity, size: l.size, color: l.color, image: l.image })),
        address: deliveryAddress,
        shippingMethod: method,
        promoCode: totals.promo?.code,
        payment,
      })

      if (!result.ok) {
        const fieldErrors = result.errors ?? {}
        setServerMessage(result.message)
        if (fieldErrors.email?.[0]) {
          setErrors({ email: fieldErrors.email[0] })
          setStep(1)
        } else if (fieldErrors.address?.[0] || fieldErrors.shippingMethod?.[0]) {
          setServerMessage(`${result.message} ${fieldErrors.address?.[0] ?? fieldErrors.shippingMethod?.[0]}.`)
          setStep(2)
        } else if (fieldErrors.payment?.[0]) {
          setErrors({ cardNumber: "Please check your card details" })
        }
        focusSoon("checkout-message")
        return
      }

      addOrder(result.order)
      if (user && !selectedSaved && saveToAccount) {
        saveAddress(user.email, { label: saved.length ? `Address ${saved.length + 1}` : "Home", ...deliveryAddress, isDefault: saved.length === 0 })
      }
      setPlaced(true)
      clearCart()
      setPromoCode(null)
      router.push(`/checkout/success?order=${encodeURIComponent(result.order.number)}`)
    })
  }

  const stepState = (n: Step) => (step === n ? "open" : n < reached ? "done" : "upcoming")

  return (
    <>
      <PageHeader title="Checkout" crumbs={crumbs} className="pb-6">
        <p className="flex items-center gap-2 text-[13px] leading-[18px] text-subtle">
          <LockIcon className="size-3.5" aria-hidden="true" />
          Secure checkout · Demo store — no payment is taken
        </p>
      </PageHeader>

      <MobileSummary lines={lines} totals={totals} promoCode={promoCode} methodLabel={methodInfo.label} />

      <div className="grid items-start gap-10 px-5 pb-20 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_420px] xl:gap-16">
        <div className="flex flex-col gap-4">
          <div id="checkout-message" tabIndex={-1} className="outline-none">
            <FormMessage message={serverMessage} />
          </div>

          {/* Step 1 — Contact */}
          <StepSection
            n={1}
            title="Contact"
            state={stepState(1)}
            onEdit={() => edit(1)}
            summary={
              <>
                <p>{email}</p>
                <p className="text-subtle">{marketing ? "Subscribed to news and offers" : "No marketing emails"}</p>
              </>
            }
          >
            <form onSubmit={submitContact} noValidate className="flex flex-col gap-5">
              {user ? (
                <p className="text-sm leading-5 text-subtle">
                  Signed in as <span className="font-semibold text-black">{user.firstName} {user.lastName}</span>
                </p>
              ) : (
                <p className="text-sm leading-5 text-subtle">
                  Have an account?{" "}
                  <Link href="/account/login?next=/checkout" className="font-semibold text-black underline underline-offset-2">
                    Sign in
                  </Link>{" "}
                  for faster checkout, or continue as a guest.
                </p>
              )}
              <Field label="Email address" htmlFor="co-email" error={errors.email} required hint="We'll send your order confirmation here.">
                <TextInput
                  id="co-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  invalid={Boolean(errors.email)}
                  onChange={(e) => {
                    setEmailInput(e.target.value)
                    clearError("email")
                  }}
                />
              </Field>
              <Checkbox id="co-marketing" checked={marketing} onChange={setMarketingInput}>
                Email me about new collections, events and exclusive offers
              </Checkbox>
              <ContinueButton>Continue to delivery</ContinueButton>
            </form>
          </StepSection>

          {/* Step 2 — Delivery */}
          <StepSection
            n={2}
            title="Delivery"
            state={stepState(2)}
            onEdit={() => edit(2)}
            summary={
              <>
                <p>
                  {address.firstName} {address.lastName}, {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}, {address.city} {formatPostcode(address.postcode)}
                </p>
                <p className="text-subtle">
                  {methodInfo.label} · {totals.shipping === 0 ? "FREE" : formatPrice(totals.shipping)}
                </p>
              </>
            }
          >
            <form onSubmit={submitDelivery} noValidate className="flex flex-col gap-6">
              {saved.length ? (
                <fieldset className="flex flex-col gap-3">
                  <legend className="mb-3 text-sm leading-[17px] font-semibold tracking-[-0.3px]">Saved addresses</legend>
                  {saved.map((a) => (
                    <SavedAddressCard key={a.id} address={a} checked={choice === a.id} onSelect={() => { setAddressChoice(a.id); setErrors({}) }} />
                  ))}
                  <RadioCard name="co-address" checked={choice === "new"} onSelect={() => { setAddressChoice("new"); setErrors({}) }}>
                    <span className="text-sm leading-5 font-semibold">Use a new address</span>
                  </RadioCard>
                </fieldset>
              ) : null}

              {choice === "new" ? (
                <div className="grid gap-5 sm:grid-cols-2">
                  <AddressInput k="firstName" label="First name" autoComplete="given-name" address={address} errors={errors} onChange={(k, v) => { setNewAddress((a) => ({ ...a, [k]: v })); clearError(k) }} />
                  <AddressInput k="lastName" label="Last name" autoComplete="family-name" address={address} errors={errors} onChange={(k, v) => { setNewAddress((a) => ({ ...a, [k]: v })); clearError(k) }} />
                  <AddressInput k="line1" label="Address line 1" autoComplete="address-line1" className="sm:col-span-2" address={address} errors={errors} onChange={(k, v) => { setNewAddress((a) => ({ ...a, [k]: v })); clearError(k) }} />
                  <AddressInput k="line2" label="Address line 2 (optional)" autoComplete="address-line2" required={false} className="sm:col-span-2" address={address} errors={errors} onChange={(k, v) => { setNewAddress((a) => ({ ...a, [k]: v })); clearError(k) }} />
                  <AddressInput k="city" label="Town / city" autoComplete="address-level2" address={address} errors={errors} onChange={(k, v) => { setNewAddress((a) => ({ ...a, [k]: v })); clearError(k) }} />
                  <AddressInput
                    k="postcode"
                    label="Postcode"
                    autoComplete="postal-code"
                    inputClassName="uppercase"
                    address={address}
                    errors={errors}
                    onChange={(k, v) => { setNewAddress((a) => ({ ...a, [k]: v })); clearError(k) }}
                    onBlur={() => address.postcode && UK_POSTCODE.test(address.postcode.trim()) && setNewAddress((a) => ({ ...a, postcode: formatPostcode(address.postcode) }))}
                  />
                </div>
              ) : null}

              <Field label="Phone number" htmlFor="co-phone" error={errors.phone} required hint="For delivery updates only, e.g. 07700 900123">
                <TextInput
                  id="co-phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={address.phone}
                  invalid={Boolean(errors.phone)}
                  onChange={(e) => {
                    setPhoneInput(e.target.value)
                    clearError("phone")
                  }}
                />
              </Field>

              {user && choice === "new" ? (
                <Checkbox id="co-save-address" checked={saveToAccount} onChange={setSaveToAccount}>
                  Save this address to my account
                </Checkbox>
              ) : null}

              <fieldset className="flex flex-col gap-3">
                <legend className="mb-3 text-sm leading-[17px] font-semibold tracking-[-0.3px]">Delivery method</legend>
                {shippingMethods.map((m) => {
                  const price = computeTotals(lines, m.id, promoCode).shipping
                  return (
                    <RadioCard key={m.id} name="co-method" checked={method === m.id} onSelect={() => setMethod(m.id)}>
                      <span className="flex flex-1 items-start justify-between gap-4">
                        <span className="flex flex-col gap-0.5">
                          <span className="text-sm leading-5 font-semibold">{m.label}</span>
                          <span className="text-[13px] leading-[18px] text-subtle">{m.description}</span>
                        </span>
                        <span className="shrink-0 font-mono text-sm leading-5 font-semibold">{price === 0 ? "FREE" : formatPrice(price)}</span>
                      </span>
                    </RadioCard>
                  )
                })}
              </fieldset>

              <ContinueButton>Continue to payment</ContinueButton>
            </form>
          </StepSection>

          {/* Step 3 — Payment */}
          <StepSection n={3} title="Payment" state={stepState(3)} onEdit={() => edit(3)}>
            <form onSubmit={submitPayment} noValidate className="flex flex-col gap-6">
              <div role="note" className="flex gap-3 border border-black bg-surface px-4 py-3.5 text-sm leading-5">
                <CreditCardIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <p>
                  <strong className="font-semibold">Demo store — no payment is taken.</strong> Use test card{" "}
                  <span className="font-mono whitespace-nowrap">4242 4242 4242 4242</span>, any future expiry and any CVC.
                </p>
              </div>

              <CardForm card={card} errors={errors} onChange={(patch, key) => { setCard((c) => ({ ...c, ...patch })); clearError(key) }} />

              <div className="flex flex-col gap-5">
                <Checkbox id="co-billing-same" checked={billingSame} onChange={setBillingSame}>
                  Billing address is the same as delivery address
                </Checkbox>
                {!billingSame ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Billing address" htmlFor="co-billingLine1" error={errors.billingLine1} required className="sm:col-span-2">
                      <TextInput id="co-billingLine1" autoComplete="billing address-line1" value={billing.line1} invalid={Boolean(errors.billingLine1)} onChange={(e) => { setBilling((b) => ({ ...b, line1: e.target.value })); clearError("billingLine1") }} />
                    </Field>
                    <Field label="Town / city" htmlFor="co-billingCity" error={errors.billingCity} required>
                      <TextInput id="co-billingCity" autoComplete="billing address-level2" value={billing.city} invalid={Boolean(errors.billingCity)} onChange={(e) => { setBilling((b) => ({ ...b, city: e.target.value })); clearError("billingCity") }} />
                    </Field>
                    <Field label="Postcode" htmlFor="co-billingPostcode" error={errors.billingPostcode} required>
                      <TextInput id="co-billingPostcode" autoComplete="billing postal-code" className="uppercase" value={billing.postcode} invalid={Boolean(errors.billingPostcode)} onChange={(e) => { setBilling((b) => ({ ...b, postcode: e.target.value })); clearError("billingPostcode") }} />
                    </Field>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 border-t border-rule pt-6">
                <SubmitButton pending={pending} className="h-[52px] w-full text-base">
                  {pending ? "Placing order…" : `Place order · ${formatPrice(totals.total)}`}
                </SubmitButton>
                <p className="text-center text-xs leading-4 text-subtle">
                  By placing your order you agree to our{" "}
                  <Link href="/terms" className="underline underline-offset-2 hover:text-black">terms of sale</Link> and{" "}
                  <Link href="/privacy" className="underline underline-offset-2 hover:text-black">privacy policy</Link>.
                </p>
              </div>
            </form>
          </StepSection>
        </div>

        <aside aria-labelledby="co-summary-title" className="hidden bg-surface p-6 lg:sticky lg:top-6 lg:block">
          <h2 id="co-summary-title" className="mb-6 text-xl leading-6 font-semibold tracking-[-0.4px]">
            Order summary
          </h2>
          <OrderSummary lines={lines} totals={totals} promoCode={promoCode} methodLabel={methodInfo.label} />
        </aside>
      </div>
    </>
  )
}

/* ---------- Layout pieces ---------- */

function StepSection({
  n,
  title,
  state,
  onEdit,
  summary,
  children,
}: {
  n: Step
  title: string
  state: "open" | "done" | "upcoming"
  onEdit: () => void
  summary?: ReactNode
  children: ReactNode
}) {
  return (
    <section aria-labelledby={`step-${n}-title`} className={cn("border px-5 py-5 md:px-6", state === "open" ? "border-black" : "border-rule")}>
      <div className="flex items-center justify-between gap-4">
        <h2 id={`step-${n}-title`} tabIndex={-1} className={cn("flex items-center gap-3 text-lg leading-[22px] font-semibold tracking-[-0.4px] outline-none", state === "upcoming" && "text-inactive")}>
          <span
            aria-hidden="true"
            className={cn(
              "flex size-7 shrink-0 items-center justify-center font-mono text-sm",
              state === "upcoming" ? "border border-rule" : "bg-black text-white"
            )}
          >
            {state === "done" ? <CheckIcon className="size-4" /> : n}
          </span>
          <span>
            <span className="sr-only">Step {n}: </span>
            {title}
            {state === "done" ? <span className="sr-only"> (completed)</span> : null}
          </span>
        </h2>
        {state === "done" ? (
          <button type="button" onClick={onEdit} className="flex items-center gap-1.5 text-[13px] leading-[18px] underline underline-offset-2 hover:text-subtle">
            <PencilIcon className="size-3.5" aria-hidden="true" />
            Edit<span className="sr-only"> {title.toLowerCase()}</span>
          </button>
        ) : null}
      </div>
      {state === "open" ? <div className="pt-6">{children}</div> : null}
      {state === "done" && summary ? <div className="flex flex-col gap-1 pt-3 pl-10 text-sm leading-5 break-words">{summary}</div> : null}
    </section>
  )
}

function ContinueButton({ children }: { children: ReactNode }) {
  return (
    <button type="submit" className="flex h-[46px] w-full items-center justify-center bg-black px-8 text-sm leading-[21px] font-medium text-white uppercase transition-colors hover:bg-black/85 sm:w-fit">
      {children}
    </button>
  )
}

function Checkbox({ id, checked, onChange, children }: { id: string; checked: boolean; onChange: (checked: boolean) => void; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 size-4 shrink-0 cursor-pointer accent-black" />
      <label htmlFor={id} className="cursor-pointer text-sm leading-5">
        {children}
      </label>
    </div>
  )
}

function RadioCard({ name, checked, onSelect, children }: { name: string; checked: boolean; onSelect: () => void; children: ReactNode }) {
  const id = useId()
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-3 border px-4 py-3.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-black/20",
        checked ? "border-black bg-surface/60" : "border-rule hover:border-black/50"
      )}
    >
      <input id={id} type="radio" name={name} checked={checked} onChange={onSelect} className="mt-0.5 size-4 shrink-0 cursor-pointer accent-black" />
      {children}
    </label>
  )
}

function SavedAddressCard({ address, checked, onSelect }: { address: Address; checked: boolean; onSelect: () => void }) {
  return (
    <RadioCard name="co-address" checked={checked} onSelect={onSelect}>
      <span className="flex flex-col gap-0.5 text-sm leading-5">
        <span className="flex items-center gap-2 font-semibold">
          {address.label}
          {address.isDefault ? <span className="bg-chip px-1.5 py-0.5 font-inter text-[10px] leading-3 font-bold">DEFAULT</span> : null}
        </span>
        <span>
          {address.firstName} {address.lastName}
        </span>
        <span className="text-subtle">
          {address.line1}
          {address.line2 ? `, ${address.line2}` : ""}, {address.city} {address.postcode}
        </span>
      </span>
    </RadioCard>
  )
}

function AddressInput({
  k,
  label,
  autoComplete,
  address,
  errors,
  onChange,
  onBlur,
  required = true,
  className,
  inputClassName,
}: {
  k: keyof AddressFields
  label: string
  autoComplete: string
  address: AddressFields
  errors: FieldErrors
  onChange: (key: keyof AddressFields, value: string) => void
  onBlur?: () => void
  required?: boolean
  className?: string
  inputClassName?: string
}) {
  const id = `co-${k}`
  return (
    <Field label={label} htmlFor={id} error={errors[k]} required={required} className={className}>
      <TextInput
        id={id}
        autoComplete={autoComplete}
        value={address[k]}
        invalid={Boolean(errors[k])}
        required={required}
        className={inputClassName}
        onChange={(e) => onChange(k, e.target.value)}
        onBlur={onBlur}
      />
    </Field>
  )
}

type Card = { number: string; name: string; expiry: string; cvc: string }

function CardForm({ card, errors, onChange }: { card: Card; errors: FieldErrors; onChange: (patch: Partial<Card>, key: string) => void }) {
  const digits = card.number.replace(/\D/g, "")
  const brand = detectBrand(digits)
  const amex = brand === "Amex"
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Card number" htmlFor="co-cardNumber" error={errors.cardNumber} required className="sm:col-span-2">
        <div className="relative">
          <TextInput
            id="co-cardNumber"
            inputMode="numeric"
            autoComplete="off"
            placeholder="1234 1234 1234 1234"
            maxLength={amex ? 17 : 23}
            value={card.number}
            invalid={Boolean(errors.cardNumber)}
            className="pr-28 font-mono tracking-[0.5px]"
            onChange={(e) => onChange({ number: formatCardNumber(e.target.value) }, "cardNumber")}
          />
          <span
            aria-live="polite"
            className={cn(
              "pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 border px-1.5 py-0.5 font-mono text-[10px] leading-3 font-semibold tracking-[0.2px] uppercase transition-opacity",
              digits && brand !== "Card" ? "border-black opacity-100" : "border-rule opacity-0"
            )}
          >
            {brand !== "Card" ? brand : ""}
          </span>
        </div>
      </Field>
      <Field label="Name on card" htmlFor="co-cardName" error={errors.cardName} required className="sm:col-span-2">
        <TextInput id="co-cardName" autoComplete="off" value={card.name} invalid={Boolean(errors.cardName)} onChange={(e) => onChange({ name: e.target.value }, "cardName")} />
      </Field>
      <Field label="Expiry (MM/YY)" htmlFor="co-cardExpiry" error={errors.cardExpiry} required>
        <TextInput
          id="co-cardExpiry"
          inputMode="numeric"
          autoComplete="off"
          placeholder="MM/YY"
          maxLength={5}
          value={card.expiry}
          invalid={Boolean(errors.cardExpiry)}
          className="font-mono"
          onChange={(e) => onChange({ expiry: formatExpiry(e.target.value, card.expiry) }, "cardExpiry")}
        />
      </Field>
      <Field label="Security code (CVC)" htmlFor="co-cardCvc" error={errors.cardCvc} required hint={amex ? "4 digits on the front of your card" : "3 digits on the back of your card"}>
        <TextInput
          id="co-cardCvc"
          inputMode="numeric"
          autoComplete="off"
          placeholder={amex ? "1234" : "123"}
          maxLength={4}
          value={card.cvc}
          invalid={Boolean(errors.cardCvc)}
          className="font-mono"
          onChange={(e) => onChange({ cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }, "cardCvc")}
        />
      </Field>
    </div>
  )
}

/* ---------- Order summary ---------- */

function OrderSummary({ lines, totals, promoCode, methodLabel }: { lines: CartLine[]; totals: Totals; promoCode: string | null; methodLabel: string }) {
  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-5">
        {lines.map((line) => (
          <li key={line.id} className="flex items-center gap-4">
            <LineThumb image={line.image} name={line.name} quantity={line.quantity} className="bg-white" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="font-inter text-[13px] leading-4 font-medium tracking-[-0.3px] uppercase">{line.name}</p>
              <p className="text-xs leading-4 text-subtle">{[line.size && `Size ${line.size}`, line.color].filter(Boolean).join(" · ")}</p>
            </div>
            <p className="shrink-0 font-mono text-sm leading-5 font-semibold">{formatPrice(line.price * line.quantity)}</p>
          </li>
        ))}
      </ul>
      <div className="border-t border-rule pt-6">
        <PromoCodeForm lines={lines} code={promoCode} />
      </div>
      <div className="border-t border-rule pt-6">
        <TotalsRows totals={totals} shippingLabel={methodLabel} />
      </div>
      <PaymentBadges />
      <TrustPoints className="border-t border-rule pt-5" />
    </div>
  )
}

function MobileSummary(props: { lines: CartLine[]; totals: Totals; promoCode: string | null; methodLabel: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mb-6 border-y border-rule bg-surface lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="co-mobile-summary"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="flex items-center gap-2 text-sm leading-5 font-semibold">
          {open ? "Hide" : "Show"} order summary
          <ChevronDownIcon className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
        </span>
        <span className="font-mono text-base leading-5 font-semibold">{formatPrice(props.totals.total)}</span>
      </button>
      <div id="co-mobile-summary" hidden={!open} className="px-5 pt-2 pb-6">
        <OrderSummary {...props} />
      </div>
    </div>
  )
}

function CheckoutSkeleton() {
  return (
    <>
      <PageHeader title="Checkout" crumbs={crumbs} className="pb-6" />
      <div className="grid gap-10 px-5 pb-20 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_420px] xl:gap-16" aria-busy="true" aria-label="Loading checkout">
        <div className="flex flex-col gap-4">
          <div className="h-[260px] animate-pulse border border-rule bg-surface/60" />
          <div className="h-[68px] animate-pulse border border-rule" />
          <div className="h-[68px] animate-pulse border border-rule" />
        </div>
        <div className="hidden h-[480px] animate-pulse bg-surface lg:block" />
      </div>
    </>
  )
}
