import type { BikeSlug } from "@/lib/catalog"

export type Bike = {
  slug: BikeSlug
  name: string
  family: string
  tagline: string
  intro: string
  story: string[]
  hero: string
  card: string
  cardPosition: string
  gallery: string[]
  figures: { label: string; value: string }[]
  highlights: { title: string; text: string }[]
}


export const bikes: Bike[] = [
  {
    slug: "fulmine",
    name: "Fulmine",
    family: "Superbike",
    tagline: "The purest expression of Vellora racing DNA.",
    intro:
      "Born from World GP and World Superbike, the Fulmine is the benchmark superbike — a V4 engine derived from our GP racer, aerodynamic winglets and electronics tuned by Vellora Corse.",
    story: [
      "Every Fulmine is assembled in Valdoro, the Bologna district the bike is named after. It carries lessons learned on the world's circuits straight to the road: counter-rotating crankshaft, cornering ABS and a chassis designed around the engine.",
      "Whether it is a first track day or a season of club racing, we stock the helmets, leathers, exhausts and performance parts to match.",
    ],
    hero: "/media/bike-fulmine-1.webp",
    card: "/media/bike-fulmine-1.webp",
    cardPosition: "50% 55%",
    gallery: ["/media/bike-fulmine-2.webp", "/media/bike-fulmine-3.webp", "/media/bike-fulmine-5.webp", "/media/bike-fulmine-6.webp", "/media/bike-fulmine-7.webp", "/media/bike-fulmine-8.webp", "/media/page-rider-fulmine-red.webp", "/media/hero-fulmine-night.webp"],
    figures: [
      { label: "Engine", value: "1,103 cc Tempesta V4" },
      { label: "Power", value: "215.5 hp" },
      { label: "Torque", value: "123.6 Nm" },
      { label: "Dry weight", value: "≈ 175 kg" },
    ],
    highlights: [
      { title: "World GP aerodynamics", text: "Biplane winglets generate downforce for stability under hard acceleration." },
      { title: "Race electronics", text: "Cornering ABS, slide control and quickshifter calibrated by Vellora Corse." },
      { title: "Track-ready gear", text: "Pair it with Corse leathers, race boots and a Aero helmet." },
    ],
  },
  {
    slug: "rombo",
    name: "Rombo",
    family: "Naked superbike",
    tagline: "A Fulmine stripped of its fairing — and its inhibitions.",
    intro:
      "The Rombo takes the Fulmine's engine and chassis, adds wide bars and 'biplane' wings, and turns every ride into an event.",
    story: [
      "Fight formula: superbike performance with an upright riding position and a naked, aggressive stance. It is as happy carving mountain passes as it is lighting up city streets at night.",
      "Riders choose the Rombo for its character — and we have the exhausts, mirrors and lightweight leathers to amplify it.",
    ],
    hero: "/media/bike-rombo-1.webp",
    card: "/media/bike-rombo-1.webp",
    cardPosition: "50% 60%",
    gallery: ["/media/bike-rombo-2.webp", "/media/bike-rombo-3.webp", "/media/bike-rombo-4.webp", "/media/news-rombo-city.webp", "/media/gallery-rombo.webp", "/media/story-omar.webp"],
    figures: [
      { label: "Engine", value: "1,103 cc Tempesta V4" },
      { label: "Power", value: "208 hp" },
      { label: "Torque", value: "123 Nm" },
      { label: "Weight (kerb)", value: "≈ 199 kg" },
    ],
    highlights: [
      { title: "Biplane wings", text: "Downforce usually reserved for fully-faired superbikes." },
      { title: "Wide bars", text: "Leverage and comfort for aggressive riding on real roads." },
      { title: "Urban kit", text: "Short gloves, riding shoes and bar-end mirrors built for city nights." },
    ],
  },
  {
    slug: "bestia",
    name: "Bestia",
    family: "Naked icon",
    tagline: "The original naked bike, lighter and more fun than ever.",
    intro:
      "Since 1993 the Bestia has defined the naked motorcycle. Today's model is lighter, more agile and packed with rider aids — without losing the essence: engine, tank, two wheels.",
    story: [
      "The Bestia is the gateway to the Vellora world for many riders. Its Corsa twin delivers usable torque everywhere, and its low seat makes it approachable for all.",
      "From heritage leather to everyday tees, Bestia riders have their own style — explore it below.",
    ],
    hero: "/media/bike-bestia-1.webp",
    card: "/media/bike-bestia-1.webp",
    cardPosition: "50% 60%",
    gallery: ["/media/bike-bestia-2.webp", "/media/bike-bestia-3.webp", "/media/bike-bestia-4.webp", "/media/bike-bestia-6.webp", "/media/hero-bestia-ride.webp", "/media/gallery-bestia-mono.webp"],
    figures: [
      { label: "Engine", value: "937 cc Corsa twin" },
      { label: "Power", value: "111 hp" },
      { label: "Torque", value: "93 Nm" },
      { label: "Weight (dry)", value: "≈ 166 kg" },
    ],
    highlights: [
      { title: "Lightweight frame", text: "A front frame derived from the Fulmine saves weight and sharpens handling." },
      { title: "Rider aids", text: "Cornering ABS, traction control and wheelie control as standard." },
      { title: "Everyday style", text: "Heritage jackets and urban boots that work on and off the bike." },
    ],
  },
  {
    slug: "orizzonte",
    name: "Orizzonte",
    family: "Adventure touring",
    tagline: "Four bikes in one: sport, touring, urban and enduro.",
    intro:
      "The Orizzonte is built for riders who want to go anywhere. Radar-assisted cruise control, semi-active suspension and a V4 Viaggio engine make long distances effortless.",
    story: [
      "Alpine passes in the morning, motorways in the afternoon, gravel roads by evening — the Orizzonte adapts with riding modes and adjustable ergonomics.",
      "Aluminium panniers, touring boots and roll-top bags complete the kit for your next big trip.",
    ],
    hero: "/media/story-elena.webp",
    card: "/media/bike-orizzonte-1.webp",
    cardPosition: "50% 62%",
    gallery: ["/media/bike-orizzonte-1.webp", "/media/bike-orizzonte-2.webp", "/media/bike-orizzonte-3.webp", "/media/bike-orizzonte-4.webp", "/media/bike-orizzonte-5.webp", "/media/news-alps-tour.webp"],
    figures: [
      { label: "Engine", value: "1,158 cc V4 Viaggio" },
      { label: "Power", value: "170 hp" },
      { label: "Torque", value: "125 Nm" },
      { label: "Service interval", value: "60,000 km valve check" },
    ],
    highlights: [
      { title: "Radar technology", text: "Adaptive cruise control and blind-spot detection for relaxed long miles." },
      { title: "Skyhook suspension", text: "Semi-active damping that adapts to the road in milliseconds." },
      { title: "Touring kit", text: "Panniers, navigation mounts and waterproof boots, ready for departure." },
    ],
  },
  {
    slug: "sabbia",
    name: "Sabbia",
    family: "Free Spirit",
    tagline: "Pure fun, pure freedom, pure Vellora.",
    intro:
      "The Sabbia Vellora is a state of mind: essential, accessible and endlessly customisable. It's the bike for riders who ride just for the joy of it.",
    story: [
      "Inspired by the 1962 original, today's Sabbia pairs a friendly air-cooled twin with modern electronics and a playful, upright riding position.",
      "Yellow tanks, tan leather and desert sleds — the Sabbia look extends to everything we stock for it.",
    ],
    hero: "/media/bike-sabbia-1.webp",
    card: "/media/bike-sabbia-1.webp",
    cardPosition: "50% 60%",
    gallery: ["/media/bike-sabbia-2.webp", "/media/bike-sabbia-3.webp", "/media/bike-sabbia-4.webp", "/media/bike-sabbia-5.webp", "/media/bike-sabbia-7.webp", "/media/hero-sabbia-sunset.webp", "/media/gallery-sabbia-yellow.webp"],
    figures: [
      { label: "Engine", value: "803 cc L-twin, air-cooled" },
      { label: "Power", value: "73 hp" },
      { label: "Torque", value: "65.2 Nm" },
      { label: "Seat height", value: "795 mm" },
    ],
    highlights: [
      { title: "Customisable", text: "Hundreds of accessories to make every Sabbia unique." },
      { title: "Approachable", text: "Low seat, light clutch and friendly power for new and experienced riders." },
      { title: "Free Spirit style", text: "Tan gloves, heritage helmets and yellow caps for the full look." },
    ],
  },
  {
    slug: "notturno",
    name: "Notturno",
    family: "Power cruiser",
    tagline: "Muscle, style and a V4 heart.",
    intro:
      "The Notturno breaks the rules of the cruiser: a 168 hp V4, sportbike handling and unmistakable design with its massive rear tyre and signature lights.",
    story: [
      "Comfortable for two, fast enough to embarrass sportbikes and styled to turn heads — the Notturno is in a category of its own.",
      "Touring boots, leather side bags and premium covers keep your Notturno looking its best.",
    ],
    hero: "/media/bike-notturno-1.webp",
    card: "/media/bike-notturno-1.webp",
    cardPosition: "50% 50%",
    gallery: ["/media/bike-notturno-2.webp", "/media/bike-notturno-3.webp", "/media/bike-notturno-1.webp"],
    figures: [
      { label: "Engine", value: "1,158 cc V4 Viaggio" },
      { label: "Power", value: "168 hp" },
      { label: "Torque", value: "126 Nm" },
      { label: "Rear tyre", value: "240/45 ZR17" },
    ],
    highlights: [
      { title: "V4 Viaggio", text: "Cylinder deactivation for smooth low-speed manners." },
      { title: "Sport handling", text: "Monobloc race brakes and a sporty lean angle for a cruiser." },
      { title: "Premium touring", text: "Leather side bags and indoor covers made for the Notturno." },
    ],
  },
]

export function getBike(slug: string) {
  return bikes.find((b) => b.slug === slug)
}
