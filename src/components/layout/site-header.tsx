"use client"

import { lazy, Suspense, useCallback, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { HeartIcon, MenuIcon, SearchIcon, UserIcon } from "lucide-react"

import { Logo } from "@/components/brand/logo"
import { useCartUI } from "@/components/cart/cart-provider"
import { CartIcon, ChevronDownIcon } from "@/components/icons"
import { useSearchShortcut } from "@/components/site/use-search-shortcut"
import { useCurrentUser } from "@/lib/account-store"
import { useCartLines } from "@/lib/cart-store"
import { navigation } from "@/lib/site-content"
import { cn } from "@/lib/utils"
import { useWishlist } from "@/lib/wishlist-store"

// Search UI and the catalog index load on first use, keeping them out of the initial bundle.
// React.lazy (not next/dynamic) so these chunks aren't preloaded with the page.
const SearchDialog = lazy(() => import("@/components/site/search-dialog").then((m) => ({ default: m.SearchDialog })))
const MobileNavSheet = lazy(() => import("@/components/layout/mobile-nav-sheet").then((m) => ({ default: m.MobileNavSheet })))

type SiteHeaderProps = {
  /** "overlay" sits on top of the hero image with white text. */
  variant?: "overlay" | "solid"
}

const desktopNavText = "text-[12.5px] leading-[21px] font-semibold whitespace-nowrap uppercase min-[1400px]:text-sm"

export function SiteHeader({ variant = "solid" }: SiteHeaderProps) {
  const overlay = variant === "overlay"
  const { setOpen } = useCartUI()
  const count = useCartLines().reduce((sum, line) => sum + line.quantity, 0)
  const saved = useWishlist().length
  const user = useCurrentUser()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchRequested, setSearchRequested] = useState(false)
  const openSearch = useCallback(() => {
    setSearchRequested(true)
    setSearchOpen(true)
  }, [])
  useSearchShortcut(openSearch)

  return (
    <header className={cn("z-40 w-full", overlay ? "absolute inset-x-0 top-0 text-white" : "relative bg-white text-black")}>
      <div className="flex h-[63px] items-center justify-between gap-6 px-5 py-2 min-[1180px]:grid min-[1180px]:grid-cols-[1fr_auto_1fr] min-[1400px]:gap-8">
        <div className="flex items-center gap-3">
          <MobileNav overlay={overlay} onSearch={openSearch} />
          <Link href="/" className="relative block h-9 w-[120px] shrink-0">
            <Logo tone={overlay ? "light" : "dark"} />
          </Link>
        </div>

        <nav aria-label="Main" className="hidden items-center gap-3.5 min-[1180px]:flex min-[1400px]:gap-5">
          {navigation.map((item) =>
            item.children ? (
              <div key={item.label} className="group/menu relative">
                <Link href={item.href} aria-haspopup="true" className={cn(desktopNavText, "flex items-center gap-1.5 py-2 min-[1400px]:gap-2")}>
                  {item.label}
                  <ChevronDownIcon className="size-4 transition-transform group-focus-within/menu:rotate-180 group-hover/menu:rotate-180 min-[1400px]:size-5" />
                </Link>
                <div className="invisible absolute top-full left-1/2 z-50 -translate-x-1/2 pt-2 opacity-0 transition-[opacity,visibility] duration-150 group-focus-within/menu:visible group-focus-within/menu:opacity-100 group-hover/menu:visible group-hover/menu:opacity-100">
                  <div className="flex gap-4 bg-white p-3 text-black shadow-lg ring-1 ring-black/10">
                    <ul className="flex w-52 flex-col">
                      {item.children.map((child) => (
                        <li key={child.href + child.label}>
                          <Link href={child.href} className="block px-3 py-2 text-sm font-medium hover:bg-surface focus-visible:bg-surface">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {item.feature ? (
                      <Link href={item.feature.href} tabIndex={-1} className="group relative isolate flex h-56 w-44 items-end overflow-hidden p-3 text-white">
                        <Image
                          src={item.feature.image}
                          alt=""
                          fill
                          sizes="176px"
                          className="-z-10 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 to-transparent" />
                        <span className="text-sm leading-[17px] font-semibold">{item.feature.label}</span>
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.label} href={item.href} className={cn(desktopNavText, "hover:opacity-70")}>
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-[13px]">
          <button type="button" aria-label="Search (Ctrl+K)" onClick={openSearch} className="flex size-6 items-center justify-center">
            <SearchIcon className="size-[21px]" strokeWidth={1.75} />
          </button>
          <Link href="/wishlist" aria-label={`Wishlist, ${saved} saved`} className="relative hidden size-6 items-center justify-center sm:flex">
            <HeartIcon className="size-[21px]" strokeWidth={1.75} />
            {saved > 0 ? <Badge>{saved}</Badge> : null}
          </Link>
          <Link
            href={user ? "/account" : "/account/login"}
            aria-label={user ? `My account (${user.firstName})` : "Sign in"}
            className="hidden items-center gap-1.5 font-anek text-[15px] leading-[17px] tracking-[0.1px] whitespace-nowrap hover:opacity-70 sm:flex"
          >
            <UserIcon
              className={cn("size-[21px]", user ? "min-[1400px]:size-[18px]" : "hidden min-[1180px]:block min-[1400px]:hidden")}
              strokeWidth={1.75}
            />
            <span aria-hidden="true" className="min-[1180px]:max-[1399px]:hidden">
              {user ? user.firstName : "Sign in"}
            </span>
          </Link>
          <button
            type="button"
            aria-label={`Open cart, ${count} items`}
            onClick={() => setOpen(true)}
            className="relative size-6 cursor-pointer"
          >
            <CartIcon className="size-6" />
            {count > 0 ? <Badge>{count}</Badge> : null}
          </button>
        </div>
      </div>
      {searchRequested ? (
        <Suspense fallback={null}>
          <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
        </Suspense>
      ) : null}
    </header>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -top-1 left-[11px] flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-dark px-1 font-anek text-[10px] leading-3 text-white">
      {children}
    </span>
  )
}

function MobileNav({ overlay, onSearch }: { overlay: boolean; onSearch: () => void }) {
  const [open, setOpen] = useState(false)
  const [requested, setRequested] = useState(false)
  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => {
          setRequested(true)
          setOpen(true)
        }}
        className={cn("min-[1180px]:hidden", overlay ? "text-white" : "text-black")}
      >
        <MenuIcon className="size-6" />
      </button>
      {requested ? (
        <Suspense fallback={null}>
          <MobileNavSheet open={open} onOpenChange={setOpen} onSearch={onSearch} />
        </Suspense>
      ) : null}
    </>
  )
}
