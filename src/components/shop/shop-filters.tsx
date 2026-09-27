"use client"

import { createContext, use, useId, useOptimistic, useState, useTransition, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { CheckIcon, SlidersHorizontalIcon } from "lucide-react"

import { AccordionClosedIcon, AccordionOpenIcon } from "@/components/icons"
import { NativeSelect } from "@/components/site/form"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SORTS } from "@/lib/shop-constants"
import { cn } from "@/lib/utils"

import type { FacetOption, Facets } from "./listing"

/* ---------------- URL state ---------------- */

type FilterContextValue = {
  params: URLSearchParams
  pending: boolean
  values: (key: string) => string[]
  toggle: (key: string, value: string) => void
  set: (key: string, value: string | null) => void
  clear: () => void
}

const FilterContext = createContext<FilterContextValue | null>(null)

function useFilters() {
  const context = use(FilterContext)
  if (!context) throw new Error("useFilters must be used inside <FilterProvider>")
  return context
}

/**
 * Holds the listing's query string. The server passes the current query; changes are applied
 * optimistically and pushed to the URL inside a transition so the page re-renders on the server.
 */
export function FilterProvider({ query, children }: { query: string; children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [optimistic, setOptimistic] = useOptimistic(query)
  const [pending, startTransition] = useTransition()
  const params = new URLSearchParams(optimistic)

  const navigate = (next: URLSearchParams) => {
    next.delete("page")
    const qs = next.toString()
    startTransition(() => {
      setOptimistic(qs)
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    })
  }

  const values = (key: string) => (params.get(key) ?? "").split(",").filter(Boolean)

  const value: FilterContextValue = {
    params,
    pending,
    values,
    toggle: (key, v) => {
      const current = values(key)
      const nextValues = current.includes(v) ? current.filter((x) => x !== v) : [...current, v]
      const next = new URLSearchParams(optimistic)
      if (nextValues.length) next.set(key, nextValues.join(","))
      else next.delete(key)
      navigate(next)
    },
    set: (key, v) => {
      const next = new URLSearchParams(optimistic)
      if (v) next.set(key, v)
      else next.delete(key)
      navigate(next)
    },
    clear: () => {
      const next = new URLSearchParams()
      const q = params.get("q")
      const sort = params.get("sort")
      if (q) next.set("q", q)
      if (sort) next.set("sort", sort)
      navigate(next)
    },
  }

  return <FilterContext value={value}>{children}</FilterContext>
}

/** Dims the results while a filter navigation is in flight. */
export function ResultsRegion({ children }: { children: ReactNode }) {
  const { pending } = useFilters()
  return (
    <div aria-busy={pending} className={cn("transition-opacity duration-200", pending && "pointer-events-none opacity-50")}>
      {children}
    </div>
  )
}

/* ---------------- Controls ---------------- */

export function SortSelect({ className }: { className?: string }) {
  const { params, set } = useFilters()
  const id = useId()
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label htmlFor={id} className="shrink-0 text-sm leading-[17px] tracking-[-0.3px] text-subtle">
        Sort by
      </label>
      <NativeSelect
        id={id}
        value={params.get("sort") ?? "featured"}
        onChange={(event) => set("sort", event.target.value === "featured" ? null : event.target.value)}
        className="h-10 w-[190px] text-sm"
      >
        {SORTS.map((sort) => (
          <option key={sort.id} value={sort.id}>
            {sort.label}
          </option>
        ))}
      </NativeSelect>
    </div>
  )
}

function CheckOption({ checked, onChange, label, count, disabled }: { checked: boolean; onChange: () => void; label: string; count: number; disabled?: boolean }) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-3 py-1.5 text-sm leading-[17px] tracking-[-0.3px]", disabled && "cursor-not-allowed opacity-40")}>
      <span className="relative flex size-[18px] shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer absolute inset-0 cursor-[inherit] appearance-none border border-black/40 bg-white transition-colors checked:border-black checked:bg-black hover:border-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        />
        <CheckIcon aria-hidden="true" className="pointer-events-none relative m-auto size-3.5 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
      </span>
      <span className="flex-1">{label}</span>
      <span className="font-mono text-xs text-subtle">{count}</span>
    </label>
  )
}

