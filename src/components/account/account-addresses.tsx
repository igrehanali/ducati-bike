"use client"

import { useState, type FormEvent } from "react"
import { MapPinIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import { CheckboxField } from "@/components/account/fields"
import { UK_POSTCODE_RE, dialogContent, formatPostcode, primaryButton, secondaryButton } from "@/components/account/utils"
import { Field, SubmitButton, TextInput } from "@/components/site/form"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { deleteAddress, saveAddress, type Address, type User } from "@/lib/account-store"
import { cn } from "@/lib/utils"

type Editing = Address | "new" | null

export function AccountAddresses({ user }: { user: User }) {
  const [editing, setEditing] = useState<Editing>(null)
  const [removing, setRemoving] = useState<Address | null>(null)
  // Default first, then in the order they were added.
  const addresses = [...user.addresses].sort((a, b) => Number(b.isDefault) - Number(a.isDefault))

  function makeDefault(address: Address) {
    saveAddress(user.email, { ...address, isDefault: true })
    toast.success(`${address.label} is now your default address`)
  }

  function confirmDelete() {
    if (!removing) return
    deleteAddress(user.email, removing.id)
    toast(`Deleted ${removing.label}`)
    setRemoving(null)
  }

  return (
    <section aria-labelledby="addresses-title" className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id="addresses-title" className="font-inter text-2xl leading-[30px] font-medium tracking-[-0.6px]">
            Addresses
          </h2>
          <p className="text-sm text-subtle">Saved addresses are offered at checkout.</p>
        </div>
        {addresses.length ? (
          <button type="button" onClick={() => setEditing("new")} className={cn(primaryButton, "px-5")}>
            <PlusIcon className="size-4" aria-hidden="true" />
            Add address
          </button>
        ) : null}
      </div>

      {addresses.length ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <li key={address.id} className={cn("flex flex-col gap-4 border p-5", address.isDefault ? "border-black" : "border-rule")}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-inter text-base leading-[19px] font-medium tracking-[-0.3px]">{address.label}</h3>
                {address.isDefault ? (
                  <span className="bg-black px-2 py-1 font-inter text-xs leading-[14px] font-bold tracking-[-0.2px] text-white">Default</span>
                ) : null}
              </div>
              <address className="flex-1 text-sm leading-5 text-subtle not-italic">
                <span className="text-black">
                  {address.firstName} {address.lastName}
                </span>
                <br />
                {address.line1}
                {address.line2 ? (
                  <>
                    <br />
                    {address.line2}
                  </>
                ) : null}
                <br />
                {address.city}
                <br />
                <span className="font-mono">{address.postcode}</span>
                {address.phone ? (
                  <>
                    <br />
                    <span className="font-mono">{address.phone}</span>
                  </>
                ) : null}
              </address>
              <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-rule pt-4 text-sm leading-5 font-medium">
                <button type="button" onClick={() => setEditing(address)} className="flex items-center gap-1.5 hover:underline" aria-label={`Edit ${address.label}`}>
                  <PencilIcon className="size-3.5" aria-hidden="true" />
                  Edit
                </button>
                {!address.isDefault ? (
                  <button type="button" onClick={() => makeDefault(address)} className="hover:underline" aria-label={`Set ${address.label} as default`}>
                    Set as default
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setRemoving(address)}
                  className="flex items-center gap-1.5 text-brand-dark hover:underline"
                  aria-label={`Delete ${address.label}`}
                >
                  <Trash2Icon className="size-3.5" aria-hidden="true" />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-start gap-3 border border-rule p-6 md:p-10">
          <MapPinIcon className="size-6" aria-hidden="true" />
          <h3 className="font-inter text-xl leading-[26px] font-medium tracking-[-0.4px]">No saved addresses</h3>
          <p className="text-base leading-6 text-subtle">Add a delivery address to speed through checkout next time.</p>
          <button type="button" onClick={() => setEditing("new")} className={cn(primaryButton, "mt-3")}>
            Add address
          </button>
        </div>
      )}

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className={dialogContent}>
          <DialogTitle className="text-xl font-semibold">{editing && editing !== "new" ? "Edit address" : "Add a new address"}</DialogTitle>
          <DialogDescription className="text-sm text-subtle">We currently deliver to UK mainland addresses.</DialogDescription>
          {editing !== null ? (
            <AddressForm
              key={editing === "new" ? "new" : editing.id}
              user={user}
              address={editing === "new" ? undefined : editing}
              onDone={() => setEditing(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={removing !== null} onOpenChange={(open) => !open && setRemoving(null)}>
        <DialogContent className={dialogContent}>
          <DialogTitle className="text-xl font-semibold">Delete this address?</DialogTitle>
          <DialogDescription className="text-sm leading-5 text-subtle">
            {removing ? `${removing.label}: ${removing.line1}, ${removing.city} ${removing.postcode}` : null}. This can&apos;t be undone.
          </DialogDescription>
          <div className="flex flex-col gap-2 sm:flex-row">
            <DialogClose className={cn(secondaryButton, "flex-1")}>Cancel</DialogClose>
            <button type="button" onClick={confirmDelete} className={cn(primaryButton, "flex-1 bg-brand-dark hover:bg-brand-dark/85")}>
              Delete address
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}

type AddressKey = "label" | "firstName" | "lastName" | "line1" | "city" | "postcode" | "phone"
type Errors = Partial<Record<AddressKey, string>>
const ORDER: AddressKey[] = ["label", "firstName", "lastName", "line1", "city", "postcode", "phone"]
const fieldId = (key: string) => `address-${key}`

function AddressForm({ user, address, onDone }: { user: User; address?: Address; onDone: () => void }) {
  const [errors, setErrors] = useState<Errors>({})
  const isFirst = user.addresses.length === 0

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const value = (key: string) => String(data.get(key) ?? "").trim()
    const next = {
      label: value("label") || "Home",
      firstName: value("firstName"),
      lastName: value("lastName"),
      line1: value("line1"),
      line2: value("line2") || undefined,
      city: value("city"),
      postcode: value("postcode"),
      phone: value("phone") || undefined,
      isDefault: data.get("isDefault") === "on",
    }
    const found: Errors = {}
    if (!next.firstName) found.firstName = "Enter a first name"
    if (!next.lastName) found.lastName = "Enter a last name"
    if (!next.line1) found.line1 = "Enter the first line of the address"
    if (!next.city) found.city = "Enter a town or city"
    if (!UK_POSTCODE_RE.test(next.postcode)) found.postcode = "Enter a valid UK postcode, e.g. KT13 0SL"
    if (next.phone && !/^\+?[\d\s()-]{10,20}$/.test(next.phone)) found.phone = "Enter a valid UK phone number"
    setErrors(found)
    const first = ORDER.find((key) => found[key])
    if (first) {
      document.getElementById(fieldId(first))?.focus()
      return
    }
    saveAddress(user.email, { ...next, postcode: formatPostcode(next.postcode), id: address?.id })
    toast.success(address ? "Address updated" : "Address saved")
    onDone()
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <Field label="Label" htmlFor={fieldId("label")} hint="For example Home, Work or Garage.">
        <TextInput id={fieldId("label")} name="label" defaultValue={address?.label ?? (isFirst ? "Home" : "")} placeholder="Home" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" htmlFor={fieldId("firstName")} error={errors.firstName} required>
          <TextInput
            id={fieldId("firstName")}
            name="firstName"
            autoComplete="given-name"
            defaultValue={address?.firstName ?? user.firstName}
            invalid={Boolean(errors.firstName)}
          />
        </Field>
        <Field label="Last name" htmlFor={fieldId("lastName")} error={errors.lastName} required>
          <TextInput
            id={fieldId("lastName")}
            name="lastName"
            autoComplete="family-name"
            defaultValue={address?.lastName ?? user.lastName}
            invalid={Boolean(errors.lastName)}
          />
        </Field>
      </div>
      <Field label="Address line 1" htmlFor={fieldId("line1")} error={errors.line1} required>
        <TextInput id={fieldId("line1")} name="line1" autoComplete="address-line1" defaultValue={address?.line1} invalid={Boolean(errors.line1)} />
      </Field>
      <Field label="Address line 2" htmlFor={fieldId("line2")}>
        <TextInput id={fieldId("line2")} name="line2" autoComplete="address-line2" defaultValue={address?.line2} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Town / city" htmlFor={fieldId("city")} error={errors.city} required>
          <TextInput id={fieldId("city")} name="city" autoComplete="address-level2" defaultValue={address?.city} invalid={Boolean(errors.city)} />
        </Field>
        <Field label="Postcode" htmlFor={fieldId("postcode")} error={errors.postcode} required>
          <TextInput
            id={fieldId("postcode")}
            name="postcode"
            autoComplete="postal-code"
            autoCapitalize="characters"
            defaultValue={address?.postcode}
            invalid={Boolean(errors.postcode)}
            className="uppercase"
          />
        </Field>
      </div>
      <Field label="Phone" htmlFor={fieldId("phone")} error={errors.phone} hint="Used only by the courier if needed.">
        <TextInput
          id={fieldId("phone")}
          name="phone"
          type="tel"
          autoComplete="tel"
          defaultValue={address?.phone ?? user.phone}
          invalid={Boolean(errors.phone)}
        />
      </Field>
      <CheckboxField id={fieldId("default")} name="isDefault" defaultChecked={address?.isDefault ?? isFirst} disabled={address?.isDefault || isFirst}>
        Use as my default address
      </CheckboxField>
      {address?.isDefault || isFirst ? <input type="hidden" name="isDefault" value="on" /> : null}
      <div className="flex flex-col gap-2 pt-2 sm:flex-row">
        <SubmitButton className="flex-1">{address ? "Save changes" : "Save address"}</SubmitButton>
        <DialogClose className={cn(secondaryButton, "h-[46px] flex-1")}>Cancel</DialogClose>
      </div>
    </form>
  )
}
