/* Product catalog: departments, categories and every product sold in the store. */

export { PRICE_BUCKETS, SORTS, type SortId } from "@/lib/shop-constants"
export { discountPercent } from "@/lib/format"

export type DepartmentSlug = "riding-wear" | "casual-wear" | "accessories" | "ebikes"

export type CategorySlug =
  | "helmets"
  | "jackets"
  | "suits"
  | "gloves"
  | "boots"
  | "hoodies"
  | "t-shirts"
  | "polos"
  | "caps"
  | "bags"
  | "lifestyle"
  | "exhausts"
  | "performance"
  | "touring"
  | "ebikes"

export type BikeSlug = "fulmine" | "rombo" | "bestia" | "orizzonte" | "sabbia" | "notturno"

export type Badge = "New" | "Sale" | "Bestseller" | "Limited"

export type ProductColor = { name: string; hex: string; image?: string }
export type ProductSpec = { label: string; value: string }

export type Product = {
  slug: string
  sku: string
  name: string
  category: CategorySlug
  price: number
  compareAt?: number
  badge?: Badge
  image: string
  images: string[]
  colors: ProductColor[]
  sizes: string[]
  description: string[]
  features: string[]
  specs: ProductSpec[]
  bikes: BikeSlug[]
  gender: "men" | "women" | "unisex"
  rating: number
  reviewCount: number
  stock: number
  isNew: boolean
  createdAt: string
}

export type Category = {
  slug: CategorySlug
  name: string
  department: DepartmentSlug
  description: string
  image: string
}


/* ---------------- Departments & categories ---------------- */

export const departments: { slug: DepartmentSlug; name: string; description: string; image: string }[] = [
  {
    slug: "riding-wear",
    name: "Riding Wear",
    description: "Helmets, leathers, gloves and boots engineered for protection on road and track.",
    image: "/media/menu-riding-wear.webp",
  },
  {
    slug: "casual-wear",
    name: "Casual Wear & Merchandise",
    description: "Vellora lifestyle clothing and accessories for men, women and children.",
    image: "/media/menu-casual-wear.webp",
  },
  {
    slug: "accessories",
    name: "Motorcycle Accessories",
    description: "Exhausts, performance parts and touring kit to make your Vellora your own.",
    image: "/media/promo-workshop.webp",
  },
  {
    slug: "ebikes",
    name: "eBikes",
    description: "Vellora-designed electric mountain, trail and city bikes.",
    image: "/media/ebike-mountain.webp",
  },
]

export const categories: Category[] = [
  { slug: "helmets", name: "Helmets", department: "riding-wear", image: "/media/collection-helmet.webp", description: "Race-bred full-face helmets, shields and helmet accessories — ECE 22.06 certified." },
  { slug: "jackets", name: "Jackets", department: "riding-wear", image: "/media/collection-jacket.webp", description: "Leather and textile riding jackets with CE-certified armour for every season." },
  { slug: "suits", name: "Race Suits", department: "riding-wear", image: "/media/p-suit-black-rider.webp", description: "One and two-piece leathers developed with Vellora Corse for the track." },
  { slug: "gloves", name: "Gloves", department: "riding-wear", image: "/media/p-gloves-tan-studio.webp", description: "Racing, touring and summer gloves with knuckle and palm protection." },
  { slug: "boots", name: "Boots", department: "riding-wear", image: "/media/collection-boots.webp", description: "Race boots, touring boots and riding shoes built for control and comfort." },
  { slug: "hoodies", name: "Sweatshirts & Hoodies", department: "casual-wear", image: "/media/hoodie-explorer.webp", description: "Soft cotton-blend sweatshirts and hoodies in Vellora Corse and Sabbia styles." },
  { slug: "t-shirts", name: "T-Shirts", department: "casual-wear", image: "/media/p-tee-black-model.webp", description: "Everyday tees in organic cotton with Vellora heritage and racing graphics." },
  { slug: "polos", name: "Polos & Shirts", department: "casual-wear", image: "/media/p-polo-black-model.webp", description: "Paddock-ready piqué polos and team shirts." },
  { slug: "caps", name: "Caps & Hats", department: "casual-wear", image: "/media/p-cap-white.webp", description: "Baseball caps, trucker caps and beanies." },
  { slug: "bags", name: "Bags & Backpacks", department: "casual-wear", image: "/media/p-backpack-red-leather.webp", description: "Leather and technical backpacks for the commute and the weekend." },
  { slug: "lifestyle", name: "Lifestyle Accessories", department: "casual-wear", image: "/media/p-sunglasses-studio.webp", description: "Sunglasses, key rings, mugs and gifts for every Vellorista." },
  { slug: "exhausts", name: "Exhausts", department: "accessories", image: "/media/exhaust-titanium.webp", description: "Homologated and racing exhaust systems from Titanio and Corsa." },
  { slug: "performance", name: "Performance Parts", department: "accessories", image: "/media/p-brake-caliper-purple.webp", description: "Brakes, suspension, chains, tyres and billet parts." },
  { slug: "touring", name: "Touring & Tech", department: "accessories", image: "/media/p-panniers-adventure.webp", description: "Luggage, phone mounts, covers and everything for the long way round." },
  { slug: "ebikes", name: "eBikes", department: "ebikes", image: "/media/ebike-emtb-red.webp", description: "Electric mountain and city bikes designed in Valdoro." },
]

/* ---------------- Category defaults ---------------- */

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"]
const HELMET_SIZES = ["XS", "S", "M", "L", "XL"]
const GLOVE_SIZES = ["S", "M", "L", "XL", "XXL"]
const BOOT_SIZES = ["39", "40", "41", "42", "43", "44", "45", "46"]
const FRAME_SIZES = ["S", "M", "L", "XL"]
const ALL_BIKES: BikeSlug[] = ["fulmine", "rombo", "bestia", "orizzonte", "sabbia", "notturno"]

type CategoryDefaults = {
  sizes: string[]
  features: string[]
  specs: ProductSpec[]
  intro: string
  bikes: BikeSlug[]
}

