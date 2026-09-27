/* Track days, service packages and gift card demo data shared by pages and server actions. */

export type TrackDay = {
  id: string
  circuit: string
  location: string
  date: string
  isoDate: string
  price: number
  spacesLeft: number
  image: string
  lengthMiles: number
}


export const trackDays: TrackDay[] = [
  { id: "donington-2026-10-10", circuit: "Donington Park GP", location: "Derby, Leicestershire", date: "Sat 10 October 2026", isoDate: "2026-10-10", price: 219, spacesLeft: 14, image: "/media/page-track-aerial-sunset.webp", lengthMiles: 2.49 },
  { id: "brands-2026-10-24", circuit: "Brands Hatch Indy", location: "West Kingsdown, Kent", date: "Sat 24 October 2026", isoDate: "2026-10-24", price: 199, spacesLeft: 6, image: "/media/page-track-aerial-clouds.webp", lengthMiles: 1.2 },
  { id: "silverstone-2027-03-21", circuit: "Silverstone National", location: "Towcester, Northamptonshire", date: "Sun 21 March 2027", isoDate: "2027-03-21", price: 249, spacesLeft: 22, image: "/media/page-track-aerial.webp", lengthMiles: 1.64 },
  { id: "cadwell-2027-04-18", circuit: "Cadwell Park", location: "Louth, Lincolnshire", date: "Sun 18 April 2027", isoDate: "2027-04-18", price: 229, spacesLeft: 0, image: "/media/page-track-circuit.webp", lengthMiles: 2.18 },
  { id: "snetterton-2027-05-09", circuit: "Snetterton 300", location: "Norwich, Norfolk", date: "Sun 9 May 2027", isoDate: "2027-05-09", price: 209, spacesLeft: 18, image: "/media/gallery-track-straight.webp", lengthMiles: 2.97 },
]

export const trackGroups = [
  { id: "novice", label: "Novice", description: "First track day or still building confidence. Sighting laps and classroom briefing included." },
  { id: "intermediate", label: "Intermediate", description: "Several track days under your belt and comfortable with body position." },
  { id: "fast", label: "Fast", description: "Consistent, fast lap times and experienced in group riding on track." },
] as const

export const servicePackages = [
  { id: "annual", label: "Annual service", price: 295, duration: "Half day", description: "Oil and filter change, full safety inspection, software update and road test." },
  { id: "major", label: "Major service", price: 895, duration: "1–2 days", description: "Valve clearance check and adjustment, belts (where fitted), plugs, fluids and full inspection." },
  { id: "tyres", label: "Tyre fitting", price: 45, duration: "1 hour", description: "Fitting and balancing per wheel. Bring your own tyres or order from our range." },
  { id: "mot", label: "MOT test", price: 29.65, duration: "1 hour", description: "Class 2 MOT carried out in our DVSA-approved test bay." },
  { id: "accessory", label: "Accessory fitting", price: 75, duration: "From 1 hour", description: "Exhausts, luggage, mounts and performance parts fitted by factory-trained technicians." },
  { id: "diagnostic", label: "Diagnostic check", price: 60, duration: "1 hour", description: "Warning light or running issue? We'll diagnose it with the Vellora VDS 2.0 system." },
] as const

export const bikeModels = ["Fulmine", "Rombo", "Bestia", "Orizzonte", "Sabbia", "Notturno", "Supermoto", "Deserto", "Sport GT", "Other"] as const

/** Demo gift cards — try VELLORA-GIFT-0001 with PIN 1234. */
export const giftCards: Record<string, { pin: string; balance: number; expires: string }> = {
  "VELLORA-GIFT-0001": { pin: "1234", balance: 50, expires: "31 December 2027" },
  "VELLORA-GIFT-0002": { pin: "5678", balance: 125.5, expires: "30 June 2027" },
  "VELLORA-GIFT-0003": { pin: "0000", balance: 0, expires: "31 March 2027" },
}

export const giftCardAmounts = [25, 50, 100, 150, 250, 500]

export const showroom = {
  name: "Vellora Moto UK — Showroom & Workshop",
  address: ["Unit 7, Brooklands Drive", "Weybridge", "Surrey", "KT13 0SL"],
  phone: "01932 000 926",
  email: "hello@velloramoto.co.uk",
  hours: [
    { days: "Monday – Friday", time: "9:00 – 18:00" },
    { days: "Saturday", time: "9:00 – 17:00" },
    { days: "Sunday", time: "10:00 – 16:00 (showroom only)" },
  ],
  // OpenStreetMap embed centred on Brooklands, Weybridge.
  mapEmbed: "https://www.openstreetmap.org/export/embed.html?bbox=-0.4800%2C51.3420%2C-0.4500%2C51.3560&layer=mapnik&marker=51.3490%2C-0.4650",
  mapLink: "https://www.openstreetmap.org/?mlat=51.3490&mlon=-0.4650#map=15/51.3490/-0.4650",
}
