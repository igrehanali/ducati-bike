"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { HeartIcon, LayoutGridIcon, LogOutIcon, MapPinIcon, PackageIcon, UserIcon } from "lucide-react"
import { toast } from "sonner"

import { AccountAddresses } from "@/components/account/account-addresses"
import { AccountDetails } from "@/components/account/account-details"
import { AccountOverview, AccountRecommendations } from "@/components/account/account-overview"
import { AccountOrders } from "@/components/account/account-orders"
import { formatDate, primaryButton, secondaryButton, useHydrated } from "@/components/account/utils"
import { Breadcrumbs } from "@/components/site/page-header"
import { logout, useCurrentUser } from "@/lib/account-store"
import { cn } from "@/lib/utils"

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutGridIcon },
  { id: "orders", label: "Orders", icon: PackageIcon },
  { id: "addresses", label: "Addresses", icon: MapPinIcon },
  { id: "details", label: "Details", icon: UserIcon },
] as const

type TabId = (typeof TABS)[number]["id"]

function parseTab(value: string | null): TabId {
  return TABS.some((tab) => tab.id === value) ? (value as TabId) : "overview"
}

export function AccountDashboard() {
  const params = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const user = useCurrentUser()
  const hydrated = useHydrated()
  const tab = parseTab(params.get("tab"))
  const signingOut = useRef(false)
  const here = tab === "overview" ? pathname : `${pathname}?tab=${tab}`
  const loginHref = `/account/login?next=${encodeURIComponent(here)}`

  // Guard: once the stores are hydrated and nobody is signed in, go to the sign-in page.
  useEffect(() => {
    if (hydrated && !user && !signingOut.current) router.replace(loginHref)
  }, [hydrated, user, loginHref, router])

  if (!hydrated) return <AccountSkeleton />

  if (!user) {
    return (
      <div className="flex flex-col items-start gap-4 px-5 pt-16 pb-4">
        <h1 className="text-[32px] leading-[38px] font-semibold tracking-[-0.6px]">Please sign in</h1>
        <p className="text-base leading-6 text-subtle">Sign in to see your orders, addresses and saved details.</p>
        <Link href={loginHref} className={primaryButton}>
          Sign in
        </Link>
      </div>
    )
  }

  function signOut() {
    signingOut.current = true
    logout()
    toast("You've been signed out")
    router.push("/")
  }

  const panel = {
    overview: <AccountOverview user={user} />,
    orders: <AccountOrders user={user} />,
    addresses: <AccountAddresses user={user} />,
    details: <AccountDetails user={user} />,
  }[tab]

  return (
    <>
      <div className="px-5 pt-6">
        <Breadcrumbs items={tab === "overview" ? [{ label: "My account" }] : [{ label: "My account", href: "/account" }, { label: TABS.find((t) => t.id === tab)!.label }]} />
        <header className="flex flex-col gap-6 border-b border-rule pt-10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase">My account</p>
            <h1 className="text-[32px] leading-[38px] font-semibold tracking-[-0.6px] break-words md:text-[42px] md:leading-[50px]">Hi {user.firstName}</h1>
            <p className="text-sm leading-5 text-subtle">
              Member since{" "}
              <time dateTime={user.createdAt} className="font-mono text-black">
                {formatDate(user.createdAt, { month: "long", year: "numeric" })}
              </time>
              <span aria-hidden="true"> · </span>
              <span className="break-all">{user.email}</span>
            </p>
          </div>
          <button type="button" onClick={signOut} className={cn(secondaryButton, "w-full shrink-0 sm:w-auto")}>
            <LogOutIcon className="size-4" aria-hidden="true" />
            Sign out
          </button>
        </header>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 pt-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="Account sections" className="-mx-5 min-w-0 lg:mx-0">
            <ul className="flex gap-6 overflow-x-auto border-b border-rule px-5 [scrollbar-width:none] lg:sticky lg:top-6 lg:flex-col lg:gap-1 lg:border-b-0 lg:px-0">
              {TABS.map(({ id, label, icon: Icon }) => {
                const active = id === tab
                return (
                  <li key={id} className="shrink-0">
                    <Link
                      href={id === "overview" ? pathname : `${pathname}?tab=${id}`}
                      scroll={false}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 border-b-2 pb-3 text-sm leading-[21px] font-semibold whitespace-nowrap uppercase transition-colors lg:border-b-0 lg:border-l-2 lg:py-2.5 lg:pl-4",
                        active ? "border-black text-black" : "border-transparent text-inactive hover:text-black"
                      )}
                    >
                      <Icon className="hidden size-4 lg:block" aria-hidden="true" />
                      {label}
                    </Link>
                  </li>
                )
              })}
              <li className="shrink-0">
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 border-b-2 border-transparent pb-3 text-sm leading-[21px] font-semibold whitespace-nowrap text-inactive uppercase transition-colors hover:text-black lg:border-b-0 lg:border-l-2 lg:py-2.5 lg:pl-4"
                >
                  <HeartIcon className="hidden size-4 lg:block" aria-hidden="true" />
                  Wishlist
                </Link>
              </li>
            </ul>
          </nav>
          <div className="min-w-0">{panel}</div>
        </div>
      </div>
      {tab === "overview" ? <AccountRecommendations user={user} /> : null}
    </>
  )
}

export function AccountSkeleton() {
  return (
    <div className="px-5 pt-6" aria-busy="true">
      <h1 className="sr-only">My account — loading</h1>
      <span className="block h-3.5 w-32 bg-surface" />
      <div className="flex flex-col gap-3 border-b border-rule pt-10 pb-8">
        <span className="h-3.5 w-24 bg-surface" />
        <span className="h-10 w-56 bg-surface" />
        <span className="h-4 w-72 max-w-full bg-surface" />
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 pt-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <div className="flex gap-6 lg:flex-col lg:gap-3">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="h-5 w-20 bg-surface lg:w-32" />
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-32 bg-surface" />
          ))}
        </div>
      </div>
    </div>
  )
}
