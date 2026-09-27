/* Formatting helpers that are safe to import from client components (no catalog data). */

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: value >= 1000 && Number.isInteger(value) ? 0 : 2,
  }).format(value)
}

export function discountPercent(product: { price: number; compareAt?: number }) {
  return product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0
}
