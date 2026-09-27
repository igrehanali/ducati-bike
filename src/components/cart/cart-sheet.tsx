"use client"

import Image from "next/image"
import Link from "next/link"

import { CloseIcon } from "@/components/icons"
import { Price } from "@/components/price"
import { QuantityStepper } from "@/components/quantity-stepper"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { addToCart, removeFromCart, setQuantity, useCartLines } from "@/lib/cart-store"
import { formatPrice, products } from "@/lib/data"
import { computeTotals, FREE_SHIPPING_THRESHOLD } from "@/lib/pricing"

const upsells = [
  { ...products.visorDarkSmoke, image: "/media/helmet-aero-graphic.webp", compareAt: 78 },
  { ...products.visorSilver, image: "/media/pdp-front.webp", compareAt: 78 },
]

export function CartSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const lines = useCartLines()
  const count = lines.reduce((sum, line) => sum + line.quantity, 0)
  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0)
  const toFreeShipping = computeTotals(lines).amountToFreeShipping
  const close = () => onOpenChange(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full gap-6 border-l-0 bg-white pt-5 pb-7 text-black shadow-none data-[side=right]:w-full data-[side=right]:sm:max-w-[550px]"
      >
        <div className="flex min-h-0 flex-1 flex-col gap-6 px-5">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-start gap-2 font-sans text-xl leading-6 font-medium tracking-[-0.4px]">
              Your Shopping
              <span className="text-base leading-[19px] tracking-[-0.3px]">({count})</span>
            </SheetTitle>
            <SheetClose aria-label="Close cart" className="cursor-pointer">
              <CloseIcon className="size-5" />
            </SheetClose>
          </div>
          <SheetDescription className="sr-only">Items in your shopping bag</SheetDescription>

          <div className="h-px shrink-0 bg-rule" />

          <ul className="-mx-5 min-h-0 flex-1 overflow-y-auto px-5">
            {lines.length === 0 ? (
              <li className="py-10 text-center text-sm text-subtle">Your bag is empty.</li>
            ) : (
              lines.map((line) => (
                <li key={line.id} className="flex gap-3.5 pb-6">
                  <Link
                    href={`/products/${line.slug}`}
                    onClick={() => onOpenChange(false)}
                    className="relative h-[140px] w-[106px] shrink-0 bg-surface"
                  >
                    <Image src={line.image} alt={line.name} fill sizes="106px" className="object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-4 pt-2">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-6">
                        <p className="font-inter text-sm leading-[17px] font-medium tracking-[-0.3px] uppercase">
                          {line.name}
                        </p>
                        <p className="shrink-0 font-mono text-base leading-[19px] font-semibold tracking-[-0.3px]">
                          {formatPrice(line.price * line.quantity)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 font-inter text-sm leading-[17px] tracking-[-0.3px]">
                        {line.size ? (
                          <p>
                            Size: <span className="text-subtle">{line.size}</span>
                          </p>
                        ) : null}
                        {line.color ? (
                          <p>
                            Color: <span className="text-subtle">{line.color}</span>
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <QuantityStepper size="sm" value={line.quantity} onChange={(q) => setQuantity(line.id, q)} />
                      <button
                        type="button"
                        onClick={() => removeFromCart(line.id)}
                        className="text-[13px] leading-[18px] text-subtle underline underline-offset-2 hover:text-black"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-3.5">
          <section className="flex flex-col gap-4 border-t border-[#f0f0f0] px-5 pt-4">
            <h2 className="text-xl leading-6 font-semibold tracking-[-0.4px]">You may also like</h2>
            <div className="grid grid-cols-2 gap-2">
              {upsells.map((item) => (
                <div key={item.slug} className="flex gap-2">
                  <div className="relative h-[98px] w-[74px] shrink-0 bg-surface">
                    <Image src={item.image} alt={item.name} fill sizes="74px" className="object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-col gap-3">
                    <div className="flex flex-col gap-2">
                      <p className="line-clamp-2 font-inter text-xs leading-[14px] font-medium tracking-[-0.2px]">
                        {item.name}
                      </p>
                      <Price value={item.price} compareAt={item.compareAt} emphasis gap="gap-2" className="text-sm leading-[17px]" />
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      className="h-8 w-[86px] bg-black text-xs leading-[10px] font-bold text-white hover:bg-black/80"
                    >
                      ADD
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4 border-t border-[#f0f0f0] px-5 pt-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xl leading-6 font-semibold tracking-[-0.4px]">Total</p>
              <p className="font-mono text-lg leading-[22px] font-semibold tracking-[-0.4px]">{formatPrice(total)}</p>
            </div>
            {lines.length ? (
              <div className="-mt-1 flex flex-col gap-2">
                <p className="text-[13px] leading-[18px] text-subtle">
                  {toFreeShipping > 0 ? (
                    <>
                      You&apos;re <span className="font-mono font-semibold text-black">{formatPrice(toFreeShipping)}</span> away from free
                      delivery
                    </>
                  ) : (
                    <>
                      You&apos;ve unlocked <span className="font-semibold text-black">free standard delivery</span>
                    </>
                  )}
                </p>
                <div aria-hidden="true" className="h-0.5 w-full bg-chip">
                  <div
                    className="h-full bg-black transition-[width] duration-500"
                    style={{ width: `${Math.round(((FREE_SHIPPING_THRESHOLD - toFreeShipping) / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                  />
                </div>
              </div>
            ) : null}
            {lines.length ? (
              <Link
                href="/checkout"
                onClick={close}
                className="flex h-[42px] w-full items-center justify-center bg-black text-sm leading-[21px] font-medium text-white hover:bg-black/85"
              >
                CHECKOUT
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="h-[42px] w-full bg-black text-sm leading-[21px] font-medium text-white hover:bg-black/85 disabled:opacity-50"
              >
                CHECKOUT
              </button>
            )}
            <Link
              href="/cart"
              onClick={close}
              className="mx-auto text-[13px] leading-[18px] underline underline-offset-2 hover:text-subtle"
            >
              View bag
            </Link>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
