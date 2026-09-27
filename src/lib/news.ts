export type Article = {
  slug: string
  date: string
  isoDate: string
  category: "Collections" | "Racing" | "Riding" | "Workshop"
  title: string
  excerpt: string
  image: string
  author: string
  readMinutes: number
  body: { heading?: string; text: string }[]
  related: string[]
}


export const articles: Article[] = [
  {
    slug: "new-2026-apparel-collection",
    date: "September 7, 2026",
    isoDate: "2026-09-07",
    category: "Collections",
    title: "New 2026 Apparel Collection",
    excerpt:
      "The Vellora Apparel 2026 collection has arrived  and you can shop the latest technical and lifestyle pieces online now at Vellora Moto.",
    image: "/media/news-apparel-2026.webp",
    author: "Vellora Moto UK",
    readMinutes: 4,
    body: [
      { text: "The Vellora Apparel 2026 collection has landed in store and online. Developed alongside Vellora Corse, the new range spans race-ready technical gear and a refreshed lifestyle line that takes the Valdoro look from the paddock to the street." },
      { heading: "Technical gear", text: "Headlining the collection is the new Corse V8 helmet, available in four finishes including the World GP-inspired graphic. It is joined by the Corse C5 leather jacket, V6 race boots and C5 racing gloves — each tested on track by Vellora riders before going into production." },
      { heading: "Lifestyle", text: "Off the bike, the Explorer and Essential hoodies return in new colourways, alongside organic cotton tees marking a century of Vellora with the 1926 Heritage graphic. Caps, polos and leather accessories complete the range." },
      { heading: "Available now", text: "The full 2026 collection is available now with free UK delivery on orders over £100. Visit the showroom to try on helmets and leathers with our fitting specialists." },
    ],
    related: ["vellora-corse-v8-helmet", "track-day-season-2026-dates-announced"],
  },
  {
    slug: "vellora-corse-v8-helmet",
    date: "September 6, 2026",
    isoDate: "2026-09-06",
    category: "Racing",
    title: "Vellora Corse V8 Helmet",
    excerpt:
      "Luca Ferri has secured the 2025 World GP championship, at the Grand Prix of Japan. The famous #33 takes his seventh crown in World GP.",
    image: "/media/news-champions.webp",
    author: "Racing Desk",
    readMinutes: 3,
    body: [
      { text: "Luca Ferri has secured the 2025 World GP championship at the Grand Prix of Japan. The famous #33 takes his seventh crown in the premier class — and the Vellora factory celebrated in style." },
      { heading: "A season to remember", text: "Consistency, race craft and a Vellora GP racer that worked everywhere proved the winning formula. The title caps a remarkable run for the Valdoro factory in the premier class." },
      { heading: "Celebrate with the Corse V8", text: "To mark the championship, the Corse V8 helmet is available in its race graphic. Its carbon composite shell, wind-tunnel-tuned spoiler and Class 1 optics bring World GP technology to your own track days." },
    ],
    related: ["new-2026-apparel-collection", "matteo-ricci-official-merchandise"],
  },
  {
    slug: "matteo-ricci-official-merchandise",
    date: "September 5, 2026",
    isoDate: "2026-09-05",
    category: "Racing",
    title: "Matteo Ricci Official Merchandise",
    excerpt:
      "Discover the official Vellora clothing & merchandise dedicated to the Italian World GP rider Matteo Ricci. Team replica T-shirts, Polos, Jackets, Hoodies, and more.",
    image: "/media/news-rider.webp",
    author: "Vellora Moto UK",
    readMinutes: 2,
    body: [
      { text: "Discover the official Vellora clothing and merchandise dedicated to Italian World GP rider Matteo Ricci. The collection includes team replica T-shirts, polos, jackets and hoodies in the Vellora Factory Team colours." },
      { heading: "Team replica", text: "The 2026 team replica softshell features the sponsor logos worn in the paddock, a water-repellent finish and a soft-touch lining." },
      { heading: "Limited quantities", text: "Rider collections are produced in limited runs each season — once they are gone, they are gone." },
    ],
    related: ["vellora-corse-v8-helmet", "world-gp-25-sole-polo-shirt"],
  },
  {
    slug: "world-gp-25-sole-polo-shirt",
    date: "September 4, 2026",
    isoDate: "2026-09-04",
    category: "Collections",
    title: "World GP 25 Sole Polo Shirt",
    excerpt:
      "During the Autodromo del Sole race weekend, the World GP bike in the official Vellora Factory Team, will show a special colour version graphic for the Sunday’s Warm up and World GP race. ",
    image: "/media/news-heritage.webp",
    author: "Vellora Moto UK",
    readMinutes: 2,
    body: [
      { text: "During the Autodromo del Sole race weekend, the World GP bikes of the official Vellora Factory Team carried a special colour version for the Sunday warm-up and race. The one-off livery inspired a limited-edition polo shirt." },
      { heading: "The Autodromo del Sole polo", text: "Cut from technical piqué with moisture-wicking yarns, the polo carries the Autodromo del Sole graphic on the sleeve and the team logos on the chest." },
    ],
    related: ["matteo-ricci-official-merchandise", "new-2026-apparel-collection"],
  },
  {
    slug: "track-day-season-2026-dates-announced",
    date: "September 3, 2026",
    isoDate: "2026-09-03",
    category: "Riding",
    title: "Track Day Season 2026 Dates Announced",
    excerpt:
      "Donington, Brands Hatch and Silverstone are all on the calendar. Book early — Vellora owners get priority slots and free tyre-warmer hire.",
    image: "/media/news-track-day.webp",
    author: "Experiences Team",
    readMinutes: 5,
    body: [
      { text: "Our 2026 track day calendar is live. We're returning to Donington Park, Brands Hatch Indy and Silverstone National, with a new date at Cadwell Park for riders who love elevation changes." },
      { heading: "Who can ride", text: "Sessions are split into novice, intermediate and fast groups. Every group has ACU-qualified instructors on hand, and novice riders get a sighting lap and classroom briefing." },
      { heading: "Vellora owner benefits", text: "Vellora owners get priority booking, free tyre-warmer hire and discounted Trackday Pro tyres fitted trackside by our technicians." },
      { heading: "What to bring", text: "One-piece or zip-together leathers, a race or sport helmet, gloves and boots are mandatory. Hire leathers are available on request." },
    ],
    related: ["winter-touring-riding-the-alps-on-a-orizzonte", "workshop-tips-prepping-your-bike-for-winter"],
  },
  {
    slug: "winter-touring-riding-the-alps-on-a-orizzonte",
    date: "September 2, 2026",
    isoDate: "2026-09-02",
    category: "Riding",
    title: "Winter Touring: Riding the Alps on a Orizzonte",
    excerpt:
      "Snow on the passes, sun on the visor. Our team shares the layering, heated kit and luggage that kept them comfortable above 2,000 metres.",
    image: "/media/news-alps-tour.webp",
    author: "Elena Petrova",
    readMinutes: 6,
    body: [
      { text: "Snow on the passes, sun on the visor. Three of our team took Orizzontes across the Alps in early spring — here is what kept them comfortable above 2,000 metres." },
      { heading: "Layer up", text: "A thin merino base layer, a heated mid-layer and a waterproof textile shell gave the most flexibility. Venting matters as much as warmth when the sun comes out." },
      { heading: "Hands and feet", text: "Heated gloves on the highest passes, waterproof touring boots throughout. Cold hands mean slow reactions." },
      { heading: "Luggage", text: "Aluminium panniers held the camera kit and spares, while a roll-top backpack kept essentials within reach at fuel stops." },
    ],
    related: ["track-day-season-2026-dates-announced", "street-nights-rombo-v4-gear-guide"],
  },
  {
    slug: "street-nights-rombo-v4-gear-guide",
    date: "September 1, 2026",
    isoDate: "2026-09-01",
    category: "Riding",
    title: "Street Nights: Rombo V4 Gear Guide",
    excerpt:
      "Lightweight leathers, high-visibility details and helmets built for the city after dark — everything you need for late-night urban rides.",
    image: "/media/news-rombo-city.webp",
    author: "Omar Haddad",
    readMinutes: 4,
    body: [
      { text: "The Rombo V4 comes alive after dark. Here is the kit we recommend for urban night rides." },
      { heading: "Be seen", text: "Reflective piping and panels make a real difference under street lights. Look for jackets with reflective details on the back and arms." },
      { heading: "Clear vision", text: "A clear visor with anti-fog insert beats a tinted one at night every time — carry the dark shield for the ride home at sunrise." },
      { heading: "Walkable boots", text: "Short urban boots let you walk into the café without looking like you just stepped off a race track." },
    ],
    related: ["winter-touring-riding-the-alps-on-a-orizzonte", "new-2026-apparel-collection"],
  },
  {
    slug: "workshop-tips-prepping-your-bike-for-winter",
    date: "August 30, 2026",
    isoDate: "2026-08-30",
    category: "Workshop",
    title: "Workshop Tips: Prepping Your Bike for Winter",
    excerpt:
      "Battery tenders, fuel stabiliser and chain care. Our technicians walk through the checklist that keeps your Vellora ready for spring.",
    image: "/media/news-workshop.webp",
    author: "Service Department",
    readMinutes: 5,
    body: [
      { text: "Putting your Vellora away for winter? Our technicians share the checklist that keeps bikes ready for the first sunny weekend of spring." },
      { heading: "Battery", text: "Connect a smart battery tender. Lithium batteries in particular dislike being fully discharged." },
      { heading: "Fuel and oil", text: "Fill the tank and add a fuel stabiliser to prevent condensation. If an oil change is due soon, do it before storage so old oil doesn't sit in the engine." },
      { heading: "Chain and tyres", text: "Clean and lube the chain, inflate tyres to the correct pressure and use paddock stands to keep weight off them." },
      { heading: "Cover it", text: "A breathable indoor cover keeps dust off without trapping moisture. Book a spring service with us and we'll collect it for you." },
    ],
    related: ["track-day-season-2026-dates-announced", "winter-touring-riding-the-alps-on-a-orizzonte"],
  },
]

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug)
}
