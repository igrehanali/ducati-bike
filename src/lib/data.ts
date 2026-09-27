import { catalog, getProduct as getCatalogProduct, productsInCategory, type Product } from "@/lib/catalog"
import { bikes } from "@/lib/bikes"
import { articles } from "@/lib/news"

export { formatPrice } from "@/lib/format"
export { announcements, collections, heroSlides, navigation, stories, type NavItem } from "@/lib/site-content"

export type { Product }


function p(slug: string): Product {
  const product = getCatalogProduct(slug)
  if (!product) throw new Error(`Unknown product: ${slug}`)
  return product
}

/** Products referenced by name in the designed sections. */
export const products = {
  corseV8Graphic: p("vellora-corse-v8-helmet-graphic"),
  corseV8WhiteCarbon: p("vellora-corse-v8-helmet-white-carbon"),
  corseV8Black: p("vellora-corse-v8-helmet-black"),
  corseV8White: p("vellora-corse-v8-helmet-white"),
  explorerHoodie: p("vellora-explorer-hooded-sweatshirt"),
  explorerHoodieWomens: p("vellora-explorer-hooded-sweatshirt-womens"),
  jargonSweatshirt: p("vellora-jargon-sweatshirt"),
  essentialHoodie: p("vellora-essential-hooded-sweatshirt"),
  silencers: p("silencers-96482321aa"),
  orizzonteSilencer: p("orizzonte-v4-silencer-96481772da"),
  racingSilencers: p("vellora-racing-silencers"),
  titanioExhaust: p("titanio-racing-exhaust-set"),
  veloce5: p("veloce-5-perforated-leather-motorcycle-jacket-men"),
  visorDarkSmoke: p("aero-r10-shield-dark-mirror-silver"),
  visorSilver: p("aero-r10-shield-mirror-silver"),
  visorIridium: p("aero-r10-shield-iridium-blue"),
  carbonHelmet: p("vellora-corse-carbon-helmet"),
  c5Jacket: p("vellora-corse-c5-leather-jacket"),
  raceHelmet: p("vellora-corse-race-helmet-red"),
}

export const allProducts: Product[] = catalog
export const getProduct = getCatalogProduct

const helmets = [products.corseV8Graphic, products.corseV8WhiteCarbon, products.corseV8Black, products.corseV8White]
const apparel = [products.explorerHoodie, products.explorerHoodieWomens, products.jargonSweatshirt, products.essentialHoodie]
const exhausts = [products.silencers, products.orizzonteSilencer, products.racingSilencers, products.titanioExhaust]
const bestsellers = catalog.filter((x) => x.badge === "Bestseller")
const womens = catalog.filter((x) => x.gender === "women")

/** First items follow the design; the rest extend the slider (max 8). */
const row = (first: Product[], more: Product[]) => [...first, ...more.filter((x) => !first.includes(x))].slice(0, 8)

export const newArrivals = {
  "New Collection": row(helmets, catalog.filter((x) => x.isNew)),
  "Best Sellers": row([products.corseV8Black, products.explorerHoodie, products.silencers, products.corseV8White], bestsellers),
  "Vellora Exclusives": row([products.titanioExhaust, products.corseV8Graphic, products.essentialHoodie, products.jargonSweatshirt], catalog.filter((x) => x.badge === "Limited")),
}

export const lifestyleApparel = {
  "Sweatshirts & Hoodies": row(apparel, productsInCategory("hoodies")),
  "T-Shirts": row([], productsInCategory("t-shirts")),
  "Polos & Shirts": row([], productsInCategory("polos")),
  "Caps & Hats": row([], productsInCategory("caps")),
  "Womens wear": row([products.explorerHoodieWomens], womens),
}

export const motorcycleAccessories = {
  Exhausts: row(exhausts, productsInCategory("exhausts")),
  Touring: row([], productsInCategory("touring")),
  Carbon: row([products.silencers, products.titanioExhaust], productsInCategory("performance")),
  "Accessory Packs": row([], [...productsInCategory("touring"), ...productsInCategory("performance")].filter((x) => x.price >= 100)),
  "Electric & Electronics": row([], catalog.filter((x) => /Mount|Cover/.test(x.name))),
}



