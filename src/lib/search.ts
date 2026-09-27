import { bikes } from "@/lib/bikes"
import { catalog, categories, getCategory, type Product } from "@/lib/catalog"

export type SearchHit =
  | { kind: "product"; product: Product; score: number }
  | { kind: "link"; label: string; description: string; href: string; score: number }

const pages = [
  { label: "Track days", description: "Book a Vellora track day", href: "/track-days", keywords: "track day circuit booking experience" },
  { label: "Service & workshop", description: "Book a service, MOT or fitting", href: "/service", keywords: "service workshop mot repair fitting maintenance" },
  { label: "Contact us", description: "Showroom, phone and opening hours", href: "/contact", keywords: "contact phone email showroom hours address" },
  { label: "Size guide", description: "Find your helmet, glove and clothing size", href: "/size-guide", keywords: "size guide fit measure" },
  { label: "Delivery & shipping", description: "UK delivery options and costs", href: "/shipping", keywords: "delivery shipping postage" },
  { label: "Returns", description: "30-day returns policy", href: "/returns", keywords: "returns refund exchange" },
  { label: "Gift cards", description: "Buy a gift card or check a balance", href: "/gift-cards", keywords: "gift card voucher present" },
  { label: "Track your order", description: "Check the status of an order", href: "/track-order", keywords: "track order status delivery where" },
  { label: "FAQs", description: "Answers to common questions", href: "/faq", keywords: "faq help questions" },
  { label: "News", description: "Stories, launches and riding guides", href: "/news", keywords: "news blog articles stories" },
]

function normalise(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
}

export function searchCatalog(query: string, limit = 24): SearchHit[] {
  const terms = normalise(query).split(/\s+/).filter(Boolean)
  if (!terms.length) return []

  const productHits: SearchHit[] = []
  for (const product of catalog) {
    const category = getCategory(product.category)
    const name = normalise(product.name)
    const haystack = normalise(
      [product.name, category?.name, product.category, product.colors.map((c) => c.name).join(" "), product.bikes.join(" "), product.sku, product.badge ?? ""].join(" ")
    )
    let score = 0
    for (const term of terms) {
      if (!haystack.includes(term)) {
        score = 0
        break
      }
      score += name.includes(term) ? 3 : 1
      if (name.startsWith(term)) score += 2
    }
    if (score > 0) productHits.push({ kind: "product", product, score: score + product.rating / 10 })
  }

  const linkHits: SearchHit[] = []
  for (const category of categories) {
    const text = normalise(`${category.name} ${category.slug} ${category.description}`)
    if (terms.every((t) => text.includes(t))) {
      linkHits.push({ kind: "link", label: category.name, description: "Category", href: `/shop/${category.slug}`, score: 10 })
    }
  }
  for (const bike of bikes) {
    const text = normalise(`${bike.name} ${bike.family} vellora`)
    if (terms.every((t) => text.includes(t))) {
      linkHits.push({ kind: "link", label: `Vellora ${bike.name}`, description: `Shop gear for the ${bike.family.toLowerCase()}`, href: `/bikes/${bike.slug}`, score: 9 })
    }
  }
  for (const page of pages) {
    const text = normalise(`${page.label} ${page.keywords}`)
    if (terms.every((t) => text.includes(t))) linkHits.push({ kind: "link", ...page, score: 8 })
  }

  return [...linkHits.slice(0, 4), ...productHits.sort((a, b) => b.score - a.score).slice(0, limit)]
}

export const popularSearches = ["Helmet", "Leather jacket", "Gloves", "Hoodie", "Fulmine", "Sabbia", "Exhaust", "eBike"]
