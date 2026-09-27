import type { MetadataRoute } from "next"

import { bikes } from "@/lib/bikes"
import { catalog, categories, departments } from "@/lib/catalog"
import { articles } from "@/lib/news"

const BASE_URL = "https://velloramoto.co.uk"

const STATIC_ROUTES = [
  "/",
  "/shop",
  "/bikes",
  "/ebikes",
  "/news",
  "/about",
  "/contact",
  "/track-days",
  "/service",
  "/faq",
  "/size-guide",
  "/gift-cards",
  "/shipping",
  "/returns",
  "/privacy",
  "/terms",
  "/track-order",
  "/wishlist",
  "/cart",
]

const COLLECTIONS = ["new-2026", "sale", "bestsellers"]

const url = (path: string) => `${BASE_URL}${path === "/" ? "" : path}`

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: url(path),
    changeFrequency: path === "/" || path === "/news" ? "daily" : "weekly",
    priority: path === "/" ? 1 : path === "/shop" ? 0.9 : 0.6,
  }))

  const shopSlugs = [...new Set([...departments.map((d) => d.slug), ...categories.map((c) => c.slug), ...COLLECTIONS])]
  const shopEntries: MetadataRoute.Sitemap = shopSlugs.map((slug) => ({
    url: url(`/shop/${slug}`),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  const productEntries: MetadataRoute.Sitemap = catalog.map((product) => ({
    url: url(`/products/${product.slug}`),
    lastModified: new Date(product.createdAt),
    changeFrequency: "weekly",
    priority: 0.7,
    images: [url(product.image)],
  }))

  const bikeEntries: MetadataRoute.Sitemap = bikes.map((bike) => ({
    url: url(`/bikes/${bike.slug}`),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const newsEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: url(`/news/${article.slug}`),
    lastModified: new Date(article.isoDate),
    changeFrequency: "monthly",
    priority: 0.6,
    images: [url(article.image)],
  }))

  return [...staticEntries, ...shopEntries, ...productEntries, ...bikeEntries, ...newsEntries]
}
