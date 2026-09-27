"use client"

import Image from "next/image"

import { useCartUI } from "@/components/cart/cart-provider"
import { PlusSmallIcon } from "@/components/icons"
import { Price } from "@/components/price"
import { addToCart } from "@/lib/cart-store"
import type { CardProduct } from "@/lib/catalog"

export function PairWith({ items }: { items: CardProduct[] }) {
  const { setOpen } = useCartUI()

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-inter text-lg leading-[22px] font-medium tracking-[-0.4px]">Pair with</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.slug} className="flex min-w-0 flex-col gap-6">
            <div className="relative aspect-[208/224] bg-surface">
              <Image src={item.image} alt={item.name} fill sizes="(min-width: 1024px) 15vw, 45vw" className="object-contain" />
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="truncate font-inter text-sm leading-[17px] font-medium tracking-[-0.3px]">{item.name}</h3>
              <div className="flex items-center justify-between gap-2">
                <Price value={item.price} emphasis className="text-base leading-5" />
                <button
                  type="button"
                  onClick={() => {
                    addToCart(item)
                    setOpen(true)
                  }}
                  className="flex h-7 items-center gap-0.5 bg-black px-2 py-1 text-xs leading-[10px] font-bold text-white hover:bg-black/80"
                >
                  <PlusSmallIcon className="size-5" />
                  ADD
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