function CheckList({ name, options }: { name: string; options: FacetOption[] }) {
  const { values, toggle } = useFilters()
  const selected = values(name)
  return (
    <div className="flex flex-col">
      {options.map((option) => (
        <CheckOption
          key={option.value}
          checked={selected.includes(option.value)}
          onChange={() => toggle(name, option.value)}
          label={option.label}
          count={option.count}
          disabled={option.count === 0 && !selected.includes(option.value)}
        />
      ))}
    </div>
  )
}

function SizeOptions({ options }: { options: FacetOption[] }) {
  const { values, toggle } = useFilters()
  const selected = values("size")
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option.value)
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            aria-label={`Size ${option.label} (${option.count})`}
            disabled={option.count === 0 && !active}
            onClick={() => toggle("size", option.value)}
            className={cn(
              "h-10 min-w-10 border px-2 text-xs leading-[10px] transition-colors disabled:cursor-not-allowed disabled:opacity-40",
              active ? "border-black bg-black text-white" : "border-surface bg-surface hover:border-black"
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function ColorOptions({ options }: { options: FacetOption[] }) {
  const { values, toggle } = useFilters()
  const selected = values("color")
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
      {options.map((option) => {
        const active = selected.includes(option.value)
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => toggle("color", option.value)}
            className="flex min-w-0 items-center gap-2 py-1.5 text-left text-sm leading-[17px] tracking-[-0.3px] hover:underline"
          >
            <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full border", active ? "border-black" : "border-transparent")}>
              <span className="size-[18px] rounded-full border border-black/15" style={{ background: option.hex }} />
            </span>
            <span className="truncate">{option.label}</span>
            <span className="ml-auto font-mono text-xs text-subtle">{option.count}</span>
          </button>
        )
      })}
    </div>
  )
}

function AvailabilityOptions({ facets }: { facets: Facets }) {
  const { params, set } = useFilters()
  const toggle = (key: string) => set(key, params.get(key) === "1" ? null : "1")
  const rows = [
    { key: "stock", label: "In stock", count: facets.stock },
    { key: "sale", label: "On sale", count: facets.sale },
    { key: "new", label: "New in", count: facets.isNew },
  ]
  return (
    <div className="flex flex-col">
      {rows.map((row) => (
        <CheckOption
          key={row.key}
          checked={params.get(row.key) === "1"}
          onChange={() => toggle(row.key)}
          label={row.label}
          count={row.count}
          disabled={row.count === 0 && params.get(row.key) !== "1"}
        />
      ))}
    </div>
  )
}