const defaults: Record<CategorySlug, CategoryDefaults> = {
  helmets: {
    sizes: HELMET_SIZES,
    intro: "Developed with Vellora Corse riders and wind-tunnel tested for stability at speed.",
    features: ["ECE 22.06 homologated", "Carbon composite shell in multiple sizes", "Optical Class 1 anti-scratch visor with anti-fog insert", "Removable, washable anti-bacterial liner", "Emergency cheek-pad removal system", "Double D-ring racing closure"],
    specs: [{ label: "Certification", value: "ECE 22.06" }, { label: "Shell", value: "Carbon composite" }, { label: "Weight", value: "1,350 g ± 50 g (size M)" }, { label: "Visor", value: "Class 1, Anti-fog ready" }],
    bikes: ALL_BIKES,
  },
  jackets: {
    sizes: APPAREL_SIZES,
    intro: "Cut for the riding position with pre-curved sleeves and stretch inserts that move with you.",
    features: ["CE Level 2 shoulder and elbow armour", "Pocket for back protector", "Full-circumference jacket-to-trouser zip", "Perforated panels for airflow", "Reflective details for visibility"],
    specs: [{ label: "Protection", value: "EN 17092 — Class AA" }, { label: "Armour", value: "CE Level 2 shoulders & elbows" }, { label: "Lining", value: "Removable thermal liner" }],
    bikes: ALL_BIKES,
  },
  suits: {
    sizes: ["46", "48", "50", "52", "54", "56"],
    intro: "Developed with Vellora Corse riders for maximum protection and freedom of movement on track.",
    features: ["Full-grain 1.3 mm cowhide leather", "Titanium shoulder and knee sliders", "Aerodynamic speed hump", "CE Level 2 armour throughout", "Accordion stretch panels"],
    specs: [{ label: "Protection", value: "EN 17092 — Class AAA" }, { label: "Leather", value: "1.3 mm bovine" }, { label: "Sliders", value: "Titanium shoulder, replaceable knee" }],
    bikes: ["fulmine", "rombo"],
  },
  gloves: {
    sizes: GLOVE_SIZES,
    intro: "Pre-curved construction for precise feel at the bars and a secure, fatigue-free grip.",
    features: ["Goatskin and cowhide construction", "Hard knuckle and finger protection", "Palm slider and reinforced palm", "Touchscreen-compatible fingertips", "Adjustable wrist closure"],
    specs: [{ label: "Certification", value: "EN 13594 — Level 1 KP" }, { label: "Material", value: "Goatskin / cowhide" }],
    bikes: ALL_BIKES,
  },
  boots: {
    sizes: BOOT_SIZES,
    intro: "Rigid where it protects and flexible where it matters, for confident control on the pegs.",
    features: ["Ankle and shin protection", "Oil and fuel-resistant sole", "Gear-shift reinforcement", "Waterproof breathable membrane (touring models)"],
    specs: [{ label: "Certification", value: "EN 13634" }, { label: "Upper", value: "Full-grain leather / microfibre" }],
    bikes: ALL_BIKES,
  },
  hoodies: {
    sizes: APPAREL_SIZES,
    intro: "A soft brushed-back fleece in a relaxed fit, finished with Vellora embroidery and prints.",
    features: ["80% cotton, 20% recycled polyester", "Brushed fleece interior", "Ribbed cuffs and hem", "Embroidered and printed details"],
    specs: [{ label: "Composition", value: "80% cotton, 20% polyester" }, { label: "Weight", value: "320 gsm" }, { label: "Fit", value: "Regular" }, { label: "Care", value: "Machine wash 30°C" }],
    bikes: [],
  },
  "t-shirts": {
    sizes: APPAREL_SIZES,
    intro: "Organic cotton jersey tees with prints inspired by Vellora's racing history.",
    features: ["100% organic cotton", "Pre-shrunk jersey", "Taped neck and shoulder seams", "Screen-printed graphics"],
    specs: [{ label: "Composition", value: "100% organic cotton" }, { label: "Weight", value: "180 gsm" }, { label: "Fit", value: "Regular" }, { label: "Care", value: "Machine wash 30°C" }],
    bikes: [],
  },
  polos: {
    sizes: APPAREL_SIZES,
    intro: "Classic piqué polos as worn in the Vellora paddock, with a tailored fit.",
    features: ["Cotton piqué with stretch", "Two-button placket", "Ribbed collar and cuffs", "Embroidered chest logo"],
    specs: [{ label: "Composition", value: "95% cotton, 5% elastane" }, { label: "Fit", value: "Slim" }, { label: "Care", value: "Machine wash 30°C" }],
    bikes: [],
  },
  caps: {
    sizes: ["One size"],
    intro: "Structured and unstructured caps with adjustable backs for an easy fit.",
    features: ["Adjustable strap closure", "Embroidered front logo", "Breathable eyelets", "Pre-curved peak"],
    specs: [{ label: "Composition", value: "100% cotton twill" }, { label: "Size", value: "One size, adjustable" }],
    bikes: [],
  },
  bags: {
    sizes: ["One size"],
    intro: "Carry-alls designed for riders, with padded laptop sleeves and weather-resistant fabrics.",
    features: ["Padded 15\" laptop sleeve", "Water-resistant construction", "Padded ergonomic straps", "Quick-access front pocket"],
    specs: [{ label: "Capacity", value: "22 litres" }, { label: "Laptop", value: "Up to 15\"" }],
    bikes: [],
  },
  lifestyle: {
    sizes: ["One size"],
    intro: "Small details for Velloristi, designed and finished in Valdoro style.",
    features: ["Official Vellora licensed product", "Gift-ready packaging"],
    specs: [{ label: "Packaging", value: "Presentation box" }],
    bikes: [],
  },
  exhausts: {
    sizes: [],
    intro: "Lighter, louder and tuned for the characteristic Vellora sound.",
    features: ["Titanium and carbon construction", "Weight saving vs. standard system", "Includes dedicated ECU mapping", "Road-legal version with removable db-killer"],
    specs: [{ label: "Material", value: "Titanium / carbon fibre" }, { label: "Homologation", value: "EC type-approved (road)" }, { label: "Fitting", value: "Professional fitting recommended" }],
    bikes: ["fulmine", "rombo", "orizzonte"],
  },
  performance: {
    sizes: [],
    intro: "Race-proven components to sharpen braking, handling and response.",
    features: ["Genuine Vellora Performance part", "Direct replacement, no modifications", "Two-year warranty"],
    specs: [{ label: "Warranty", value: "24 months" }, { label: "Fitting", value: "Professional fitting recommended" }],
    bikes: ALL_BIKES,
  },
  touring: {
    sizes: [],
    intro: "Kit for riders who measure trips in countries, not miles.",
    features: ["Designed for Vellora mounting points", "Weather-resistant materials", "Quick-release fixing"],
    specs: [{ label: "Warranty", value: "24 months" }],
    bikes: ["orizzonte", "sabbia", "bestia", "notturno"],
  },
  ebikes: {
    sizes: FRAME_SIZES,
    intro: "Designed by the Vellora Design Centre, built for trails, towns and everything between.",
    features: ["Vellora E-Drive motor — 85 Nm", "720 Wh integrated battery", "Air suspension", "12-speed trail drivetrain", "Tubeless trail tyres"],
    specs: [{ label: "Motor", value: "Vellora E-Drive, 85 Nm" }, { label: "Battery", value: "720 Wh integrated" }, { label: "Range", value: "Up to 120 km" }, { label: "Frame", value: "6061 aluminium" }],
    bikes: [],
  },
}

/* ---------------- Product definitions ---------------- */

type Seed = {
  slug: string
  name: string
  price: number
  compareAt?: number
  images: string[]
  blurb: string
  badge?: Badge
  colors?: ProductColor[]
  sizes?: string[]
  bikes?: BikeSlug[]
  gender?: Product["gender"]
  stock?: number
  isNew?: boolean
  rating?: number
  reviewCount?: number
  description?: string[]
  specs?: ProductSpec[]
}

const BLACK = { name: "Black", hex: "#111111" }
const WHITE = { name: "White", hex: "#f4f4f4" }
const RED = { name: "Vellora Red", hex: "#cc0001" }
const NAVY = { name: "Navy", hex: "#1c2541" }
const GREY = { name: "Grey", hex: "#8a8d93" }

// Pieces of the Aero photo set used by the design's product page.
const AERO_SET = ["/media/pdp-front.webp", "/media/pdp-rear-quarter.webp", "/media/pdp-rear.webp", "/media/pdp-side-alt.webp", "/media/pdp-front-quarter.webp"]

