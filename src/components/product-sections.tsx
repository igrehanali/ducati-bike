import { ProductCarouselSectionClient, ProductRowSectionClient, type ProductCarouselSectionProps } from "@/components/section-carousel"
import { toCard, type CardProduct, type Product } from "@/lib/catalog"

/* Product carousels map products to slim cards first, so only the fields a card shows are serialised to the client. */

export function ProductRowSection({ title, products }: { title: string; products: (Product | CardProduct)[] }) {
  return <ProductRowSectionClient title={title} products={products.map(toCard)} />
}

export function ProductCarouselSection({
  tabs,
  ...props
}: Omit<ProductCarouselSectionProps, "tabs"> & { tabs: Record<string, (Product | CardProduct)[]> }) {
  const slim = Object.fromEntries(Object.entries(tabs).map(([name, list]) => [name, list.map(toCard)]))
  return <ProductCarouselSectionClient tabs={slim} {...props} />
}
