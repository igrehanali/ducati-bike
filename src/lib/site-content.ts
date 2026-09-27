/* Static site content used by client components (header, hero, home sections). Keep this free of catalog imports. */

export const announcements = [
  "Bundle your favorites & save up to 20%",
  "Free UK delivery on orders over £100",
  "Vellora Dealer of the Year 2024, 2023, 2021, 2020",
  "Safe secure checkout guaranteed",
]

export type NavItem = {
  label: string
  href: string
  children?: { label: string; href: string }[]
  feature?: { image: string; label: string; href: string }
}

export const navigation: NavItem[] = [
  {
    label: "Riding Wear",
    href: "/shop/riding-wear",
    children: [
      { label: "Helmets", href: "/shop/helmets" },
      { label: "Jackets", href: "/shop/jackets" },
      { label: "Race Suits", href: "/shop/suits" },
      { label: "Gloves", href: "/shop/gloves" },
      { label: "Boots", href: "/shop/boots" },
      { label: "Shop all riding wear", href: "/shop/riding-wear" },
    ],
    feature: { image: "/media/menu-riding-wear.webp", label: "Built for every ride", href: "/shop/riding-wear" },
  },
  {
    label: "Casual Wear & Merchandise",
    href: "/shop/casual-wear",
    children: [
      { label: "Sweatshirts & Hoodies", href: "/shop/hoodies" },
      { label: "T-Shirts", href: "/shop/t-shirts" },
      { label: "Polos & Shirts", href: "/shop/polos" },
      { label: "Caps & Hats", href: "/shop/caps" },
      { label: "Bags & Backpacks", href: "/shop/bags" },
      { label: "Lifestyle Accessories", href: "/shop/lifestyle" },
    ],
    feature: { image: "/media/menu-casual-wear.webp", label: "Off the bike, still Vellora", href: "/shop/casual-wear" },
  },
  {
    label: "Motorcycle Accessories",
    href: "/shop/accessories",
    children: [
      { label: "Exhausts", href: "/shop/exhausts" },
      { label: "Performance Parts", href: "/shop/performance" },
      { label: "Touring & Tech", href: "/shop/touring" },
      { label: "Shop by bike", href: "/bikes" },
    ],
    feature: { image: "/media/promo-workshop.webp", label: "Make it yours", href: "/shop/accessories" },
  },
  { label: "eBikes", href: "/ebikes" },
  { label: "New 2026 Collection", href: "/shop/new-2026" },
]

export const heroSlides = [
  {
    image: "/media/hero-rider.webp",
    alt: "Rider silhouetted between crossed light beams",
    title: "Ride.Perform. Live Vellora",
    description: "Premium riding gear and accessories crafted for those who live for the ride",
    href: "/shop/new-2026",
  },
  {
    image: "/media/hero-fulmine-night.webp",
    alt: "Rider on a sport bike in a light-trail tunnel at night",
    title: "Born on track. Built for the night.",
    description: "Race-bred helmets, leathers and gloves engineered for the Fulmine generation",
    href: "/bikes/fulmine",
  },
  {
    image: "/media/hero-bestia-ride.webp",
    alt: "Rider on a naked bike leaning through a bend",
    title: "Every road is a racetrack",
    description: "Protection, comfort and pure performance — riding wear for every mile",
    href: "/shop/riding-wear",
  },
  {
    image: "/media/hero-sabbia-sunset.webp",
    alt: "Rider silhouetted against a red sunset",
    title: "Sabbia. Free Spirit.",
    description: "Casual wear and merchandise for free spirits who ride just for the fun of it",
    href: "/bikes/sabbia",
  },
]

export const collections = [
  { name: "Helmet", image: "/media/collection-helmet.webp", href: "/shop/helmets" },
  { name: "Jacket", image: "/media/collection-jacket.webp", href: "/shop/jackets" },
  { name: "Boots", image: "/media/collection-boots.webp", href: "/shop/boots" },
  { name: "Gloves", image: "/media/p-gloves-tan-studio.webp", href: "/shop/gloves" },
  { name: "Visors", image: "/media/visor-iridium.webp", href: "/shop/helmets" },
  { name: "Hoodies", image: "/media/hoodie-essential.webp", href: "/shop/hoodies" },
  { name: "Exhausts", image: "/media/exhaust-titanium.webp", href: "/shop/exhausts" },
]

export const stories = [
  {
    name: "James Carter",
    image: "/media/story-james.webp",
    quote:
      "“I’d been looking for genuine Vellora gear for a while and found everything I needed here. Super easy ordering process, great quality, and it arrived faster than I expected.”",
  },
  {
    name: "Daniel Brooks",
    image: "/media/story-daniel.webp",
    quote:
      "“I knew what I wanted, found it quickly, and the whole checkout process was easy. My order arrived well packed and sooner than I expected. Really happy with it.”",
  },
  {
    name: "Ryan Cooper",
    image: "/media/story-ryan.webp",
    quote:
      "“I wasn’t sure which size to go for, so I got in touch before ordering. They gave me really useful advice, and when the jacket arrived, the fit was spot on.”",
  },
  {
    name: "Alex Morgan",
    image: "/media/story-alex.webp",
    quote:
      "“What I like most is the attention to detail. The branding, materials and finish all feel considered—it doesn’t just feel like another piece of branded merchandise.”",
  },
  {
    name: "Luca Romano",
    image: "/media/story-luca.webp",
    quote:
      "“Track days are my therapy. The leathers I picked up here have done three seasons of knee-down laps and still fit like day one.”",
  },
  {
    name: "Elena Petrova",
    image: "/media/story-elena.webp",
    quote:
      "“Took the Orizzonte up the coast in January. A proper textile jacket and heated gloves made all the difference.”",
  },
  {
    name: "Omar Haddad",
    image: "/media/story-omar.webp",
    quote:
      "“Night rides through the city are where I feel most alive. The team helped me find a helmet that’s quiet, light and sharp on the visor.”",
  },
  {
    name: "Sofia Marchetti",
    image: "/media/story-sofia.webp",
    quote:
      "“From the garage to the canyon roads, everything I wear on the bike came from here. Quick delivery and genuine kit every time.”",
  },
]