const seeds: Record<CategorySlug, Seed[]> = {
  helmets: [
    { slug: "vellora-corse-v8-helmet-graphic", name: "Vellora Corse V8 Helmet", price: 46.8, compareAt: 78, badge: "New", images: ["/media/helmet-aero-graphic.webp", ...AERO_SET], blurb: "Our flagship race helmet in the Corse V8 graphic, straight from the World GP paddock.", colors: [{ name: "Corse Graphic", hex: "#1c2541" }], isNew: true, rating: 4.9, reviewCount: 128 },
    { slug: "vellora-corse-v8-helmet-white-carbon", name: "Vellora Corse V8 Helmet", price: 46.8, compareAt: 78, badge: "New", images: ["/media/helmet-aero-white-carbon.webp", ...AERO_SET], blurb: "Raw carbon meets gloss white on the lightest helmet in the Corse range.", colors: [{ name: "White Carbon", hex: "#e8e8e8" }], isNew: true, rating: 4.8, reviewCount: 64 },
    { slug: "vellora-corse-v8-helmet-black", name: "Vellora Corse V8 Helmet", price: 46.8, compareAt: 78, badge: "New", images: ["/media/helmet-aero-black.webp", ...AERO_SET], blurb: "Stealthy gloss black with the aerodynamics of the Corse V8.", colors: [BLACK], isNew: true, rating: 4.8, reviewCount: 97 },
    { slug: "vellora-corse-v8-helmet-white", name: "Vellora Corse V8 Helmet", price: 46.8, compareAt: 78, badge: "New", images: ["/media/helmet-aero-white.webp", ...AERO_SET], blurb: "Clean gloss white Corse V8 for riders who like to be seen.", colors: [WHITE], isNew: true, rating: 4.7, reviewCount: 41 },
    {
      slug: "veloce-5-perforated-leather-motorcycle-jacket-men",
      name: "VELOCE 5 - PERFORATED LEATHER MOTORCYCLE JACKET MEN",
      price: 46.8,
      compareAt: 78,
      images: ["/media/pdp-side.webp", ...AERO_SET],
      blurb: "",
      colors: [{ name: "White Gloss", hex: "#f4f4f4", image: "/media/helmet-aero-white-side.webp" }, { name: "Black Carbon Matte Gloss", hex: "#1a1a1a", image: "/media/pdp-side.webp" }],
      sizes: APPAREL_SIZES,
      rating: 4.8,
      reviewCount: 324,
      description: [
        "Developed over a decade, the Aero R10 Solid Helmet is our most advanced race helmet for road and track, engineered for protection, aerodynamic efficiency, and low weight. ECE 22.06, DOT and FIM certified, it combines a carbon composite shell, eight-piece EPS, CFD-tested aerodynamics, an Optical Class 1 visor and an 11‑vent layout to deliver stability, wide vision and cooling, while the A‑Head system fine‑tunes fit for long‑ride comfort.",
        "Includes: two shields (one dark and one clear), a Standard spoiler, a drawstring bag",
      ],
    },
    { slug: "vellora-corse-carbon-helmet", name: "Vellora Corse Carbon Helmet", price: 699, compareAt: 799, badge: "Sale", images: ["/media/helmet-pro-matte.webp", "/media/p-helmet-orange-visor.webp", "/media/p-helmet-studio-black.webp"], blurb: "Matte carbon shell with a race spoiler and an iridium-ready visor.", colors: [{ name: "Matte Carbon", hex: "#2b2b2b" }], rating: 4.9, reviewCount: 212 },
    { slug: "vellora-corse-race-helmet-red", name: "Vellora Corse Race Helmet", price: 549, images: ["/media/collection-helmet.webp", "/media/p-helmet-red-rider.webp"], blurb: "The iconic Vellora Corse livery in fibreglass-carbon composite.", colors: [RED], badge: "Bestseller", rating: 4.8, reviewCount: 356 },
    { slug: "vellora-speed-evo-helmet", name: "Vellora Speed Evo Helmet", price: 429, images: ["/media/p-helmet-studio-black.webp", "/media/p-helmet-orange-visor.webp"], blurb: "A sport-touring lid with a drop-down sun visor and quiet aerodynamics.", colors: [BLACK, { name: "Matte Grey", hex: "#5a5a5a" }], rating: 4.6, reviewCount: 88 },
    { slug: "vellora-urban-iridium-helmet", name: "Vellora Urban Iridium Helmet", price: 349, images: ["/media/p-helmet-street.webp", "/media/p-helmet-studio-black.webp"], blurb: "City-friendly full-face with an iridescent visor and wide field of view.", colors: [BLACK], isNew: true, badge: "New", rating: 4.5, reviewCount: 23 },
    { slug: "vellora-sabbia-full-face-helmet", name: "Sabbia Full-Face Helmet", price: 299, images: ["/media/p-helmet-red-rider.webp"], blurb: "Retro-inspired full-face with a modern EPS liner for Free Spirit adventures.", colors: [RED, { name: "Pink Ember", hex: "#d6456b" }], bikes: ["sabbia", "bestia"], stock: 3, rating: 4.4, reviewCount: 57 },
    { slug: "aero-r10-shield-dark-mirror-silver", name: "Aero R10 Shield Dark Mirror Silver", price: 46.8, images: ["/media/visor-dark-smoke.webp"], blurb: "Dark smoke replacement shield with anti-fog treatment.", sizes: ["One size"], rating: 4.7, reviewCount: 64, specs: [{ label: "Fits", value: "Aero R10 / Corse V8" }, { label: "Tint", value: "Dark smoke, 20% VLT" }] },
    { slug: "aero-r10-shield-mirror-silver", name: "Aero R10 Shield Dark Mirror Silver", price: 46.8, images: ["/media/visor-silver.webp"], blurb: "Silver mirror finish over a dark base for bright track days.", sizes: ["One size"], rating: 4.6, reviewCount: 38, specs: [{ label: "Fits", value: "Aero R10 / Corse V8" }, { label: "Tint", value: "Silver mirror, 25% VLT" }] },
    { slug: "aero-r10-shield-iridium-blue", name: "Aero R10 Shield Iridium Blue", price: 46.8, images: ["/media/visor-iridium.webp"], blurb: "Iridium blue mirror shield — the look of the World GP grid.", sizes: ["One size"], rating: 4.8, reviewCount: 51, specs: [{ label: "Fits", value: "Aero R10 / Corse V8" }, { label: "Tint", value: "Iridium blue, 25% VLT" }] },
  ],
  jackets: [
    { slug: "vellora-corse-c5-leather-jacket", name: "Vellora Corse C5 Leather Jacket", price: 649, compareAt: 749, badge: "Sale", images: ["/media/collection-jacket.webp", "/media/p-jacket-leather-black.webp"], blurb: "Race-derived leather jacket with the Vellora Corse graphic and aero hump compatibility.", colors: [BLACK], rating: 4.8, reviewCount: 142 },
    { slug: "vellora-team-replica-jacket-2026", name: "Vellora Team Replica Jacket 2026", price: 189, images: ["/media/review-jacket.webp"], blurb: "The official Vellora Factory Team softshell as worn in the 2026 paddock.", colors: [RED], isNew: true, badge: "New", rating: 4.9, reviewCount: 76 },
    { slug: "vellora-speed-perforated-leather-jacket", name: "Vellora Speed Perforated Leather Jacket", price: 579, images: ["/media/p-jacket-leather-black.webp", "/media/p-jacket-urban-rider.webp"], blurb: "Perforated cowhide for summer track days and fast road rides.", colors: [BLACK, { name: "Black / White", hex: "#dddddd" }], rating: 4.7, reviewCount: 98 },
    { slug: "vellora-heritage-leather-jacket", name: "Vellora Heritage Leather Jacket", price: 499, images: ["/media/p-jacket-leather-brown.webp"], blurb: "Vintage-waxed brown leather with a café-racer collar.", colors: [{ name: "Brown", hex: "#6b4226" }], bikes: ["sabbia", "bestia"], rating: 4.6, reviewCount: 64 },
    { slug: "vellora-lady-leather-jacket", name: "Vellora Lady Leather Jacket", price: 459, images: ["/media/p-jacket-leather-womens.webp", "/media/gallery-red-jacket-rider.webp"], blurb: "A women's-specific cut with stretch panels and hidden armour.", colors: [BLACK, RED], gender: "women", rating: 4.8, reviewCount: 47 },
    { slug: "sabbia-field-textile-jacket", name: "Sabbia Field Textile Jacket", price: 329, images: ["/media/p-jacket-textile-olive.webp"], blurb: "Waxed-cotton-look waterproof textile with a removable thermal liner.", colors: [{ name: "Olive", hex: "#4b5320" }], bikes: ["sabbia"], isNew: true, badge: "New", rating: 4.5, reviewCount: 19 },
    { slug: "vellora-urban-riding-jacket", name: "Vellora Urban Riding Jacket", price: 289, images: ["/media/p-jacket-urban-rider.webp", "/media/gallery-sabbia-tunnel.webp"], blurb: "Casual-looking protective jacket for the daily commute.", colors: [BLACK], stock: 2, rating: 4.4, reviewCount: 33 },
  ],
  suits: [
    { slug: "vellora-corse-k1-race-suit", name: "Vellora Corse K1 Race Suit", price: 1899, images: ["/media/p-suit-black-rider.webp", "/media/editorial-leather-suit.webp"], blurb: "One-piece race suit with airbag compatibility, as used in Vellora racing schools.", colors: [BLACK, RED], badge: "Limited", stock: 4, rating: 4.9, reviewCount: 22 },
    { slug: "vellora-corse-track-suit-white", name: "Vellora Corse Track Suit White", price: 1599, images: ["/media/p-suit-white.webp"], blurb: "White perforated leathers for summer circuits.", colors: [WHITE], rating: 4.8, reviewCount: 14 },
    { slug: "vellora-heritage-two-piece-suit", name: "Vellora Heritage Two-Piece Suit", price: 1199, images: ["/media/p-suit-hanger.webp"], blurb: "Zip-together jacket and trousers for road and track flexibility.", colors: [BLACK], rating: 4.6, reviewCount: 11, stock: 0 },
  ],
  gloves: [
    { slug: "vellora-corse-c5-racing-gloves", name: "Vellora Corse C5 Racing Gloves", price: 229, images: ["/media/p-gloves-tan-studio.webp", "/media/gallery-race-gloves.webp"], blurb: "Gauntlet race gloves with titanium knuckles and a scaphoid slider.", colors: [{ name: "Black / White / Red", hex: "#111111" }], badge: "Bestseller", rating: 4.9, reviewCount: 276 },
    { slug: "vellora-classic-leather-gloves", name: "Vellora Classic Leather Gloves", price: 89, images: ["/media/p-gloves-black-leather.webp"], blurb: "Short leather gloves with discreet knuckle protection.", colors: [BLACK], rating: 4.5, reviewCount: 81 },
    { slug: "sabbia-tan-leather-gloves", name: "Sabbia Tan Leather Gloves", price: 79, images: ["/media/p-gloves-tan-studio.webp", "/media/p-gloves-tan-classic.webp"], blurb: "Soft goatskin gloves with a vintage look and touchscreen tips.", colors: [{ name: "Tan", hex: "#c8a165" }], bikes: ["sabbia"], rating: 4.6, reviewCount: 58 },
    { slug: "sabbia-yellow-work-gloves", name: "Sabbia Yellow Gloves", price: 69, images: ["/media/p-gloves-yellow.webp"], blurb: "Bright Sabbia-yellow leather for summer rides.", colors: [{ name: "Yellow", hex: "#f2c200" }], bikes: ["sabbia"], isNew: true, badge: "New", rating: 4.3, reviewCount: 12 },
    { slug: "vellora-urban-short-gloves", name: "Vellora Urban Short Gloves", price: 75, images: ["/media/p-gloves-black-wood.webp", "/media/p-gloves-black-wood.webp"], blurb: "Minimal short-cuff gloves for the city.", colors: [BLACK], rating: 4.4, reviewCount: 29 },
    { slug: "vellora-heritage-perforated-gloves", name: "Vellora Heritage Perforated Gloves", price: 95, images: ["/media/p-gloves-tan-classic.webp"], blurb: "Perforated summer gloves with a padded palm.", colors: [{ name: "Camel", hex: "#b88a4a" }], rating: 4.5, reviewCount: 17 },
    { slug: "vellora-summer-fingerless-gloves", name: "Vellora Summer Fingerless Gloves", price: 45, compareAt: 59, badge: "Sale", images: ["/media/p-gloves-red-fingerless.webp", "/media/gallery-red-gloves.webp"], blurb: "Fingerless red leather gloves for café stops and short hops.", colors: [RED], rating: 4.2, reviewCount: 34 },
  ],
  boots: [
    { slug: "vellora-corse-v6-race-boots", name: "Vellora Corse V6 Race Boots", price: 459, images: ["/media/collection-boots.webp"], blurb: "Race boots with an internal ankle brace and replaceable toe sliders.", colors: [RED], badge: "Bestseller", rating: 4.8, reviewCount: 164 },
    { slug: "vellora-heritage-engineer-boots", name: "Vellora Heritage Engineer Boots", price: 279, images: ["/media/p-boots-engineer-black.webp"], blurb: "Classic engineer boots with hidden ankle protection.", colors: [BLACK], rating: 4.6, reviewCount: 43 },
    { slug: "vellora-urban-riding-boots", name: "Vellora Urban Riding Boots", price: 229, images: ["/media/p-boots-black-street.webp"], blurb: "Short urban boots that walk like trainers.", colors: [BLACK], rating: 4.5, reviewCount: 38 },
    { slug: "vellora-tour-waterproof-boots", name: "Vellora Tour Waterproof Boots", price: 319, images: ["/media/p-boots-touring.webp"], blurb: "Tall touring boots with a waterproof, breathable membrane.", colors: [BLACK], bikes: ["orizzonte", "notturno"], rating: 4.7, reviewCount: 52 },
    { slug: "sabbia-casual-riding-shoes", name: "Sabbia Casual Riding Shoes", price: 159, images: ["/media/p-boots-casual.webp"], blurb: "Suede riding shoes with ankle discs and a gear-shift pad.", colors: [{ name: "Brown Suede", hex: "#8b5a2b" }], bikes: ["sabbia"], isNew: true, badge: "New", rating: 4.4, reviewCount: 9 },
  ],
  hoodies: [
    { slug: "vellora-explorer-hooded-sweatshirt", name: "Vellora Explorer Hooded Sweatshirt", price: 46.8, compareAt: 78, badge: "Sale", images: ["/media/hoodie-explorer.webp"], blurb: "Colour-blocked hoodie with an oversized Vellora sleeve print.", colors: [{ name: "White / Red", hex: "#e8e8e8" }], rating: 4.7, reviewCount: 88 },
    { slug: "vellora-explorer-hooded-sweatshirt-womens", name: "Vellora Explorer Hooded Sweatshirt Womens", price: 46.8, compareAt: 78, badge: "Sale", images: ["/media/hoodie-explorer-womens.webp"], blurb: "The Explorer hoodie in a women's cut.", colors: [{ name: "Black / Red", hex: "#111111" }], gender: "women", rating: 4.8, reviewCount: 41 },
    { slug: "vellora-jargon-sweatshirt", name: "Vellora Jargon Sweatshirt", price: 46.8, compareAt: 78, badge: "Sale", images: ["/media/sweatshirt-jargon.webp"], blurb: "Full-zip sweat with the Vellora jargon graphic sleeve.", colors: [BLACK], rating: 4.6, reviewCount: 36 },
    { slug: "vellora-essential-hooded-sweatshirt", name: "Vellora Essential Hooded Sweatshirt", price: 46.8, compareAt: 78, badge: "Sale", images: ["/media/hoodie-essential.webp"], blurb: "The essential logo hoodie in Sabbia yellow.", colors: [{ name: "Yellow", hex: "#f2c200" }], rating: 4.7, reviewCount: 59 },
    { slug: "vellora-logo-hoodie-white", name: "Vellora Logo Hoodie White", price: 79, images: ["/media/p-hoodie-white-hanging.webp", "/media/p-hoodie-white-model.webp"], blurb: "Clean white hoodie with a tonal shield logo.", colors: [WHITE], isNew: true, badge: "New", rating: 4.5, reviewCount: 14 },
    { slug: "vellora-corse-hoodie-black", name: "Vellora Corse Hoodie Black", price: 85, images: ["/media/p-hoodie-black-model.webp"], blurb: "Heavyweight black hoodie with Vellora Corse embroidery.", colors: [BLACK], badge: "Bestseller", rating: 4.8, reviewCount: 203 },
    { slug: "sabbia-desert-hoodie", name: "Sabbia Desert Hoodie", price: 75, images: ["/media/p-hoodie-brown.webp"], blurb: "Earth-toned hoodie inspired by the Sabbia Desert Sled.", colors: [{ name: "Desert Brown", hex: "#8b5a3c" }], rating: 4.4, reviewCount: 22 },
    { slug: "vellora-essential-hoodie-sand", name: "Vellora Essential Hoodie Sand", price: 69, images: ["/media/p-hoodie-beige.webp"], blurb: "The essential hoodie in a warm sand colourway.", colors: [{ name: "Sand", hex: "#cbbd9f" }], rating: 4.5, reviewCount: 18 },
  ],
  "t-shirts": [
    { slug: "vellora-corse-logo-tee-black", name: "Vellora Corse Logo Tee Black", price: 35, images: ["/media/p-tee-black-model.webp", "/media/p-tee-black-detail.webp"], blurb: "The everyday Corse tee in black.", colors: [BLACK], badge: "Bestseller", rating: 4.7, reviewCount: 312 },
    { slug: "vellora-racing-red-tee", name: "Vellora Racing Red Tee", price: 35, images: ["/media/p-tee-red-model.webp"], blurb: "Vellora Red tee with a small chest logo.", colors: [RED], rating: 4.6, reviewCount: 144 },
    { slug: "vellora-essential-tee-white", name: "Vellora Essential Tee White", price: 29, images: ["/media/p-tee-white-hanger.webp", "/media/p-tee-white-model.webp"], blurb: "Crisp white organic cotton tee.", colors: [WHITE], rating: 4.5, reviewCount: 97 },
    { slug: "sabbia-free-spirit-tee", name: "Sabbia Free Spirit Tee", price: 32, images: ["/media/p-tee-white-flatlay.webp"], blurb: "Relaxed tee celebrating the Free Spirit.", colors: [WHITE], isNew: true, badge: "New", rating: 4.4, reviewCount: 12 },
    { slug: "vellora-1926-heritage-tee", name: "Vellora 1926 Heritage Tee", price: 39, images: ["/media/p-tee-black-hanger.webp"], blurb: "Heritage roundel print marking a century of Vellora.", colors: [BLACK], isNew: true, badge: "Limited", rating: 4.8, reviewCount: 27 },
    { slug: "vellora-bestia-tee", name: "Vellora Bestia Tee", price: 32, images: ["/media/p-tee-white-model.webp"], blurb: "A clean white tee for Bestia owners.", colors: [WHITE], bikes: ["bestia"], rating: 4.3, reviewCount: 21 },
    { slug: "vellora-essential-tee-2-pack", name: "Vellora Essential Tee 2-Pack", price: 49, compareAt: 58, badge: "Sale", images: ["/media/p-tee-pack-flatlay.webp"], blurb: "Two essential tees — black and sage — in one pack.", colors: [{ name: "Black / Sage", hex: "#9fb8a0" }], rating: 4.6, reviewCount: 66 },
  ],
  polos: [
    { slug: "vellora-corse-polo-navy", name: "Vellora Corse Polo Navy", price: 55, images: ["/media/p-polo-black-model.webp"], blurb: "Navy piqué polo with Corse embroidery.", colors: [NAVY], rating: 4.6, reviewCount: 48 },
    { slug: "vellora-team-polo-black", name: "Vellora Team Polo Black", price: 59, images: ["/media/p-polo-black-folded.webp", "/media/p-polo-black-model.webp"], blurb: "The team polo worn by Vellora staff in the paddock.", colors: [BLACK], badge: "Bestseller", rating: 4.8, reviewCount: 131 },
    { slug: "vellora-heritage-polo-grey", name: "Vellora Heritage Polo Grey", price: 55, images: ["/media/p-polo-grey.webp"], blurb: "Grey marl polo with a heritage badge.", colors: [GREY], rating: 4.4, reviewCount: 17 },
    { slug: "vellora-classic-polo-white", name: "Vellora Classic Polo White", price: 55, images: ["/media/p-polo-white-model.webp"], blurb: "White piqué polo for summer race weekends.", colors: [WHITE], rating: 4.5, reviewCount: 26 },
    { slug: "vellora-womens-polo", name: "Vellora Women's Polo", price: 52, images: ["/media/p-polo-navy-womens.webp"], blurb: "Women's fitted polo with a subtle shield logo.", colors: [NAVY], gender: "women", rating: 4.7, reviewCount: 22 },
    { slug: "vellora-paddock-polo", name: "Vellora Paddock Polo", price: 62, images: ["/media/p-polo-black-model.webp"], blurb: "Technical polo with moisture-wicking yarns.", colors: [BLACK], isNew: true, badge: "New", rating: 4.6, reviewCount: 8 },
  ],
  caps: [
    { slug: "vellora-trucker-cap-white", name: "Vellora Trucker Cap White", price: 29, images: ["/media/p-cap-trucker-white.webp"], blurb: "Mesh-back trucker in white.", colors: [WHITE], rating: 4.5, reviewCount: 39 },
    { slug: "vellora-corse-cap-white", name: "Vellora Corse Cap White", price: 32, images: ["/media/p-cap-white.webp"], blurb: "Structured six-panel cap with the Corse logo.", colors: [WHITE], badge: "Bestseller", rating: 4.7, reviewCount: 182 },
    { slug: "sabbia-washed-cap", name: "Sabbia Washed Cap", price: 27, images: ["/media/p-cap-washed-grey.webp"], blurb: "Garment-washed cotton cap with a lived-in feel.", colors: [GREY], rating: 4.4, reviewCount: 24 },
    { slug: "sabbia-yellow-cap", name: "Sabbia Yellow Cap", price: 27, images: ["/media/p-cap-yellow.webp"], blurb: "Sabbia yellow, of course.", colors: [{ name: "Yellow", hex: "#f2c200" }], isNew: true, badge: "New", rating: 4.3, reviewCount: 6 },
    { slug: "vellora-trucker-cap-black", name: "Vellora Trucker Cap Black", price: 29, images: ["/media/p-cap-trucker-black.webp"], blurb: "Black and white trucker with foam front.", colors: [BLACK], rating: 4.5, reviewCount: 31 },
    { slug: "vellora-heritage-cap", name: "Vellora Heritage Cap", price: 34, images: ["/media/p-cap-beige.webp"], blurb: "Unstructured linen-blend cap in stone.", colors: [{ name: "Stone", hex: "#d6cfc0" }], rating: 4.6, reviewCount: 15 },
  ],
  bags: [
    { slug: "vellora-commuter-backpack", name: "Vellora Commuter Backpack", price: 89, images: ["/media/p-backpack-navy.webp"], blurb: "Streamlined commuter pack with a helmet strap.", colors: [NAVY], rating: 4.6, reviewCount: 57 },
    { slug: "vellora-heritage-leather-backpack-red", name: "Vellora Heritage Leather Backpack Red", price: 249, images: ["/media/p-backpack-red-leather.webp"], blurb: "Full-grain leather backpack in deep Vellora red.", colors: [{ name: "Burgundy", hex: "#7a1f2b" }], badge: "Limited", stock: 5, rating: 4.9, reviewCount: 21 },
    { slug: "vellora-heritage-leather-backpack-tan", name: "Vellora Heritage Leather Backpack Tan", price: 249, images: ["/media/p-backpack-brown-leather.webp"], blurb: "The heritage leather pack in a rich tan.", colors: [{ name: "Tan", hex: "#9a5b3c" }], rating: 4.8, reviewCount: 18 },
    { slug: "vellora-urban-backpack", name: "Vellora Urban Backpack", price: 79, images: ["/media/p-backpack-black.webp"], blurb: "Lightweight everyday pack in black ripstop.", colors: [BLACK], rating: 4.4, reviewCount: 42 },
    { slug: "sabbia-leather-rucksack", name: "Sabbia Leather Rucksack", price: 179, images: ["/media/p-backpack-black-yellow.webp"], blurb: "Flap-top rucksack in pebbled black leather.", colors: [BLACK], isNew: true, badge: "New", rating: 4.5, reviewCount: 7 },
    { slug: "vellora-tour-roll-top-backpack", name: "Vellora Tour Roll-Top Backpack", price: 119, images: ["/media/p-backpack-navy-pedestal.webp"], blurb: "Waterproof roll-top pack for touring days.", colors: [NAVY], bikes: ["orizzonte"], rating: 4.7, reviewCount: 25 },
  ],
  lifestyle: [
    { slug: "vellora-corse-sunglasses", name: "Vellora Corse Sunglasses", price: 129, images: ["/media/p-sunglasses-studio.webp"], blurb: "Polarised lenses in a lightweight acetate frame.", colors: [BLACK], rating: 4.6, reviewCount: 44 },
    { slug: "vellora-clubmaster-sunglasses", name: "Vellora Clubmaster Sunglasses", price: 139, images: ["/media/p-sunglasses-clubmaster.webp"], blurb: "Browline sunglasses with gradient lenses.", colors: [BLACK], rating: 4.5, reviewCount: 19 },
    { slug: "vellora-lifestyle-sunglasses", name: "Vellora Lifestyle Sunglasses", price: 119, images: ["/media/p-sunglasses-studio.webp"], blurb: "Square-frame sunglasses with green lenses.", colors: [{ name: "Smoke", hex: "#3c4a3e" }], rating: 4.4, reviewCount: 12 },
    { slug: "sabbia-tortoise-sunglasses", name: "Sabbia Tortoise Sunglasses", price: 109, images: ["/media/p-sunglasses-tortoise.webp"], blurb: "Round tortoiseshell frames with a keyhole bridge.", colors: [{ name: "Tortoise", hex: "#6b3e1f" }], isNew: true, badge: "New", rating: 4.5, reviewCount: 5 },
    { slug: "vellora-leather-key-ring", name: "Vellora Leather Key Ring", price: 25, images: ["/media/p-keyring-leather.webp"], blurb: "Stitched leather loop key ring.", colors: [BLACK], rating: 4.7, reviewCount: 92 },
    { slug: "vellora-leather-wallet-key-set", name: "Vellora Leather Wallet & Key Set", price: 69, images: ["/media/p-wallet-keyring.webp"], blurb: "Zip wallet and matching key ring in a gift box.", colors: [BLACK], badge: "Bestseller", rating: 4.8, reviewCount: 64 },
    { slug: "vellora-logo-mug", name: "Vellora Logo Mug", price: 15, images: ["/media/p-mug-white.webp"], blurb: "Ceramic mug for the morning espresso-and-forums ritual.", colors: [WHITE], rating: 4.6, reviewCount: 118 },
    { slug: "vellora-corse-tall-mug", name: "Vellora Corse Tall Mug", price: 18, images: ["/media/p-mug-white-tall.webp"], blurb: "A 450 ml mug for long garage sessions.", colors: [WHITE], rating: 4.5, reviewCount: 40 },
    { slug: "vellora-gift-card-25", name: "Vellora Moto Gift Card £25", price: 25, images: ["/media/page-gift-red.webp", "/media/page-gift-white.webp"], blurb: "A digital gift card delivered by email, redeemable online and in the showroom for 24 months.", sizes: ["One size"], colors: [], rating: 5, reviewCount: 12, specs: [{ label: "Delivery", value: "Email, within minutes" }, { label: "Validity", value: "24 months" }] },
    { slug: "vellora-gift-card-50", name: "Vellora Moto Gift Card £50", price: 50, images: ["/media/page-gift-red.webp", "/media/page-gift-white.webp"], blurb: "A digital gift card delivered by email, redeemable online and in the showroom for 24 months.", sizes: ["One size"], colors: [], rating: 5, reviewCount: 41, specs: [{ label: "Delivery", value: "Email, within minutes" }, { label: "Validity", value: "24 months" }] },
    { slug: "vellora-gift-card-100", name: "Vellora Moto Gift Card £100", price: 100, images: ["/media/page-gift-red.webp", "/media/page-gift-white.webp"], blurb: "A digital gift card delivered by email, redeemable online and in the showroom for 24 months.", sizes: ["One size"], colors: [], rating: 5, reviewCount: 27, specs: [{ label: "Delivery", value: "Email, within minutes" }, { label: "Validity", value: "24 months" }] },
    { slug: "vellora-gift-card-250", name: "Vellora Moto Gift Card £250", price: 250, images: ["/media/page-gift-red.webp", "/media/page-gift-white.webp"], blurb: "A digital gift card delivered by email, redeemable online and in the showroom for 24 months.", sizes: ["One size"], colors: [], rating: 5, reviewCount: 9, specs: [{ label: "Delivery", value: "Email, within minutes" }, { label: "Validity", value: "24 months" }] },
    { slug: "vellora-1926-heritage-watch", name: "Vellora 1926 Heritage Watch", price: 249, images: ["/media/p-watch-minimal.webp"], blurb: "Minimal quartz watch with a leather strap and a century of heritage.", colors: [{ name: "Brown", hex: "#6b4226" }], isNew: true, badge: "Limited", stock: 6, rating: 4.7, reviewCount: 13 },
  ],
  exhausts: [
    { slug: "silencers-96482321aa", name: "Silencers - 96482321AA", price: 1432.08, compareAt: 2000, badge: "Sale", images: ["/media/exhaust-silencers.webp"], blurb: "Corsa carbon silencers for the Fulmine V4.", bikes: ["fulmine"], rating: 4.8, reviewCount: 32 },
    { slug: "orizzonte-v4-silencer-96481772da", name: "Orizzonte V4 Silencer - 96481772DA", price: 46.8, compareAt: 78, badge: "Sale", images: ["/media/exhaust-orizzonte.webp"], blurb: "Titanio titanium slip-on for the Orizzonte V4.", bikes: ["orizzonte"], rating: 4.7, reviewCount: 18 },
    { slug: "vellora-racing-silencers", name: "Vellora Racing Silencers", price: 46.8, compareAt: 78, badge: "Sale", images: ["/media/exhaust-racing-silencers.webp"], blurb: "Twin racing silencers in brushed titanium.", bikes: ["rombo", "fulmine"], rating: 4.6, reviewCount: 11 },
    { slug: "titanio-racing-exhaust-set", name: "Titanio Racing Exhaust Set - Fe", price: 46.8, compareAt: 78, badge: "Sale", images: ["/media/exhaust-titanium.webp"], blurb: "Full titanium racing system with carbon heat shield.", bikes: ["fulmine", "rombo"], rating: 4.9, reviewCount: 9 },
    { slug: "titanio-slip-on", name: "Titanio Slip-On", price: 1149, images: ["/media/p-exhaust-wheel.webp"], blurb: "Road-legal slip-on with carbon end cap for Bestia and Sabbia.", bikes: ["bestia", "sabbia"], isNew: true, badge: "New", rating: 4.8, reviewCount: 14 },
  ],
  performance: [
    { slug: "monobloc-race-caliper-kit", name: "Monobloc Race Caliper Kit", price: 899, images: ["/media/p-brake-caliper-purple.webp"], blurb: "Lighter, stiffer monobloc calipers with improved cooling.", bikes: ["fulmine", "rombo", "bestia"], rating: 4.9, reviewCount: 27 },
    { slug: "vellora-racing-ttx-rear-shock", name: "Vellora Racing TTX Rear Shock", price: 1349, images: ["/media/p-shock-gold.webp"], blurb: "Fully adjustable twin-tube rear shock.", bikes: ["fulmine", "rombo", "orizzonte"], badge: "Bestseller", rating: 4.9, reviewCount: 41 },
    { slug: "classic-chrome-rear-shocks", name: "Classic Chrome Rear Shocks", price: 499, images: ["/media/p-shock-chrome.webp"], blurb: "Chrome twin shocks with preload adjustment for classic builds.", bikes: ["sabbia"], rating: 4.5, reviewCount: 8 },
    { slug: "chain-sprocket-kit-520", name: "Chain & Sprocket Kit 520", price: 239, images: ["/media/p-chain-sprocket-kit.webp", "/media/p-chain-studio.webp"], blurb: "Complete 520 conversion kit — lighter and quicker to accelerate.", bikes: ["fulmine", "rombo", "bestia"], rating: 4.7, reviewCount: 36 },
    { slug: "gold-racing-chain", name: "Gold Racing Chain", price: 169, images: ["/media/p-chain-gold.webp"], blurb: "X-ring racing chain in gold anodised finish.", bikes: ALL_BIKES, rating: 4.6, reviewCount: 22 },
    { slug: "aluminium-rear-sprocket", name: "Aluminium Rear Sprocket", price: 89, images: ["/media/p-sprocket-blue.webp"], blurb: "7075 aluminium rear sprocket for quick gearing changes.", bikes: ["sabbia", "bestia"], rating: 4.5, reviewCount: 12 },
    { slug: "trackday-pro-rear-tyre", name: "Trackday Pro Rear Tyre 200/55", price: 219, images: ["/media/p-tyre-sport.webp", "/media/p-tyre-wheel.webp"], blurb: "Track-focused road tyre with a race compound shoulder.", bikes: ["fulmine", "rombo"], rating: 4.8, reviewCount: 54 },
    { slug: "bar-end-mirror-pair", name: "Bar-End Mirror Pair", price: 149, images: ["/media/p-mirror-bar-end.webp"], blurb: "CNC-machined bar-end mirrors for a cleaner cockpit.", bikes: ["bestia", "rombo", "sabbia"], rating: 4.4, reviewCount: 19 },
    { slug: "retro-chrome-mirror", name: "Retro Chrome Mirror", price: 69, images: ["/media/p-mirror-bar-end.webp"], blurb: "Round chrome mirror for a classic look.", bikes: ["sabbia"], rating: 4.3, reviewCount: 7 },
    { slug: "billet-fuel-cap", name: "Billet Fuel Cap", price: 129, images: ["/media/p-fuel-cap.webp"], blurb: "Machined aluminium fuel cap with a push-lock mechanism.", bikes: ALL_BIKES, rating: 4.6, reviewCount: 23, stock: 0 },
  ],
  touring: [
    { slug: "sabbia-leather-side-bag", name: "Sabbia Leather Side Bag", price: 199, images: ["/media/p-saddlebag-leather.webp"], blurb: "Waxed leather side bag with quick-release mounts.", bikes: ["sabbia", "bestia"], rating: 4.6, reviewCount: 21 },
    { slug: "orizzonte-aluminium-panniers", name: "Orizzonte Aluminium Panniers", price: 1099, images: ["/media/p-panniers-adventure.webp", "/media/ebike-hill.webp"], blurb: "Lockable aluminium side cases for adventure touring.", bikes: ["orizzonte"], badge: "Bestseller", rating: 4.8, reviewCount: 46 },
    { slug: "vellora-phone-mount-pro", name: "Vellora Phone Mount Pro", price: 79, images: ["/media/p-phone-mount-hand.webp"], blurb: "Vibration-damped phone mount with one-hand lock.", bikes: ALL_BIKES, rating: 4.5, reviewCount: 88 },
    { slug: "handlebar-navigation-mount", name: "Handlebar Navigation Mount", price: 69, images: ["/media/p-phone-mount-nav.webp"], blurb: "Clamp-on mount for sat-navs and phones.", bikes: ALL_BIKES, rating: 4.4, reviewCount: 31 },
    { slug: "quick-lock-phone-mount", name: "Quick-Lock Phone Mount", price: 59, images: ["/media/p-phone-mount-studio.webp"], blurb: "Stem-mounted quick-lock mount with wireless charging.", bikes: ALL_BIKES, isNew: true, badge: "New", rating: 4.6, reviewCount: 10 },
    { slug: "vellora-indoor-bike-cover", name: "Vellora Indoor Bike Cover", price: 119, images: ["/media/p-cover-cruiser.webp"], blurb: "Soft stretch cover with the Vellora logo for garage storage.", bikes: ALL_BIKES, rating: 4.7, reviewCount: 57 },
    { slug: "vellora-outdoor-bike-cover", name: "Vellora Outdoor Bike Cover", price: 99, images: ["/media/p-cover-silver.webp"], blurb: "Waterproof outdoor cover with heat-resistant panels.", bikes: ALL_BIKES, rating: 4.4, reviewCount: 34 },
  ],
  ebikes: [
    { slug: "vellora-mig-s-emtb", name: "Vellora MIG-S eMTB", price: 5499, images: ["/media/ebike-emtb-red.webp", "/media/ebike-rider-red.webp"], blurb: "All-mountain eMTB with mixed wheels and 150 mm of travel.", colors: [RED], badge: "Bestseller", rating: 4.8, reviewCount: 34 },
    { slug: "vellora-tk-01rr-enduro-emtb", name: "Vellora TK-01RR Enduro eMTB", price: 6999, images: ["/media/ebike-mountain.webp", "/media/ebike-hill.webp"], blurb: "Enduro-ready eMTB with 170 mm travel and a 720 Wh battery.", colors: [{ name: "Vellora Grey", hex: "#4a4f55" }], isNew: true, badge: "New", rating: 4.9, reviewCount: 12 },
    { slug: "sabbia-e-fat", name: "Sabbia e-Fat", price: 3299, images: ["/media/ebike-fat-red.webp", "/media/ebike-fat-rock.webp"], blurb: "Fat-tyre e-bike with Sabbia DNA for beach and gravel.", colors: [BLACK], rating: 4.6, reviewCount: 18 },
    { slug: "sabbia-e-trail", name: "Sabbia e-Trail", price: 3799, images: ["/media/ebike-trail.webp", "/media/ebike-fat-rock.webp"], blurb: "Moto-style e-bike with a long seat and full suspension.", colors: [WHITE], rating: 4.5, reviewCount: 9 },
    { slug: "vellora-urban-e-city", name: "Vellora Urban-e City", price: 2799, compareAt: 3199, badge: "Sale", images: ["/media/ebike-city-white.webp", "/media/ebike-urban.webp"], blurb: "Step-through city e-bike with integrated lights and rack.", colors: [WHITE], rating: 4.4, reviewCount: 21 },
    { slug: "vellora-futa-gravel-e-bike", name: "Vellora Futa Gravel e-Bike", price: 4499, images: ["/media/ebike-hill.webp", "/media/ebike-urban.webp"], blurb: "Lightweight gravel e-bike for long days on mixed terrain.", colors: [GREY], stock: 2, rating: 4.7, reviewCount: 6 },
  ],
}

