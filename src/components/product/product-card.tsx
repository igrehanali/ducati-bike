import Image from "next/image"
import Link from "next/link"

import { Price } from "@/components/price"
import { WishlistButton } from "@/components/product/wishlist-button"
import type { Product } from "@/lib/catalog"
import { cn } from "@/lib/utils"

type CardProduct = Pick<Product, "slug" | "name" | "image" | "price" | "compareAt" | "badge"> &
  Partial<Pick<Product, "stock">> & { images?: string[]; colors?: { name: string; hex: string }[] }

/** Cut-out PNGs sit inside the grey tile; photographs fill it. */
export function imageFit(src: string) {
  return src.endsWith(".png") ? "object-contain" : "object-cover"
}

export function ProductCard({ product, sizes }: { product: CardProduct; sizes?: string }) {
  const hover = product.images?.[1]
  const soldOut = product.stock === 0

  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col gap-6">
      <div className="relative aspect-[344/467] overflow-hidden bg-surface">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 80vw"}
          className={cn(
            imageFit(product.image),
            "transition duration-500 group-hover:scale-[1.03]",
            hover && "group-hover:opacity-0",
            soldOut && "opacity-60"
          )}
        />
        {hover ? (
          <Image
            src={hover}
            alt=""
            fill
            sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 80vw"}
            className={cn(imageFit(hover), "opacity-0 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100")}
          />
        ) : null}
        <div className="absolute top-4 left-4 flex gap-1">
          {product.badge ? (
            <span className="bg-chip px-2 py-1 font-inter text-xs leading-[14px] font-bold tracking-[-0.2px]">{product.badge}</span>
          ) : null}
          {soldOut ? (
            <span className="bg-black px-2 py-1 font-inter text-xs leading-[14px] font-bold tracking-[-0.2px] text-white">Sold out</span>
          ) : null}
        </div>
        <WishlistButton
          slug={product.slug}
          name={product.name}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 max-lg:opacity-100"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="truncate font-inter text-base leading-[19px] font-medium tracking-[-0.3px]">{product.name}</h3>
        <div className="flex items-center justify-between gap-3">
          <Price value={product.price} compareAt={product.compareAt} className="text-base leading-[19px]" />
          {product.colors && product.colors.length > 1 ? (
            <span className="flex items-center gap-1" aria-label={`${product.colors.length} colours`}>
              {product.colors.slice(0, 4).map((color) => (
                <span key={color.name} className="size-3 rounded-full border border-black/15" style={{ background: color.hex }} />
              ))}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

export function ProductGrid({ products, className }: { products: CardProduct[]; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-x-2 gap-y-10 lg:grid-cols-4", className)}>
      {products.map((product) => (
        <li key={product.slug}>
          <ProductCard product={product} sizes="(min-width: 1024px) 25vw, 50vw" />
        </li>
      ))}
    </ul>
  )
}
