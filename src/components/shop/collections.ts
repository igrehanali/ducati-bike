/* Resolves /shop and /shop/[slug] into a collection of products plus header content. */

import type { Crumb } from "@/components/site/page-header"
import {
  catalog,
  categories,
  categoriesInDepartment,
  departments,
  getCategory,
  productsInCategory,
  type Category,
  type CategorySlug,
  type Product,
} from "@/lib/catalog"

import { isNewProduct } from "./listing"

export type ShopCollection = {
  slug: string
  kind: "all" | "category" | "department" | "special"
  title: string
  description: string
  eyebrow?: string
  image?: string
  imagePosition?: string
  products: Product[]
  crumbs: Crumb[]
  /** Whether the Category filter makes sense (not on single-category pages). */
  allowCategory: boolean
  subcategories?: Category[]
  category?: Category
}

const specials: Record<string, Omit<ShopCollection, "slug" | "kind" | "crumbs" | "allowCategory"> > = {
  "new-2026": {
    title: "New 2026 Collection",
    eyebrow: "Just landed",
    description: "The latest helmets, leathers and lifestyle pieces from Valdoro — fresh for the 2026 season.",
    image: "/media/page-rider-garage-leathers.webp",
    imagePosition: "50% 45%",
    products: catalog.filter(isNewProduct),
  },
  sale: {
    title: "Sale",
    eyebrow: "Limited time",
    description: "Selected riding gear, apparel and eBikes with up to 40% off while stocks last.",
    image: "/media/page-store-rack.webp",
    imagePosition: "50% 50%",
    products: catalog.filter((p) => p.compareAt),
  },
  bestsellers: {
    title: "Bestsellers",
    eyebrow: "Rider favourites",
    description: "The pieces Velloristi come back for, season after season.",
    image: "/media/gallery-red-jacket-rider.webp",
    imagePosition: "60% 35%",
    products: catalog.filter((p) => p.badge === "Bestseller"),
  },
}

export const specialSlugs = Object.keys(specials)

export const allShop: ShopCollection = {
  slug: "",
  kind: "all",
  title: "Shop all",
  description: "Riding wear, lifestyle apparel, performance parts and eBikes — everything in the Vellora Moto UK.",
  products: catalog,
  crumbs: [{ label: "Shop" }],
  allowCategory: true,
}

export function shopSlugs() {
  const slugs = new Set<string>([...categories.map((c) => c.slug), ...departments.map((d) => d.slug), ...specialSlugs])
  return [...slugs]
}

export function resolveCollection(slug: string): ShopCollection | undefined {
  const category = getCategory(slug)
  if (category) {
    const department = departments.find((d) => d.slug === category.department)
    const crumbs: Crumb[] = [{ label: "Shop", href: "/shop" }]
    if (department && department.slug !== category.slug) crumbs.push({ label: department.name, href: `/shop/${department.slug}` })
    crumbs.push({ label: category.name })
    return {
      slug,
      kind: "category",
      title: category.name,
      eyebrow: department && department.slug !== category.slug ? department.name : undefined,
      description: category.description,
      products: productsInCategory(category.slug as CategorySlug),
      crumbs,
      allowCategory: false,
      category,
    }
  }

  const department = departments.find((d) => d.slug === slug)
  if (department) {
    const subcategories = categoriesInDepartment(department.slug)
    const slugs = new Set(subcategories.map((c) => c.slug))
    return {
      slug,
      kind: "department",
      title: department.name,
      eyebrow: "Department",
      description: department.description,
      image: department.image,
      products: catalog.filter((p) => slugs.has(p.category)),
      crumbs: [{ label: "Shop", href: "/shop" }, { label: department.name }],
      allowCategory: true,
      subcategories,
    }
  }

  const special = specials[slug]
  if (special) {
    return {
      slug,
      kind: "special",
      ...special,
      crumbs: [{ label: "Shop", href: "/shop" }, { label: special.title }],
      allowCategory: true,
    }
  }

  return undefined
}