/* ---------------- Build the catalog ---------------- */

function hash(input: string) {
  let h = 0
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0
  return Math.abs(h)
}

let skuCounter = 1000

function build(category: CategorySlug, seed: Seed): Product {
  const d = defaults[category]
  const sku = `DS-${category.slice(0, 3).toUpperCase()}-${skuCounter++}`
  const h = hash(seed.slug)
  const created = new Date(Date.UTC(2026, 8, 20) - (seed.isNew ? h % 30 : 40 + (h % 400)) * 86_400_000)
  return {
    slug: seed.slug,
    sku,
    name: seed.name,
    category,
    price: seed.price,
    compareAt: seed.compareAt,
    badge: seed.badge,
    image: seed.images[0],
    images: seed.images,
    colors: seed.colors ?? [],
    sizes: seed.sizes ?? d.sizes,
    description: seed.description ?? [seed.blurb, d.intro],
    features: d.features,
    specs: [{ label: "SKU", value: sku }, ...(seed.specs ?? d.specs)],
    bikes: seed.bikes ?? d.bikes,
    gender: seed.gender ?? "unisex",
    rating: seed.rating ?? Math.round((4.2 + (h % 8) / 10) * 10) / 10,
    reviewCount: seed.reviewCount ?? 5 + (h % 90),
    stock: seed.stock ?? 8 + (h % 40),
    isNew: seed.isNew ?? false,
    createdAt: created.toISOString(),
  }
}

