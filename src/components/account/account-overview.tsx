"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import { toast } from "sonner"

import { OrderStatusBadge, OrderThumbnails, useUserOrders } from "@/components/account/account-orders"
import { formatDate, primaryButton, textLink } from "@/components/account/utils"
import { ProductRowSection } from "@/components/product-sections"
import { Field, NativeSelect } from "@/components/site/form"
import { updateUser, type User } from "@/lib/account-store"
import { getBike } from "@/lib/bikes"
import { catalog, productsForBike } from "@/lib/catalog"
import { formatPrice } from "@/lib/format"
import { bikeModels } from "@/lib/experiences"
import { useWishlist } from "@/lib/wishlist-store"

/** Maps a saved bike model ("Fulmine") to one of the six range pages, if it has one. */
function bikeFor(model?: string) {
  return model ? getBike(model.toLowerCase()) : undefined
}

export function AccountOverview({ user }: { user: User }) {
  const orders = useUserOrders(user.email)
  const wishlist = useWishlist()
  const latest = orders[0]
  const bike = bikeFor(user.bike)

  const stats = [
    { label: "Orders", value: orders.length, href: "/account?tab=orders", cta: "View orders" },
    { label: "Wishlist items", value: wishlist.length, href: "/wishlist", cta: "View wishlist" },
    { label: "Saved addresses", value: user.addresses.length, href: "/account?tab=addresses", cta: "Manage addresses" },
  ]

  function chooseBike(value: string) {
    updateUser(user.email, { bike: value || undefined })
    toast.success(value ? `Saved your ${value}` : "Bike removed from your profile")
  }

  return (
    <div className="flex flex-col gap-10">
      <ul className="grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <li key={stat.label}>
            <Link href={stat.href} scroll={false} className="group flex h-full flex-col gap-2 bg-surface p-3 transition-colors hover:bg-chip sm:gap-4 sm:p-5">
              <span className="text-xs leading-4 font-semibold tracking-[-0.2px] text-subtle sm:text-sm sm:leading-[17px]">{stat.label}</span>
              <span className="font-mono text-[28px] leading-8 max-sm:mt-auto tracking-[-1px] sm:text-[40px] sm:leading-[44px]">{stat.value}</span>
              <span className="mt-auto hidden text-sm leading-[17px] font-medium underline underline-offset-4 group-hover:opacity-70 sm:block">{stat.cta}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="grid gap-8 xl:grid-cols-2">
        <section aria-labelledby="latest-order" className="flex flex-col gap-4">
          <h2 id="latest-order" className="font-inter text-lg leading-[22px] font-medium tracking-[-0.4px]">
            Latest order
          </h2>
          {latest ? (
            <div className="flex flex-1 flex-col gap-5 border border-rule p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <p className="font-mono text-sm leading-5 font-semibold">{latest.number}</p>
                  <p className="text-[13px] leading-[18px] text-subtle">
                    Placed <time dateTime={latest.createdAt}>{formatDate(latest.createdAt)}</time>
                  </p>
                </div>
                <OrderStatusBadge order={latest} />
              </div>
              <OrderThumbnails lines={latest.lines} />
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4">
                <p className="text-sm">
                  Total <span className="font-mono font-semibold">{formatPrice(latest.total)}</span>
                </p>
                <Link href="/account?tab=orders" scroll={false} className={`${textLink} text-sm`}>
                  View all orders
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-start gap-3 border border-rule p-5">
              <p className="text-base leading-6 font-semibold">No orders yet</p>
              <p className="text-sm leading-5 text-subtle">When you place an order it will appear here with live tracking.</p>
              <Link href="/shop" className={`${primaryButton} mt-2`}>
                Start shopping
              </Link>
            </div>
          )}
        </section>

        <section aria-labelledby="your-bike" className="flex flex-col gap-4">
          <h2 id="your-bike" className="font-inter text-lg leading-[22px] font-medium tracking-[-0.4px]">
            Your bike
          </h2>
          <div className="flex flex-1 flex-col gap-5 border border-rule p-5">
            {bike ? (
              <div className="relative isolate flex aspect-[16/7] flex-col justify-end overflow-hidden p-4 text-white">
                <Image src={bike.card} alt={`Vellora ${bike.name}`} fill sizes="(min-width: 1280px) 30vw, (min-width: 1024px) 60vw, 100vw" style={{ objectPosition: bike.cardPosition }} className="-z-10 object-cover" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <p className="font-mono text-xs leading-[14px] text-white/80 uppercase">{bike.family}</p>
                <p className="font-inter text-2xl leading-[30px] font-medium tracking-[-0.6px]">{bike.name}</p>
              </div>
            ) : (
              <p className="text-sm leading-5 text-subtle">Tell us what you ride and we&apos;ll tailor gear, parts and event suggestions to it.</p>
            )}
            <Field label="Model" htmlFor="account-bike">
              <NativeSelect id="account-bike" value={user.bike ?? ""} onChange={(event) => chooseBike(event.target.value)}>
                <option value="">Select your Vellora</option>
                {bikeModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            {bike ? (
              <Link href={`/bikes/${bike.slug}`} className="flex items-center gap-1 text-sm leading-[17px] font-medium underline underline-offset-4 hover:opacity-70">
                Explore the {bike.name} range
                <ArrowUpRightIcon className="size-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
}

export function AccountRecommendations({ user }: { user: User }) {
  const bike = bikeFor(user.bike)
  const products = bike
    ? productsForBike(bike.slug).filter((p) => p.stock > 0).slice(0, 8)
    : catalog.filter((p) => p.badge === "Bestseller").slice(0, 8)
  if (!products.length) return null
  return <ProductRowSection title={bike ? `Recommended for your ${bike.name}` : "Bestsellers for you"} products={products} />
}
