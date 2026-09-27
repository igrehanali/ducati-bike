"use client"

import { useRouter } from "next/navigation"
import { HeartIcon } from "lucide-react"
import { toast } from "sonner"

import { toggleWishlist, useWishlist } from "@/lib/wishlist-store"
import { cn } from "@/lib/utils"

type WishlistButtonProps = {
  slug: string
  name: string
  className?: string
  /** "icon" is the floating heart on cards; "button" is the labelled PDP control. */
  variant?: "icon" | "button"
}

export function WishlistButton({ slug, name, className, variant = "icon" }: WishlistButtonProps) {
  const saved = useWishlist().includes(slug)
  const router = useRouter()

  function handleClick(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    const added = toggleWishlist(slug)
    toast(added ? `Saved ${name} to your wishlist` : `Removed ${name} from your wishlist`, {
      action: added ? { label: "View", onClick: () => router.push("/wishlist") } : undefined,
    })
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        aria-pressed={saved}
        onClick={handleClick}
        className={cn(
          "flex h-[42px] items-center justify-center gap-2 border border-black px-4 text-sm leading-[21px] font-medium transition-colors hover:bg-black hover:text-white",
          className
        )}
      >
        <HeartIcon className={cn("size-4", saved && "fill-brand-dark text-brand-dark")} />
        {saved ? "SAVED" : "SAVE"}
      </button>
    )
  }

  return (
    <button
      type="button"
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      aria-pressed={saved}
      onClick={handleClick}
      className={cn(
        "flex size-9 items-center justify-center rounded-full bg-white/90 text-black shadow-sm backdrop-blur transition hover:scale-105",
        className
      )}
    >
      <HeartIcon className={cn("size-[18px]", saved && "fill-brand-dark text-brand-dark")} />
    </button>
  )
}
