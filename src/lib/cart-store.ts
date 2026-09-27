import type { Product } from "@/lib/catalog"
import { createLocalStore } from "@/lib/local-store"

export type CartLine = {
  id: string
  slug: string
  name: string
  image: string
  price: number
  size?: string
  color?: string
  quantity: number
}

// The designed product (kept inline so the cart store doesn't pull the catalog into every page).
const DESIGNED = { slug: "veloce-5-perforated-leather-motorcycle-jacket-men", name: "VELOCE 5 - PERFORATED LEATHER MOTORCYCLE JACKET MEN", price: 46.8 }

// Demo cart state that mirrors the "Your Shopping" design frame.
const initialLines: CartLine[] = [
  {
    id: `${DESIGNED.slug}:S:Black Carbon Matte Gloss`,
    slug: DESIGNED.slug,
    name: DESIGNED.name,
    image: "/media/helmet-aero-white-side.webp",
    price: DESIGNED.price,
    size: "S",
    color: "Black Carbon Matte Gloss",
    quantity: 1,
  },
]

const cart = createLocalStore<CartLine[]>("vellora-moto-cart", initialLines)

export const useCartLines = cart.useValue

export function getCartLines() {
  return cart.get()
}

export function addToCart(
  product: Pick<Product, "slug" | "name" | "image" | "price">,
  options: { size?: string; color?: string; image?: string; quantity?: number } = {}
) {
  const id = [product.slug, options.size, options.color].filter(Boolean).join(":")
  const quantity = options.quantity ?? 1
  cart.set((lines) => {
    const existing = lines.find((line) => line.id === id)
    return existing
      ? lines.map((line) => (line.id === id ? { ...line, quantity: line.quantity + quantity } : line))
      : [
          ...lines,
          {
            id,
            slug: product.slug,
            name: product.name,
            image: options.image ?? product.image,
            price: product.price,
            size: options.size,
            color: options.color,
            quantity,
          },
        ]
  })
}

export function setQuantity(id: string, quantity: number) {
  cart.set((lines) =>
    quantity <= 0 ? lines.filter((line) => line.id !== id) : lines.map((line) => (line.id === id ? { ...line, quantity } : line))
  )
}

export function removeFromCart(id: string) {
  cart.set((lines) => lines.filter((line) => line.id !== id))
}

export function clearCart() {
  cart.set([])
}
