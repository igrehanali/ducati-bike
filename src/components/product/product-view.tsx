"use client"

import { useEffect, useState, type ReactNode } from "react"
import Image from "next/image"
import { toast } from "sonner"

import { useCartUI } from "@/components/cart/cart-provider"
import { GalleryNextIcon, GalleryPrevIcon } from "@/components/icons"
import { Price } from "@/components/price"
import { imageFit } from "@/components/product/product-card"
import { SizeGuideDialog } from "@/components/product/size-guide-dialog"
import { WishlistButton } from "@/components/product/wishlist-button"
import { QuantityStepper } from "@/components/quantity-stepper"
import { addToCart } from "@/lib/cart-store"
import type { Product } from "@/lib/catalog"
import { discountPercent } from "@/lib/format"
import type { SizeTable } from "@/lib/size-guide"
import { cn } from "@/lib/utils"
import { trackRecentlyViewed } from "@/lib/wishlist-store"

type ProductViewProps = {
  product: Product
  sizeTable?: SizeTable
  /** Extra content rendered under the purchase panel (pair-with, accordions). */
  children?: ReactNode
}

function unique(list: string[]) {
  return Array.from(new Set(list))
}

export function ProductView({ product, sizeTable, children }: ProductViewProps) {
  const { colors, sizes, rating, reviewCount, stock } = product
  const initialColor = Math.max(0, colors.findIndex((c) => c.image === product.image))
  const [colorIndex, setColorIndex] = useState(initialColor)
  const color = colors[colorIndex]
  const gallery = unique([...(color?.image ? [color.image] : []), ...product.images])
  const [activeImage, setActiveImage] = useState(gallery[0])
  const [size, setSize] = useState(sizes[0])
  const [quantity, setQuantity] = useState(1)
  const { setOpen } = useCartUI()

  useEffect(() => {
    trackRecentlyViewed(product.slug)
  }, [product.slug])

  const imageIndex = Math.max(0, gallery.indexOf(activeImage))
  const discount = discountPercent(product)
  const soldOut = stock === 0
  const lowStock = stock > 0 && stock <= 5
  const step = (delta: number) => setActiveImage(gallery[(imageIndex + delta + gallery.length) % gallery.length])
  const showSizes = sizes.length > 1
  const cutout = activeImage.endsWith(".png")

  function handleAddToCart() {
    addToCart(product, {
      size: sizes.length ? size : undefined,
      color: color?.name,
      image: color?.image ?? product.image,
      quantity,
    })
    setQuantity(1)
    setOpen(true)
  }

  function selectColor(index: number) {
    setColorIndex(index)
    const image = colors[index].image
    if (image) setActiveImage(image)
  }

  return (
    <section className="grid gap-10 px-5 pt-6 lg:grid-cols-[minmax(0,728fr)_minmax(0,648fr)] lg:gap-6">
      {/* Gallery */}
      <div className="flex flex-col gap-2 lg:sticky lg:top-6 lg:self-start">
        <div className="relative aspect-[728/532] overflow-hidden bg-surface">
          <Image
            key={activeImage}
            src={activeImage}
            alt={`${product.name} — image ${imageIndex + 1} of ${gallery.length}`}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={cutout ? "scale-[1.24] object-contain" : "object-cover"}
          />
          {gallery.length > 1 ? (
            <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between">
              <button type="button" aria-label="Previous image" onClick={() => step(-1)} className={cn(!cutout && "rounded-full bg-white/80")}>
                <GalleryPrevIcon className="size-9" />
              </button>
              <button type="button" aria-label="Next image" onClick={() => step(1)} className={cn(!cutout && "rounded-full bg-white/80")}>
                <GalleryNextIcon className="size-9" />
              </button>
            </div>
          ) : null}
          {soldOut ? <span className="absolute top-4 left-4 bg-black px-2 py-1 font-inter text-xs font-bold text-white">Sold out</span> : null}
        </div>
        {gallery.length > 1 ? (
          <div className="flex snap-x gap-2 overflow-x-auto [scrollbar-width:none]">
            {gallery.map((src, index) => (
              <button
                key={src}
                type="button"
                aria-label={`Show image ${index + 1}`}
                aria-current={src === activeImage}
                onClick={() => setActiveImage(src)}
                className={cn(
                  "relative aspect-square w-[calc((100%-32px)/5)] shrink-0 snap-start bg-surface outline-offset-[-1px]",
                  src === activeImage && "outline outline-1 outline-black"
                )}
              >
                <Image src={src} alt="" fill sizes="140px" className={imageFit(src)} />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Purchase panel */}
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <a href="#reviews" className="flex items-center gap-2 font-inter">
              <span aria-hidden="true" className="text-sm leading-[21px] font-semibold">
                {"★★★★★".slice(0, Math.round(rating))}
                <span className="text-black/20">{"★★★★★".slice(Math.round(rating))}</span>
              </span>
              <span className="text-[13px] leading-[18px] underline">{rating.toFixed(1)}</span>
              <span aria-hidden="true" className="text-[10px] leading-[14px] text-black/70">|</span>
              <span className="text-[13px] leading-[18px] text-[#6b6b6b] underline">{reviewCount} reviews</span>
            </a>
            <div className="flex flex-col gap-4">
              <h1 className="font-inter text-2xl leading-[30px] font-medium tracking-[-0.6px] uppercase md:text-[32px] md:leading-[38px]">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <Price value={product.price} compareAt={product.compareAt} emphasis gap="gap-2" className="text-base leading-5" />
                {discount > 0 ? (
                  <span className="bg-black p-1 font-mono text-xs leading-[14px] font-medium tracking-[-0.2px] text-white">-{discount}%</span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {showSizes ? (
              <fieldset className="flex flex-col gap-3">
                <legend className="mb-3 font-inter text-sm leading-[17px] font-semibold tracking-[-0.3px]">Select Size:</legend>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={option === size}
                      onClick={() => setSize(option)}
                      className={cn(
                        "h-10 min-w-10 border px-2 text-xs leading-[10px] transition-colors",
                        option === size ? "border-black bg-black text-white" : "border-surface bg-surface hover:border-black"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : sizes.length === 1 ? (
              <p className="font-inter text-sm leading-[17px] font-semibold tracking-[-0.3px]">
                Size: <span className="font-normal">{sizes[0]}</span>
              </p>
            ) : null}
            {showSizes ? <SizeGuideDialog table={sizeTable} /> : null}
            <p className="flex flex-wrap items-center gap-1 font-inter">
              <span className="flex items-center gap-2 text-xs leading-[18px] font-semibold">
                <span className={cn("size-2 rounded-full", soldOut ? "bg-brand-dark" : lowStock ? "bg-[#ff9800]" : "bg-[#59fe00]")} />
                {soldOut ? "OUT OF STOCK" : lowStock ? `ONLY ${stock} LEFT` : "IN STOCK"}
              </span>
              {!soldOut ? (
                <>
                  <span aria-hidden="true" className="size-0.5 rounded-full bg-black" />
                  <span className="text-[13px] leading-[18px]">Delivery within 2–3 days</span>
                </>
              ) : null}
            </p>
          </div>

          {colors.length ? (
            <div className="flex flex-col gap-3">
              <p className="flex items-center gap-2">
                <span className="font-inter text-sm leading-[17px] font-semibold tracking-[-0.3px]">Color:</span>
                <span className="text-xs leading-[14px] tracking-[-0.2px]">{color?.name}</span>
              </p>
              <div className="flex gap-1">
                {colors.map((option, index) =>
                  option.image ? (
                    <button
                      key={option.name}
                      type="button"
                      aria-label={option.name}
                      aria-pressed={index === colorIndex}
                      onClick={() => selectColor(index)}
                      className={cn(
                        "relative h-[74px] w-14 bg-surface",
                        index === colorIndex ? "border-b border-black" : "border-b border-transparent hover:border-black/30"
                      )}
                    >
                      <Image src={option.image} alt="" fill sizes="56px" className="object-cover" />
                    </button>
                  ) : (
                    <button
                      key={option.name}
                      type="button"
                      aria-label={option.name}
                      aria-pressed={index === colorIndex}
                      onClick={() => selectColor(index)}
                      className={cn(
                        "flex size-10 items-center justify-center rounded-full border",
                        index === colorIndex ? "border-black" : "border-transparent hover:border-black/30"
                      )}
                    >
                      <span className="size-7 rounded-full border border-black/15" style={{ background: option.hex }} />
                    </button>
                  )
                )}
              </div>
            </div>
          ) : null}

          <div className="flex gap-4">
            <QuantityStepper value={quantity} onChange={(q) => setQuantity(Math.min(q, Math.max(1, stock)))} />
            <button
              type="button"
              onClick={soldOut ? () => toast("We'll email you when it's back in stock.") : handleAddToCart}
              className={cn(
                "h-[42px] flex-1 text-sm leading-[21px] font-medium text-white",
                soldOut ? "bg-black/50 hover:bg-black/60" : "bg-black hover:bg-black/85"
              )}
            >
              {soldOut ? "NOTIFY ME WHEN AVAILABLE" : "ADD TO CART"}
            </button>
            <WishlistButton slug={product.slug} name={product.name} className="size-[42px] shrink-0 rounded-none border border-black bg-white shadow-none" />
          </div>
        </div>

        {children}
      </div>
    </section>
  )
}
