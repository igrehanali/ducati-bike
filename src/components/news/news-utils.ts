import { catalog, type CategorySlug, type Product } from "@/lib/catalog"
import { articles, type Article } from "@/lib/news"

export const SITE_URL = "https://velloramoto.co.uk"

export const NEWS_CATEGORIES: Article["category"][] = ["Collections", "Racing", "Riding", "Workshop"]

/** Newest first. */
export const sortedArticles = [...articles].sort((a, b) => b.isoDate.localeCompare(a.isoDate))

export function isNewsCategory(value: unknown): value is Article["category"] {
  return typeof value === "string" && (NEWS_CATEGORIES as string[]).includes(value)
}

export function headingId(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const inCategory = (slug: CategorySlug) => catalog.filter((p) => p.category === slug && p.stock > 0)
const newest = () => [...catalog].filter((p) => p.isNew).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
const teamReplica = () => catalog.filter((p) => /team|replica/i.test(p.name))

/** Round-robin across pools so the row mixes product types, without duplicates. */
function interleave(pools: Product[][], limit: number) {
  const seen = new Set<string>()
  const out: Product[] = []
  const longest = Math.max(0, ...pools.map((p) => p.length))
  for (let i = 0; i < longest && out.length < limit; i++) {
    for (const pool of pools) {
      const product = pool[i]
      if (product && !seen.has(product.slug)) {
        seen.add(product.slug)
        out.push(product)
        if (out.length === limit) break
      }
    }
  }
  return out
}

/** Products that fit the story, chosen by article category. */
export function shopTheStory(article: Article, limit = 8) {
  switch (article.category) {
    case "Collections":
      return interleave([newest(), inCategory("hoodies"), inCategory("helmets")], limit)
    case "Racing":
      return interleave([inCategory("helmets"), inCategory("suits"), teamReplica()], limit)
    case "Riding":
      return interleave([inCategory("jackets"), inCategory("gloves"), inCategory("touring")], limit)
    case "Workshop":
      return interleave([inCategory("performance"), inCategory("touring")], limit)
  }
}
