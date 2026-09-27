"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { HeartIcon, Share2Icon, ShoppingBagIcon, Trash2Icon, XIcon } from "lucide-react"
import { toast } from "sonner"

import { primaryButton, secondaryButton, useHydrated } from "@/components/account/utils"
import { useCartUI } from "@/components/cart/cart-provider"
import { Price } from "@/components/price"
import { imageFit } from "@/components/product/product-card"
import { WishlistButton } from "@/components/product/wishlist-button"
import { ProductRowSection } from "@/components/product-sections"
import { NativeSelect } from "@/components/site/form"
import { PageHeader } from "@/components/site/page-header"
import { addToCart } from "@/lib/cart-store"
import { catalog, productsBySlugs, type Product } from "@/lib/catalog"
import { cn } from "@/lib/utils"
import { clearWishlist, removeFromWishlist, toggleWishlist, useRecentlyViewed, useWishlist } from "@/lib/wishlist-store"

const crumbs = [{ label: "Wishlist" }]
const bestsellers = catalog.filter((p) => p.badge === "Bestseller" && p.stock > 0).slice(0, 8)

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`
}

/** Cart options that mirror the product page: chosen size and the first colour. */
function cartOptions(product: Product, size?: string) {
  const color = product.colors[0]
  return { size: size ?? product.sizes[0], color: color?.name, image: color?.image ?? product.image }
}

export function WishlistView() {
  const params = useSearchParams()
  const shared = params.get("items")
  return shared !== null ? <SharedWishlist slugs={shared} /> : <MyWishlist />
}

function MyWishlist() {
  const hydrated = useHydrated()
  const slugs = useWishlist()
  const products = productsBySlugs(slugs)
  const { setOpen } = useCartUI()

  if (!hydrated) return <WishlistSkeleton />

  function addAll() {
    const available = products.filter((p) => p.stock > 0)
    if (!available.length) {
      toast.error("Nothing in your wishlist is in stock right now")
      return
    }
    available.forEach((product) => addToCart(product, cartOptions(product)))
    const skipped = products.length - available.length
    toast.success(`Added ${plural(available.length, "item")} to your bag`, {
      description: skipped ? `${plural(skipped, "item")} out of stock and left in your wishlist.` : undefined,
    })
    setOpen(true)
  }

  async function share() {
    const url = `${window.location.origin}/wishlist?items=${slugs.map(encodeURIComponent).join(",")}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Wishlist link copied", { description: "Share it with anyone — no account needed to view it." })
    } catch {
      toast("Copy this link to share your wishlist", { description: url, duration: 10000 })
    }
  }

  function clearAll() {
    const previous = [...slugs]
    clearWishlist()
    toast("Wishlist cleared", {
      action: {
        label: "Undo",
        // toggleWishlist prepends, so restore from the end to keep the original order.
        onClick: () => [...previous].reverse().forEach((slug) => toggleWishlist(slug)),
      },
    })
  }

  return (
    <>
      <PageHeader
        title="Wishlist"
        crumbs={crumbs}
        description={products.length ? `${plural(products.length, "saved item")}. Items stay here until you remove them.` : "Save the pieces you love and come back to them any time."}
      />

      {products.length ? (
        <>
          <div className="mx-5 flex flex-wrap gap-2 border-y border-rule py-4">
            <button type="button" onClick={addAll} className={cn(primaryButton, "whitespace-nowrap px-5 max-sm:flex-1 max-sm:px-3")}>
              <ShoppingBagIcon className="size-4" aria-hidden="true" />
              Add all to bag
            </button>
            <button type="button" onClick={share} className={cn(secondaryButton, "whitespace-nowrap px-5 max-sm:flex-1 max-sm:px-3")}>
              <Share2Icon className="size-4" aria-hidden="true" />
              Share wishlist
            </button>
            <button type="button" onClick={clearAll} className="inline-flex h-[42px] items-center gap-2 px-3 text-sm font-medium uppercase underline-offset-4 hover:underline sm:ml-auto">
              <Trash2Icon className="size-4" aria-hidden="true" />
              Clear all
            </button>
          </div>
          <ul className="grid grid-cols-2 gap-x-2 gap-y-10 px-5 pt-8 lg:grid-cols-4">
            {products.map((product) => (
              <li key={product.slug}>
                <WishlistCard product={product} mode="remove" />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <div className="mx-5 flex flex-col items-center gap-4 border border-rule px-5 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-surface">
              <HeartIcon className="size-6" aria-hidden="true" />
            </span>
            <h2 className="font-inter text-2xl leading-[30px] font-medium tracking-[-0.6px]">Your wishlist is empty</h2>
            <p className="max-w-[420px] text-base leading-6 text-subtle">Tap the heart on any product to save it here for later.</p>
            <Link href="/shop" className={cn(primaryButton, "mt-2")}>
              Start shopping
            </Link>
          </div>
          <ProductRowSection title="Bestsellers" products={bestsellers} />
        </>
      )}

      <RecentlyViewedRow />
    </>
  )
}

function RecentlyViewedRow() {
  const products = productsBySlugs(useRecentlyViewed())
  if (!products.length) return null
  return <ProductRowSection title="Recently viewed" products={products} />
}

function SharedWishlist({ slugs: raw }: { slugs: string }) {
  const hydrated = useHydrated()
  const router = useRouter()
  const mine = useWishlist()
  const slugs = Array.from(new Set(raw.split(",").map((s) => s.trim()).filter(Boolean)))
  const products = productsBySlugs(slugs)
  const missing = products.filter((p) => !mine.includes(p.slug))

  function saveAll() {
    if (!missing.length) {
      toast("Everything here is already in your wishlist")
      return
    }
    // toggleWishlist prepends, so add from the end to keep the shared order.
    ;[...missing].reverse().forEach((product) => toggleWishlist(product.slug))
    toast.success(`Saved ${plural(missing.length, "item")} to your wishlist`, {
      action: { label: "View", onClick: () => router.push("/wishlist") },
    })
  }

  return (
    <>
      <PageHeader
        title="Shared wishlist"
        eyebrow="Picked out for you"
        crumbs={[{ label: "Wishlist", href: "/wishlist" }, { label: "Shared" }]}
        description={
          products.length
            ? `${plural(products.length, "piece")} someone thinks you'll love. Save them to your own wishlist or add them straight to your bag.`
            : "This shared list is empty or its products are no longer available."
        }
      />
      {products.length ? (
        <>
          <div className="mx-5 flex flex-wrap gap-2 border-y border-rule py-4">
            <button type="button" onClick={saveAll} disabled={hydrated && !missing.length} className={cn(primaryButton, "whitespace-nowrap px-5 max-sm:flex-1 max-sm:px-3")}>
              <HeartIcon className="size-4" aria-hidden="true" />
              {hydrated && !missing.length ? "All saved" : "Save all to my wishlist"}
            </button>
            <Link href="/wishlist" className={cn(secondaryButton, "whitespace-nowrap px-5 max-sm:flex-1 max-sm:px-3")}>
              My wishlist
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-x-2 gap-y-10 px-5 pt-8 lg:grid-cols-4">
            {products.map((product) => (
              <li key={product.slug}>
                <WishlistCard product={product} mode="save" />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="px-5">
          <Link href="/shop" className={primaryButton}>
            Shop the collection
          </Link>
        </div>
      )}
    </>
  )
}

function WishlistCard({ product, mode }: { product: Product; mode: "remove" | "save" }) {
  const { setOpen } = useCartUI()
  const [size, setSize] = useState("")
  const [error, setError] = useState("")
  const multi = product.sizes.length > 1
  const soldOut = product.stock === 0
  const lowStock = product.stock > 0 && product.stock <= 5
  const href = `/products/${product.slug}`
  const selectId = `wishlist-size-${product.slug}`

  function add() {
    if (multi && !size) {
      setError("Choose a size")
      document.getElementById(selectId)?.focus()
      return
    }
    addToCart(product, cartOptions(product, multi ? size : undefined))
    setOpen(true)
  }

  function remove() {
    removeFromWishlist(product.slug)
    toast(`Removed ${product.name} from your wishlist`, {
      action: { label: "Undo", onClick: () => toggleWishlist(product.slug) },
    })
  }

  return (
    <article className="group flex h-full flex-col gap-5" aria-labelledby={`wishlist-${product.slug}`}>
      <div className="relative aspect-[344/467] overflow-hidden bg-surface">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0">
          <Image
            src={product.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className={cn(imageFit(product.image), "transition duration-500 group-hover:scale-[1.03]", soldOut && "opacity-60")}
          />
        </Link>
        <div className="absolute top-4 left-4 flex flex-wrap gap-1 pr-12">
          {product.badge ? (
            <span className="bg-chip px-2 py-1 font-inter text-xs leading-[14px] font-bold tracking-[-0.2px]">{product.badge}</span>
          ) : null}
          {soldOut ? (
            <span className="bg-black px-2 py-1 font-inter text-xs leading-[14px] font-bold tracking-[-0.2px] text-white">Sold out</span>
          ) : null}
        </div>
        {mode === "remove" ? (
          <button
            type="button"
            onClick={remove}
            aria-label={`Remove ${product.name} from wishlist`}
            className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-black shadow-sm backdrop-blur transition hover:scale-105"
          >
            <XIcon className="size-[18px]" />
          </button>
        ) : (
          <WishlistButton slug={product.slug} name={product.name} className="absolute top-3 right-3" />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 id={`wishlist-${product.slug}`} className="truncate font-inter text-base leading-[19px] font-medium tracking-[-0.3px]">
          <Link href={href} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <Price value={product.price} compareAt={product.compareAt} className="text-base leading-[19px]" />
        <p className="flex items-center gap-2 font-inter text-xs leading-[18px] font-semibold">
          <span aria-hidden="true" className={cn("size-2 rounded-full", soldOut ? "bg-brand-dark" : lowStock ? "bg-[#ff9800]" : "bg-[#59fe00]")} />
          {soldOut ? "OUT OF STOCK" : lowStock ? `ONLY ${product.stock} LEFT` : "IN STOCK"}
        </p>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        {soldOut ? (
          <button
            type="button"
            onClick={() => toast("We'll email you when it's back in stock.")}
            className="h-[42px] bg-black/50 px-3 text-sm leading-[21px] font-medium text-white uppercase hover:bg-black/60"
          >
            Notify me
          </button>
        ) : (
          <>
            {multi ? (
              <div className="flex flex-col gap-1">
                <label htmlFor={selectId} className="sr-only">
                  Size for {product.name}
                </label>
                <NativeSelect
                  id={selectId}
                  value={size}
                  invalid={Boolean(error)}
                  onChange={(event) => {
                    setSize(event.target.value)
                    setError("")
                  }}
                  className="h-[42px] text-[13px]"
                >
                  <option value="">Select size</option>
                  {product.sizes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </NativeSelect>
                {error ? (
                  <p id={`${selectId}-error`} role="alert" className="text-xs leading-4 text-brand-dark">
                    {error}
                  </p>
                ) : null}
              </div>
            ) : null}
            <button type="button" onClick={add} className={cn(primaryButton, "px-3")}>
              Add to bag
            </button>
          </>
        )}
      </div>
    </article>
  )
}

export function WishlistSkeleton() {
  return (
    <>
      <PageHeader title="Wishlist" crumbs={crumbs} description="Loading your saved items…" />
      <ul className="grid grid-cols-2 gap-x-2 gap-y-10 px-5 pt-8 lg:grid-cols-4" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="flex flex-col gap-5">
            <span className="aspect-[344/467] bg-surface" />
            <span className="h-4 w-3/4 bg-surface" />
            <span className="h-[42px] bg-surface" />
          </li>
        ))}
      </ul>
    </>
  )
}
