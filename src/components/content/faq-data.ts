import { FREE_SHIPPING_THRESHOLD } from "@/lib/pricing"

export type FaqEntry = { id: string; q: string; a: string; link?: { href: string; label: string } }
export type FaqGroup = { id: string; title: string; items: FaqEntry[] }

export const faqGroups: FaqGroup[] = [
  {
    id: "orders",
    title: "Orders & payment",
    items: [
      { id: "payment-methods", q: "Which payment methods do you accept?", a: "We accept Visa, Mastercard, American Express, Apple Pay, Google Pay and PayPal. All payments are processed securely and we never store your full card details." },
      { id: "change-order", q: "Can I change or cancel my order?", a: "We start picking orders quickly, but if you contact us within one hour of ordering we'll do our best to amend or cancel it. After dispatch you can return it under our returns policy.", link: { href: "/contact?topic=order", label: "Contact us about an order" } },
      { id: "vat", q: "Do your prices include VAT?", a: "Yes. All prices shown are in pounds sterling and include UK VAT at 20%. A full VAT receipt is included in your order confirmation email." },
      { id: "promo-codes", q: "How do I use a promo code?", a: "Enter your code in the bag or at checkout and select Apply. Only one code can be used per order and codes cannot be applied to gift cards." },
    ],
  },
  {
    id: "delivery",
    title: "Delivery",
    items: [
      { id: "delivery-cost", q: "How much does delivery cost?", a: `Standard delivery is £4.95 and free on orders over £${FREE_SHIPPING_THRESHOLD}. Express, next working day and free click & collect from our Weybridge showroom are also available.`, link: { href: "/shipping", label: "See all delivery options" } },
      { id: "international", q: "Do you ship outside the UK?", a: "Not at the moment. We deliver to mainland UK addresses, Northern Ireland, the Scottish Highlands and islands. We don't ship to the Channel Islands, BFPO or international addresses." },
      { id: "track-order", q: "How can I track my order?", a: "As soon as your order is dispatched we'll email you a tracking link. You can also check the status any time with your order number and email address.", link: { href: "/track-order", label: "Track your order" } },
      { id: "missing-parcel", q: "My parcel hasn't arrived — what should I do?", a: "Check your tracking link and any safe-place note first. If it still hasn't arrived two working days after the expected date, contact us and we'll open an investigation with the courier." },
    ],
  },
  {
    id: "returns",
    title: "Returns & exchanges",
    items: [
      { id: "return-window", q: "What is your returns policy?", a: "You have 30 days from delivery to return unworn, unused items in their original packaging with tags attached for a full refund.", link: { href: "/returns", label: "Read the returns policy" } },
      { id: "non-returnable", q: "Are any items non-returnable?", a: "For hygiene reasons helmets and underwear (including base layers) can't be returned once the seal or packaging has been opened, unless they are faulty. Personalised items and gift cards are also non-returnable." },
      { id: "refund-time", q: "How long do refunds take?", a: "We process refunds within 3 working days of your return reaching us. Your bank may take a further 3–5 working days to show the money in your account." },
      { id: "exchange", q: "Can I exchange for a different size?", a: "Yes — exchanges for a different size or colour are free. Choose exchange when you start your return and we'll reserve the replacement while your parcel is on its way back." },
    ],
  },
  {
    id: "sizing",
    title: "Sizing & fit",
    items: [
      { id: "find-size", q: "How do I find my size?", a: "Every clothing and gear product has a size guide link beside the size selector. Our full size guide covers helmets, jackets, race suits, gloves, boots and eBike frames.", link: { href: "/size-guide", label: "Open the size guide" } },
      { id: "between-sizes", q: "I'm between sizes — which should I choose?", a: "For riding jackets and suits we usually recommend the smaller size, as leather softens and moulds to you. For casual wear and if you plan to layer, go up a size." },
      { id: "fitting", q: "Can I try gear on before buying?", a: "Of course. Our Weybridge showroom stocks the full riding-wear range and our team can help with helmet and leather fitting — no appointment needed." },
    ],
  },
  {
    id: "products",
    title: "Products & warranty",
    items: [
      { id: "genuine", q: "Are your products genuine Vellora?", a: "Yes. As an official Vellora dealer since 2001, everything we sell is genuine Vellora Performance, Vellora apparel or approved partner product, supplied through official channels." },
      { id: "warranty", q: "What warranty do products come with?", a: "Apparel and accessories carry a two-year manufacturer's warranty against defects. Vellora Performance parts fitted by our workshop keep your motorcycle's factory warranty intact." },
      { id: "restock", q: "An item is sold out — will it come back?", a: "Most core items are restocked regularly. Limited and race-replica items are usually one-off runs. Contact us and we'll let you know if more are expected." },
      { id: "fitment", q: "Will this accessory fit my bike?", a: "Use Shop by Bike to see parts matched to your model, or send us your model and year and our technicians will confirm fitment before you order.", link: { href: "/contact?topic=product", label: "Ask a product question" } },
    ],
  },
  {
    id: "experiences",
    title: "Track days & service",
    items: [
      { id: "track-first", q: "Can I join a track day as a beginner?", a: "Absolutely. Our novice group includes a classroom briefing and sighting laps behind an instructor before you head out at your own pace.", link: { href: "/track-days", label: "See upcoming track days" } },
      { id: "service-booking", q: "How do I book my bike in for a service?", a: "Book online by choosing your service and preferred date. We'll confirm a drop-off time by email within one working day.", link: { href: "/service", label: "Book a service" } },
      { id: "courtesy", q: "Do you offer collection and delivery?", a: "Yes, within 30 miles of Weybridge from £45 each way. Mention it in the notes when you book and we'll arrange a time." },
    ],
  },
  {
    id: "account",
    title: "Account",
    items: [
      { id: "need-account", q: "Do I need an account to order?", a: "No — you can check out as a guest. An account lets you track orders, save addresses and keep a wishlist across devices.", link: { href: "/account", label: "Sign in or create an account" } },
      { id: "reset-password", q: "I've forgotten my password", a: "Use Forgot password on the sign-in page and we'll email you a secure link to set a new one. The link expires after one hour." },
      { id: "delete-account", q: "How do I delete my account?", a: "Email us from the address on your account and we'll delete your personal data within 30 days, except for records we must keep for tax purposes.", link: { href: "/privacy", label: "Read our privacy policy" } },
    ],
  },
]
