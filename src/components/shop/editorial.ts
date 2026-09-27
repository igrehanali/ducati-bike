import type { CategorySlug } from "@/lib/catalog"

/* Short editorial/SEO copy shown beneath category listings. */
export const categoryEditorial: Record<CategorySlug, { title: string; paragraphs: string[] }> = {
  helmets: {
    title: "Vellora helmets, developed on track",
    paragraphs: [
      "Every Vellora helmet we stock is ECE 22.06 homologated and built around a multi-density EPS liner, with shells offered in several sizes so the helmet sits low and compact on your head. Race models add wind-tunnel-tuned spoilers and anti-fog-ready Class 1 visors.",
      "Not sure on fit? Measure the circumference of your head just above the eyebrows and compare it with our size guide, or visit the showroom for a free fitting session with our team.",
    ],
  },
  jackets: {
    title: "Riding jackets for every season",
    paragraphs: [
      "From perforated summer leathers to waterproof textile tourers, our jackets are cut for the riding position with pre-curved sleeves and CE Level 2 armour at the shoulders and elbows.",
      "Most jackets zip to matching trousers and accept a back protector — ask us about pairing the right pieces for the road or the track.",
    ],
  },
  suits: {
    title: "One and two-piece race leathers",
    paragraphs: [
      "Developed with Vellora Corse, our race suits combine 1.3 mm cowhide, titanium sliders and accordion stretch panels for maximum protection with freedom to move on the bike.",
      "Many circuits require a one-piece suit or a zipped two-piece for track days. Our team can advise on sizing and made-to-measure alterations.",
    ],
  },
  gloves: {
    title: "Gloves for racing, touring and the city",
    paragraphs: [
      "A glove is your connection to the bike. Racing gloves use goatskin palms and hard knuckle protection; touring gloves add waterproof membranes; summer gloves maximise airflow.",
      "All our motorcycle gloves are certified to EN 13594, and most feature touchscreen-compatible fingertips.",
    ],
  },
  boots: {
    title: "Race boots, touring boots and riding shoes",
    paragraphs: [
      "Rigid where it protects and flexible where it matters — our boots are built for confident control on the pegs, with ankle and shin protection and oil-resistant soles.",
      "Choose race boots for the track, waterproof touring boots for long days, or discreet riding shoes for the commute.",
    ],
  },
  hoodies: {
    title: "Vellora sweatshirts and hoodies",
    paragraphs: [
      "Soft brushed-back fleece and relaxed fits, finished with Vellora Corse and Sabbia embroidery. Made for the paddock, the garage and everywhere in between.",
      "Our lifestyle apparel is cut to a regular fit — take your usual size, or size up for a looser look.",
    ],
  },
  "t-shirts": {
    title: "Organic cotton Vellora T-shirts",
    paragraphs: [
      "Heavyweight organic cotton tees printed with graphics inspired by 90 years of Vellora racing history, from Valdoro heritage to World GP liveries.",
      "Pre-shrunk jersey means your tee keeps its shape wash after wash.",
    ],
  },
  polos: {
    title: "Paddock polos and team shirts",
    paragraphs: [
      "The same piqué polos worn by the team in the Vellora paddock, with a touch of stretch and a tailored fit.",
      "Smart enough for the office, relaxed enough for race weekend.",
    ],
  },
  caps: {
    title: "Caps, trucker hats and beanies",
    paragraphs: [
      "Finish the look with an embroidered Vellora cap — adjustable, breathable and available in team colours and Sabbia yellow.",
      "Every cap is one size with an adjustable strap closure.",
    ],
  },
  bags: {
    title: "Bags and backpacks for riders",
    paragraphs: [
      "Technical and leather backpacks with padded laptop sleeves, weather-resistant fabrics and ergonomic straps that stay comfortable in a riding tuck.",
      "Perfect for the commute, the weekend away or carrying your kit to the circuit.",
    ],
  },
  lifestyle: {
    title: "Gifts and lifestyle accessories",
    paragraphs: [
      "Sunglasses, key rings, mugs and watches — small details for every Vellorista, gift-ready in presentation packaging.",
      "Looking for something special? A Vellora Moto gift card lets them choose.",
    ],
  },
  exhausts: {
    title: "Titanio and Corsa exhausts",
    paragraphs: [
      "Lighter, louder and tuned for the characteristic Vellora sound. Our titanium and carbon systems save weight over standard and include dedicated ECU mapping.",
      "Road-legal versions are EC type-approved with removable db-killers. Our workshop offers professional fitting and mapping.",
    ],
  },
  performance: {
    title: "Vellora Performance parts",
    paragraphs: [
      "Race-proven brakes, suspension, chains, tyres and billet parts that sharpen braking, handling and response — all genuine Vellora Performance with a two-year warranty.",
      "Book your fitting with our service department when you order.",
    ],
  },
  touring: {
    title: "Touring luggage and tech",
    paragraphs: [
      "Panniers, side bags, phone mounts and covers designed around Vellora mounting points — kit for riders who measure trips in countries, not miles.",
      "Quick-release fixings mean your bike goes from tourer to naked in minutes.",
    ],
  },
  ebikes: {
    title: "Vellora eBikes",
    paragraphs: [
      "Designed by the Vellora Design Centre, our electric mountain, gravel and city bikes pair Vellora motors with integrated batteries and Vellora style.",
      "Book a test ride at the showroom to find the right frame size and model for your riding.",
    ],
  },
}
