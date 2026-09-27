import type { CategorySlug } from "@/lib/catalog"

export type SizeTable = {
  id: string
  title: string
  intro: string
  howToMeasure: string[]
  columns: string[]
  rows: string[][]
}

export const sizeTables: SizeTable[] = [
  {
    id: "helmets",
    title: "Helmets",
    intro: "A helmet should feel snug all round with even pressure and no hot spots. Cheek pads will bed in slightly after a few rides.",
    howToMeasure: ["Wrap a soft tape measure around your head, 2 cm above your eyebrows and ears.", "Take the largest measurement and match it to the chart below."],
    columns: ["Size", "Head circumference (cm)"],
    rows: [["XS", "53–54"], ["S", "55–56"], ["M", "57–58"], ["L", "59–60"], ["XL", "61–62"]],
  },
  {
    id: "jackets",
    title: "Jackets, hoodies & tops",
    intro: "Riding jackets are cut for the riding position, so sleeves are slightly longer. If you're between sizes and wear layers, go up.",
    howToMeasure: ["Chest: measure around the fullest part of your chest, under your arms.", "Waist: measure around your natural waistline.", "Sleeve: from the centre of your back, over the shoulder to the wrist."],
    columns: ["Size", "Chest (cm)", "Waist (cm)", "Sleeve (cm)"],
    rows: [["XS", "86–90", "72–76", "84"], ["S", "91–95", "77–81", "86"], ["M", "96–100", "82–86", "88"], ["L", "101–105", "87–91", "90"], ["XL", "106–110", "92–96", "92"], ["XXL", "111–116", "97–102", "94"]],
  },
  {
    id: "suits",
    title: "Race suits",
    intro: "Leather suits use Italian sizing. A new suit should feel tight when standing — it will fit perfectly in the riding position.",
    howToMeasure: ["Measure chest, waist and inside leg.", "Height matters too — contact us if you are especially tall or short for your size."],
    columns: ["Size", "Chest (cm)", "Waist (cm)", "Height (cm)"],
    rows: [["46", "88–92", "74–78", "165–170"], ["48", "92–96", "78–82", "170–175"], ["50", "96–100", "82–86", "175–180"], ["52", "100–104", "86–90", "178–183"], ["54", "104–108", "90–94", "181–186"], ["56", "108–112", "94–98", "184–189"]],
  },
  {
    id: "gloves",
    title: "Gloves",
    intro: "Gloves should fit closely without restricting finger movement. Leather will soften and mould to your hand.",
    howToMeasure: ["Measure around your dominant hand at the knuckles, excluding the thumb."],
    columns: ["Size", "Hand circumference (cm)"],
    rows: [["S", "19–20"], ["M", "21–22"], ["L", "23–24"], ["XL", "25–26"], ["XXL", "27–28"]],
  },
  {
    id: "boots",
    title: "Boots",
    intro: "Our boots use EU sizing. Measure your feet in the afternoon, wearing riding socks.",
    howToMeasure: ["Stand on a sheet of paper and mark your heel and longest toe.", "Measure the distance and match to foot length below."],
    columns: ["EU", "UK", "Foot length (cm)"],
    rows: [["39", "6", "24.5"], ["40", "6.5", "25.0"], ["41", "7.5", "25.8"], ["42", "8", "26.5"], ["43", "9", "27.2"], ["44", "9.5", "27.9"], ["45", "10.5", "28.6"], ["46", "11", "29.3"]],
  },
  {
    id: "ebikes",
    title: "eBike frames",
    intro: "Frame size depends on your height and inside leg. Test rides are available at the showroom.",
    howToMeasure: ["Measure your height without shoes."],
    columns: ["Frame", "Rider height (cm)"],
    rows: [["S", "155–168"], ["M", "165–178"], ["L", "175–188"], ["XL", "185–200"]],
  },
]

const byCategory: Partial<Record<CategorySlug, string>> = {
  helmets: "helmets",
  jackets: "jackets",
  hoodies: "jackets",
  "t-shirts": "jackets",
  polos: "jackets",
  suits: "suits",
  gloves: "gloves",
  boots: "boots",
  ebikes: "ebikes",
}

export function sizeTableFor(category: CategorySlug) {
  const id = byCategory[category]
  return id ? sizeTables.find((t) => t.id === id) : undefined
}
