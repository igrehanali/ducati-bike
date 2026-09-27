"use client"

import { lazy, Suspense, useState, type ReactNode } from "react"
import { SearchIcon } from "lucide-react"

const SearchDialog = lazy(() => import("@/components/site/search-dialog").then((m) => ({ default: m.SearchDialog })))
import { cn } from "@/lib/utils"

/** Opens the site search dialog (used on the 404 page). */
export function SearchButton({ className, children = "Search the store" }: { className?: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [requested, setRequested] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setRequested(true)
          setOpen(true)
        }}
        className={cn(
          "flex h-[46px] w-full max-w-[420px] items-center gap-3 border border-black/25 bg-white px-4 text-left text-sm text-subtle transition-colors hover:border-black",
          className
        )}
      >
        <SearchIcon className="size-4 text-black" aria-hidden="true" />
        <span className="flex-1">{children}</span>
        <kbd className="hidden font-mono text-xs text-inactive sm:inline">Ctrl K</kbd>
      </button>
      {requested ? (
        <Suspense fallback={null}>
          <SearchDialog open={open} onOpenChange={setOpen} />
        </Suspense>
      ) : null}
    </>
  )
}
