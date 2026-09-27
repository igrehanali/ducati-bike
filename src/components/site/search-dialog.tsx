"use client"

import { useDeferredValue, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRightIcon, SearchIcon, XIcon } from "lucide-react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { formatPrice } from "@/lib/format"
import { popularSearches, searchCatalog } from "@/lib/search"
import { cn } from "@/lib/utils"

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState("")
  const deferred = useDeferredValue(query)
  const hits = searchCatalog(deferred, 8)
  const products = hits.filter((h) => h.kind === "product")
  const links = hits.filter((h) => h.kind === "link")
  const router = useRouter()

  function close() {
    onOpenChange(false)
  }

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!query.trim()) return
    close()
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) setQuery("")
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="top-0 max-h-[90vh] w-full max-w-none translate-y-0 gap-0 overflow-y-auto rounded-none p-0 ring-0 sm:max-w-none data-open:slide-in-from-top-4"
      >
        <DialogTitle className="sr-only">Search the store</DialogTitle>
        <form onSubmit={submit} className="flex items-center gap-3 border-b border-black/10 px-5 py-4">
          <SearchIcon className="size-5 shrink-0" />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search helmets, jackets, Fulmine parts…"
            aria-label="Search"
            className="h-10 flex-1 bg-transparent text-lg outline-none placeholder:text-subtle"
          />
          <button type="button" onClick={close} aria-label="Close search" className="p-1">
            <XIcon className="size-5" />
          </button>
        </form>

        <div className="px-5 py-6">
          {!deferred.trim() ? (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold tracking-wide text-subtle uppercase">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="border border-black/20 px-3 py-1.5 text-sm hover:border-black"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : hits.length === 0 ? (
            <p className="text-sm text-subtle">No results for “{deferred}”. Try a different term or browse the <Link href="/shop" onClick={close} className="underline">full shop</Link>.</p>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
              {links.length ? (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold tracking-wide text-subtle uppercase">Suggestions</p>
                  <ul className="flex flex-col">
                    {links.map((hit) =>
                      hit.kind === "link" ? (
                        <li key={hit.href}>
                          <Link href={hit.href} onClick={close} className="flex flex-col py-2 hover:underline">
                            <span className="text-sm font-semibold">{hit.label}</span>
                            <span className="text-xs text-subtle">{hit.description}</span>
                          </Link>
                        </li>
                      ) : null
                    )}
                  </ul>
                </div>
              ) : null}
              <div className={cn("flex flex-col gap-3", !links.length && "lg:col-span-2")}>
                <p className="text-xs font-semibold tracking-wide text-subtle uppercase">Products</p>
                <ul className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-4">
                  {products.map((hit) =>
                    hit.kind === "product" ? (
                      <li key={hit.product.slug}>
                        <Link href={`/products/${hit.product.slug}`} onClick={close} className="group flex flex-col gap-2">
                          <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                            <Image
                              src={hit.product.image}
                              alt={hit.product.name}
                              fill
                              sizes="200px"
                              className={cn(hit.product.image.endsWith(".png") ? "object-contain" : "object-cover", "transition-transform group-hover:scale-105")}
                            />
                          </div>
                          <span className="line-clamp-2 font-inter text-sm leading-[17px] font-medium">{hit.product.name}</span>
                          <span className="font-mono text-sm">{formatPrice(hit.product.price)}</span>
                        </Link>
                      </li>
                    ) : null
                  )}
                </ul>
                <Link href={`/shop?q=${encodeURIComponent(deferred.trim())}`} onClick={close} className="mt-2 flex w-fit items-center gap-2 border-b border-black pb-1 text-sm font-medium">
                  See all results for “{deferred.trim()}” <ArrowRightIcon className="size-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
