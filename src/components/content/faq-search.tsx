"use client"

import { useDeferredValue, useState } from "react"
import Link from "next/link"
import { SearchIcon, XIcon } from "lucide-react"

import { faqGroups, type FaqEntry } from "@/components/content/faq-data"
import { FaqList } from "@/components/content/faq-list"
import { inputClass } from "@/components/site/form"
import { cn } from "@/lib/utils"

function answer(entry: FaqEntry) {
  return (
    <>
      <p>{entry.a}</p>
      {entry.link ? (
        <p className="pt-2">
          <Link href={entry.link.href} className="font-semibold text-black">
            {entry.link.label}
          </Link>
        </p>
      ) : null}
    </>
  )
}

export function FaqSearch() {
  const [query, setQuery] = useState("")
  const deferred = useDeferredValue(query.trim().toLowerCase())
  const terms = deferred.split(/\s+/).filter(Boolean)

  const groups = faqGroups
    .map((group) => ({
      ...group,
      items: terms.length
        ? group.items.filter((item) => {
            const text = `${item.q} ${item.a} ${group.title}`.toLowerCase()
            return terms.every((term) => text.includes(term))
          })
        : group.items,
    }))
    .filter((group) => group.items.length > 0)
  const count = groups.reduce((sum, group) => sum + group.items.length, 0)

  return (
    <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[260px_1fr] lg:gap-16">
      <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
        <div className="relative">
          <label htmlFor="faq-search" className="sr-only">
            Search frequently asked questions
          </label>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" aria-hidden="true" />
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search questions"
            autoComplete="off"
            className={cn(inputClass, "pr-10 pl-10 [&::-webkit-search-cancel-button]:hidden")}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center hover:bg-surface"
            >
              <XIcon className="size-4" />
            </button>
          ) : null}
        </div>
        <p aria-live="polite" className="text-xs leading-4 text-subtle">
          {terms.length ? `${count} ${count === 1 ? "answer" : "answers"} for “${query.trim()}”` : `${count} answers in ${faqGroups.length} topics`}
        </p>
        <nav aria-label="FAQ topics" className="hidden lg:block">
          <ul className="flex flex-col border-l border-black/15">
            {faqGroups.map((group) => {
              const active = groups.some((g) => g.id === group.id)
              return (
                <li key={group.id}>
                  <a
                    href={`#${group.id}`}
                    aria-disabled={!active || undefined}
                    className={cn(
                      "-ml-px block border-l border-transparent py-2 pl-4 text-sm leading-[17px] tracking-[-0.3px] hover:border-black",
                      active ? "text-black" : "pointer-events-none text-inactive"
                    )}
                  >
                    {group.title}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col gap-14">
        {groups.length === 0 ? (
          <div className="flex flex-col items-start gap-3 bg-surface p-8">
            <h2 className="text-xl leading-6 font-semibold tracking-[-0.4px]">No answers found</h2>
            <p className="text-sm leading-5 text-subtle">Try a different word, or ask our team directly — we reply within one working day.</p>
            <Link href="/contact" className="mt-2 flex h-[42px] items-center bg-black px-8 text-sm leading-[21px] font-medium text-white uppercase hover:bg-black/85">
              Contact us
            </Link>
          </div>
        ) : (
          groups.map((group) => (
            <section key={group.id} id={group.id} aria-labelledby={`${group.id}-heading`} className="scroll-mt-6">
              <h2 id={`${group.id}-heading`} className="mb-2 text-[22px] leading-7 font-semibold tracking-[-0.5px]">
                {group.title}
              </h2>
              <FaqList
                key={terms.join(" ")}
                defaultOpen={terms.length ? group.items.map((item) => item.id) : []}
                items={group.items.map((item) => ({ id: item.id, q: item.q, a: answer(item) }))}
              />
            </section>
          ))
        )}
      </div>
    </div>
  )
}