export const catalog: Product[] = (Object.keys(seeds) as CategorySlug[]).flatMap((category) =>
  seeds[category].map((seed) => build(category, seed))
)

const bySlug = new Map(catalog.map((p) => [p.slug, p]))

export function getProduct(slug: string) {
  return bySlug.get(slug)
}

export function productsBySlugs(slugs: string[]) {
  return slugs.map((slug) => bySlug.get(slug)).filter((p): p is Product => Boolean(p))
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug)
}

export function categoriesInDepartment(department: DepartmentSlug) {
  return categories.filter((c) => c.department === department)
}

export function productsInCategory(slug: CategorySlug) {
  return catalog.filter((p) => p.category === slug)
}

export function productsForBike(bike: BikeSlug) {
  return catalog.filter((p) => p.bikes.includes(bike))
}

/** Same category first, then products from the same department. */
export function relatedProducts(product: Product, limit = 8) {
  const department = getCategory(product.category)?.department
  const same = catalog.filter((p) => p.slug !== product.slug && p.category === product.category)
  const near = catalog.filter(
    (p) => p.slug !== product.slug && p.category !== product.category && getCategory(p.category)?.department === department
  )
  return [...same, ...near].slice(0, limit)
}

/** Products that complement the given one (e.g. gloves with a helmet). */
export function pairingsFor(product: Product, limit = 3) {
  const pairs: Partial<Record<CategorySlug, CategorySlug[]>> = {
    helmets: ["helmets", "gloves"],
    jackets: ["gloves", "boots"],
    suits: ["gloves", "boots"],
    gloves: ["jackets", "helmets"],
    boots: ["suits", "jackets"],
    hoodies: ["caps", "t-shirts"],
    "t-shirts": ["caps", "hoodies"],
    polos: ["caps", "lifestyle"],
    caps: ["t-shirts", "lifestyle"],
    bags: ["lifestyle", "caps"],
    lifestyle: ["caps", "bags"],
    exhausts: ["performance"],
    performance: ["performance", "touring"],
    touring: ["touring", "bags"],
    ebikes: ["helmets", "bags"],
  }
  const wanted = pairs[product.category] ?? []
  const isShield = (p: Product) => p.name.includes("Shield")
  const pool = catalog.filter(
    (p) => p.slug !== product.slug && wanted.includes(p.category) && p.stock > 0 && (product.category === "helmets" || !isShield(p))
  )
  // Visors first for helmets, then the rest in catalog order.
  return product.category === "helmets"
    ? pool.sort((x, y) => Number(isShield(y)) - Number(isShield(x))).slice(0, limit)
    : pool.slice(0, limit)
}




/** The fields a product card needs — keeps client payloads small. */
export type CardProduct = Pick<Product, "slug" | "name" | "image" | "price" | "compareAt" | "badge" | "stock"> & {
  images?: string[]
  colors?: { name: string; hex: string }[]
}

export function toCard(product: CardProduct | Product): CardProduct {
  return {
    slug: product.slug,
    name: product.name,
    image: product.image,
    images: product.images?.slice(0, 2),
    price: product.price,
    compareAt: product.compareAt,
    badge: product.badge,
    stock: product.stock,
    colors: product.colors?.map((c) => ({ name: c.name, hex: c.hex })),
  }
}

