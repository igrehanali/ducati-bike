import { getCategory, type Product } from "@/lib/catalog"

export type Review = {
  id: string
  author: string
  rating: number
  daysAgo: number
  title?: string
  body: string
  image?: string
  verified: boolean
}

export type ReviewSummary = {
  average: number
  total: number
  breakdown: { stars: number; count: number }[]
}

const DESIGNED_PRODUCT = "veloce-5-perforated-leather-motorcycle-jacket-men"

// The reviews shown in the Figma product page.
const designedReviews: Review[] = [
  { id: "d1", author: "Denise T.", rating: 5, daysAgo: 1, verified: true, body: "Really impressed with the quality and comfort. It offers great protection while still feeling lightweight and easy to wear." },
  { id: "d2", author: "Denise T.", rating: 5, daysAgo: 2, verified: true, body: "The quality is excellent and the jacket feels great on the road.It offers a solid balance of protection, comfort, and mobility. A great choice for everyday riding and longer adventures.", image: "/media/review-jacket.webp" },
  { id: "d3", author: "Denise T.", rating: 5, daysAgo: 5, verified: true, body: "Really impressed with the quality and comfort. It offers great protection while still feeling lightweight and easy to wear." },
  { id: "d4", author: "Denise T.", rating: 5, daysAgo: 8, verified: true, body: "The quality is excellent and the jacket feels great on the road. A great choice for everyday riding and longer adventures." },
  { id: "d5", author: "Denise T.", rating: 4, daysAgo: 12, verified: true, body: "Really impressed with the quality and comfort. It offers great protection while still feeling lightweight and easy to wear." },
]

const designedSummary: ReviewSummary = {
  average: 5.0,
  total: 30,
  breakdown: [
    { stars: 5, count: 167 },
    { stars: 4, count: 30 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ],
}

const AUTHORS = ["James C.", "Priya S.", "Tom W.", "Aisha K.", "Marco R.", "Hannah L.", "Oliver B.", "Sofia M.", "Callum D.", "Grace H.", "Ethan P.", "Chloe N.", "Luca R.", "Ben T.", "Zara A."]

const POOLS: Record<string, { title: string; body: string; rating: number }[]> = {
  "riding-wear": [
    { rating: 5, title: "Fits like it was made for me", body: "Sizing was spot on using the size guide. Comfortable from the first ride and the protection feels reassuring at speed." },
    { rating: 5, title: "Worth every penny", body: "Quality is a step above anything I've owned. Stitching, armour and finish are all excellent." },
    { rating: 4, title: "Great, runs slightly small", body: "Really happy with it, but I'd go one size up if you're between sizes. Customer service helped me swap quickly." },
    { rating: 5, title: "Track tested", body: "Used it for three track days at Donington already. No pressure points, great airflow and it still looks new." },
    { rating: 4, title: "Comfortable on long rides", body: "Did a 300-mile day in it without any discomfort. Venting could be a touch better in high summer." },
    { rating: 5, title: "Quick delivery", body: "Ordered Tuesday, arrived Wednesday. Well packed and exactly as pictured." },
    { rating: 3, title: "Good but stiff at first", body: "Took a few rides to break in. Now it's fine, but out of the box it was quite stiff." },
  ],
  "casual-wear": [
    { rating: 5, title: "Lovely quality", body: "Soft, heavy fabric and the print looks premium. Wears well after plenty of washes." },
    { rating: 5, title: "Great gift", body: "Bought this for my partner who rides a Sabbia — they love it and wear it all the time." },
    { rating: 4, title: "True to size", body: "Regular fit as described. Colour is slightly deeper than in the photos, which I actually prefer." },
    { rating: 5, title: "My go-to", body: "I've bought three now. Comfortable, stylish and it gets comments at every bike meet." },
    { rating: 4, title: "Nice details", body: "Embroidery and finishing are well done. Delivery was fast too." },
    { rating: 3, title: "Decent", body: "Good quality overall but I expected it to be a little thicker for the price." },
  ],
  accessories: [
    { rating: 5, title: "Perfect fit on my bike", body: "Bolted straight on with no modifications. Instructions were clear and the finish is superb." },
    { rating: 5, title: "Transforms the bike", body: "The difference is immediately noticeable. Wish I'd done this upgrade sooner." },
    { rating: 4, title: "Great part, fitted by the workshop", body: "Had the service team fit it during my annual service. Quick and professional." },
    { rating: 5, title: "Genuine quality", body: "You can tell it's properly engineered. Packaging was excellent too." },
    { rating: 4, title: "Happy", body: "Does exactly what it should. A bit pricey but you get what you pay for." },
  ],
  ebikes: [
    { rating: 5, title: "Incredible on the trails", body: "The motor is smooth and the battery lasts all day. Climbs I used to walk are now easy." },
    { rating: 5, title: "Built like a Vellora", body: "Finish, components and geometry are all top-tier. Handles like a proper mountain bike." },
    { rating: 4, title: "Heavy but brilliant", body: "It's not light to lift into the van, but once you're riding you forget all about it." },
    { rating: 5, title: "Commute transformed", body: "I now cycle to work every day instead of driving. Arrive without breaking a sweat." },
  ],
}

function hash(input: string) {
  let h = 0
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function reviewsFor(product: Product): { summary: ReviewSummary; reviews: Review[] } {
  if (product.slug === DESIGNED_PRODUCT) return { summary: designedSummary, reviews: designedReviews }

  const department = getCategory(product.category)?.department ?? "casual-wear"
  const pool = POOLS[department] ?? POOLS["casual-wear"]
  const seed = hash(product.slug)
  const count = Math.min(pool.length, 3 + (seed % 4))
  const reviews: Review[] = Array.from({ length: count }, (_, i) => {
    const entry = pool[(seed + i * 3) % pool.length]
    return {
      id: `${product.slug}-${i}`,
      author: AUTHORS[(seed + i * 7) % AUTHORS.length],
      rating: entry.rating,
      daysAgo: 1 + ((seed >> (i + 1)) % 40) + i * 6,
      title: entry.title,
      body: entry.body,
      verified: (seed + i) % 5 !== 0,
    }
  })

  // Spread the product's review count across stars so the bars match its rating.
  const total = product.reviewCount
  const five = Math.round(total * Math.min(0.92, Math.max(0.35, (product.rating - 3.6) / 1.4)))
  const four = Math.round((total - five) * 0.7)
  const three = Math.round((total - five - four) * 0.6)
  const two = Math.round((total - five - four - three) * 0.6)
  const one = Math.max(0, total - five - four - three - two)
  return {
    summary: {
      average: product.rating,
      total,
      breakdown: [
        { stars: 5, count: five },
        { stars: 4, count: four },
        { stars: 3, count: three },
        { stars: 2, count: two },
        { stars: 1, count: one },
      ],
    },
    reviews,
  }
}