export function FilterPanel({ facets, showCategory, className }: { facets: Facets; showCategory: boolean; className?: string }) {
  const { values, params } = useFilters()
  type Group = { value: string; title: string; key: string; body: ReactNode }
  const candidates: (Group | false)[] = [
    showCategory && facets.category.length > 1 && { value: "category", title: "Category", key: "category", body: <CheckList name="category" options={facets.category} /> },
    facets.price.length > 0 && { value: "price", title: "Price", key: "price", body: <CheckList name="price" options={facets.price} /> },
    facets.size.length > 0 && { value: "size", title: "Size", key: "size", body: <SizeOptions options={facets.size} /> },
    facets.color.length > 0 && { value: "color", title: "Colour", key: "color", body: <ColorOptions options={facets.color} /> },
    facets.bike.length > 0 && { value: "bike", title: "Bike", key: "bike", body: <CheckList name="bike" options={facets.bike} /> },
    { value: "availability", title: "Availability", key: "", body: <AvailabilityOptions facets={facets} /> },
  ]
  const groups = candidates.filter((group): group is Group => Boolean(group))

  const selectedCount = (key: string) =>
    key ? values(key).length : ["stock", "sale", "new"].filter((k) => params.get(k) === "1").length

  return (
    <Accordion multiple defaultValue={groups.map((g) => g.value)} className={className}>
      {groups.map((group) => {
        const count = selectedCount(group.key)
        return (
          <AccordionItem key={group.value} value={group.value} className="border-b border-black/10 not-last:border-b">
            <AccordionTrigger className="items-center rounded-none py-4 font-inter text-base leading-5 font-medium tracking-[-0.3px] hover:no-underline [&>[data-slot=accordion-trigger-icon]]:hidden!">
              <span className="flex items-center gap-2">
                {group.title}
                {count ? <span className="bg-black px-1.5 py-0.5 font-mono text-[10px] leading-3 text-white">{count}</span> : null}
              </span>
              <AccordionOpenIcon className="hidden size-6 group-aria-expanded/accordion-trigger:block" />
              <AccordionClosedIcon className="size-6 group-aria-expanded/accordion-trigger:hidden" />
            </AccordionTrigger>
            <AccordionContent className="pb-5">{group.body}</AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

export function MobileFilters({ facets, showCategory, total, activeCount }: { facets: Facets; showCategory: boolean; total: number; activeCount: number }) {
  const [open, setOpen] = useState(false)
  const { params, set, clear, pending } = useFilters()
  const sort = params.get("sort") ?? "featured"
  const sortName = useId()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="flex h-10 items-center gap-2 border border-black px-4 text-sm leading-[17px] font-medium uppercase hover:bg-black hover:text-white">
        <SlidersHorizontalIcon className="size-4" aria-hidden="true" />
        Filter &amp; sort
        {activeCount ? <span className="bg-black px-1.5 py-0.5 font-mono text-[10px] leading-3 text-white">{activeCount}</span> : null}
      </SheetTrigger>
      <SheetContent side="left" className="w-[88%] max-w-[380px] gap-0 rounded-none bg-white p-0 data-[side=left]:w-[88%] data-[side=left]:sm:max-w-[380px]">
        <div className="flex items-center border-b border-black/10 px-5 py-4 pr-14">
          <SheetTitle className="text-xl leading-6 font-semibold tracking-[-0.4px]">Filter &amp; sort</SheetTitle>
          <SheetDescription className="sr-only">Refine the products shown on this page.</SheetDescription>
        </div>
        <div className="flex-1 overflow-y-auto px-5">
          <fieldset className="flex flex-col gap-1 border-b border-black/10 py-4">
            <legend className="float-left mb-2 w-full font-inter text-base leading-5 font-medium tracking-[-0.3px]">Sort by</legend>
            {SORTS.map((option) => (
              <label key={option.id} className="flex cursor-pointer items-center gap-3 py-1.5 text-sm leading-[17px]">
                <input
                  type="radio"
                  name={sortName}
                  value={option.id}
                  checked={sort === option.id}
                  onChange={() => set("sort", option.id === "featured" ? null : option.id)}
                  className="size-[18px] shrink-0 appearance-none rounded-full border border-black/40 checked:border-[6px] checked:border-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                />
                {option.label}
              </label>
            ))}
          </fieldset>
          <FilterPanel facets={facets} showCategory={showCategory} />
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-2 border-t border-black/10 p-5">
          <button
            type="button"
            onClick={clear}
            disabled={!activeCount}
            className="h-[42px] border border-black bg-white px-5 text-sm leading-[21px] font-medium uppercase hover:bg-black hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black"
          >
            Clear all
          </button>
          <SheetClose className="flex h-[42px] items-center justify-center bg-black px-5 text-sm leading-[21px] font-medium text-white uppercase hover:bg-black/85">
            {pending ? "Updating…" : `View ${total} ${total === 1 ? "result" : "results"}`}
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
