"use client"

import Link from "next/link"
import { SearchIcon } from "lucide-react"

import { Logo } from "@/components/brand/logo"
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useCurrentUser } from "@/lib/account-store"
import { navigation } from "@/lib/site-content"
import { cn } from "@/lib/utils"

const navText = "text-sm leading-[21px] font-semibold uppercase"

/** Slide-out mobile menu. Loaded on the first tap of the menu button. */
export function MobileNavSheet({
  open,
  onOpenChange,
  onSearch,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSearch: () => void
}) {
  const user = useCurrentUser()
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[85%] overflow-y-auto bg-white p-6 text-black">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="relative h-9 w-[120px]">
          <Logo />
        </div>
        <SheetClose
          render={<button type="button" />}
          onClick={onSearch}
          className="mt-4 flex h-11 items-center gap-2 border border-black/20 px-3 text-sm text-subtle"
        >
          <SearchIcon className="size-4" /> Search the store
        </SheetClose>
        <nav aria-label="Mobile" className="mt-6 flex flex-col gap-5">
          {navigation.map((item) => (
            <div key={item.label} className="flex flex-col gap-2">
              <SheetClose render={<Link href={item.href} />} className={cn(navText, "text-left")}>
                {item.label}
              </SheetClose>
              {item.children ? (
                <div className="flex flex-col gap-1.5 pl-3">
                  {item.children.map((child) => (
                    <SheetClose key={child.href + child.label} render={<Link href={child.href} />} className="text-left text-sm text-subtle">
                      {child.label}
                    </SheetClose>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          <hr className="border-black/10" />
          <SheetClose render={<Link href="/bikes" />} className={cn(navText, "text-left")}>
            Shop by bike
          </SheetClose>
          <SheetClose render={<Link href="/wishlist" />} className="text-left font-anek text-[15px]">
            Wishlist
          </SheetClose>
          <SheetClose render={<Link href={user ? "/account" : "/account/login"} />} className="text-left font-anek text-[15px]">
            {user ? `My account (${user.firstName})` : "Sign in"}
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