export const promos = [
  {
    title: "Riding wear & safety gear",
    description: "Vellora motorcycle clothing & accessories",
    image: "/media/promo-riding-wear.webp",
    href: "/shop/riding-wear",
    cta: "DISCOVER ALL",
  },
  {
    title: "Casual wear & merchandise",
    description: "Vellora lifestyle clothing & accessories for men, women and children",
    image: "/media/promo-casual-wear.webp",
    href: "/shop/casual-wear",
    cta: "DISCOVER ALL",
  },
  {
    title: "Track days & experiences",
    description: "Book a Vellora track day and ride the UK’s best circuits with expert instruction",
    image: "/media/promo-track-days.webp",
    href: "/track-days",
    cta: "BOOK A DAY",
  },
  {
    title: "Service & workshop",
    description: "Genuine parts, factory-trained technicians and seasonal servicing for your Vellora",
    image: "/media/promo-workshop.webp",
    href: "/service",
    cta: "BOOK A SERVICE",
  },
]

export const news = articles.map((article) => ({
  date: article.date,
  title: article.title,
  excerpt: article.excerpt,
  image: article.image,
  href: `/news/${article.slug}`,
}))


export const velloraRange = bikes.map((bike) => ({
  name: bike.name,
  tagline: bike.family,
  image: bike.card,
  position: bike.cardPosition,
  href: `/bikes/${bike.slug}`,
}))

export const riderGallery = [
  { image: "/media/gallery-fulmine-tank.webp", alt: "Vintage red motorcycle headlamp and tank" },
  { image: "/media/gallery-pro-rider.webp", alt: "Rider in a dark garage with a café racer" },
  { image: "/media/gallery-sabbia-yellow.webp", alt: "Café racer glowing under a red backlight" },
  { image: "/media/gallery-red-gloves.webp", alt: "Red leather gloves resting on a fuel tank" },
  { image: "/media/gallery-fairing.webp", alt: "Sport-bike fairing and headlight detail" },
  { image: "/media/gallery-leather-rider.webp", alt: "Rider in leathers on a cruiser at speed" },
  { image: "/media/gallery-white-vellora.webp", alt: "Dual-sport motorcycle with headlight on at night" },
  { image: "/media/gallery-rombo.webp", alt: "Black café racer against a roller shutter" },
  { image: "/media/gallery-race-gloves.webp", alt: "Gloved hands on the bars of a retro motorcycle" },
  { image: "/media/gallery-tail.webp", alt: "Copper-toned custom bike headlamp detail" },
  { image: "/media/gallery-red-jacket-rider.webp", alt: "Rider in a red jacket beside a motorcycle" },
  { image: "/media/gallery-dash.webp", alt: "Analogue rev counter close-up" },
  { image: "/media/gallery-sabbia-tunnel.webp", alt: "Orange tank motorcycle under neon lights" },
  { image: "/media/gallery-bestia-mono.webp", alt: "Black and white engine detail" },
  { image: "/media/gallery-helmet-closeup.webp", alt: "Rider holding a carbon helmet" },
  { image: "/media/gallery-track-straight.webp", alt: "Rider on the main straight of a circuit" },
  { image: "/media/gallery-sabbia-tank.webp", alt: "Blue café fairing headlight detail" },
  { image: "/media/gallery-workshop-fulmine.webp", alt: "Motorcycle in a workshop garage" },
  { image: "/media/gallery-carbon-helmet.webp", alt: "Rider in a helmet looking over the hills" },
  { image: "/media/gallery-sabbia-detail.webp", alt: "Café racer tank and clip-on bars" },
  { image: "/media/hero-fulmine-red.webp", alt: "Retro motorcycle silhouetted at sunset" },
]

export const editorial = [
  { image: "/media/editorial-leather-suit.webp", title: "Protection", text: "CE-certified armour and abrasion-resistant leather, tested on track." },
  { image: "/media/editorial-gloves-on.webp", title: "Control", text: "Pre-curved fingers and grippy palms for precise feel at the bars." },
  { image: "/media/gallery-pro-rider.webp", title: "Vision", text: "Optical-class visors with anti-fog inserts for every light condition." },
]

/* ---------- Product detail page (the designed product) ---------- */

export const productDetail = {
  pairWith: [products.visorDarkSmoke, products.visorSilver, products.visorIridium],
  youMayAlsoLike: row([products.explorerHoodie, products.carbonHelmet, products.c5Jacket, products.raceHelmet], [...apparel, ...helmets]),
  construction: [
    "Carbon composite shell with eight-piece multi-density EPS liner.",
    "Optical Class 1 visor with 11-vent ventilation layout and A-Head fit adjustment system.",
  ],
  shipping: [
    "UK shipping only. Delivery within 2–3 days.",
    "Note: helmets & underwear are non-returnable items.",
  ],
}




