import type { Metadata } from "next"
import { Anek_Bangla, Inter, Mulish, Source_Code_Pro, Urbanist } from "next/font/google"

import { CartProvider } from "@/components/cart/cart-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const mulish = Mulish({ variable: "--font-mulish", subsets: ["latin"] })
const inter = Inter({ variable: "--font-inter-family", subsets: ["latin"] })
const sourceCodePro = Source_Code_Pro({ variable: "--font-source-code-pro", subsets: ["latin"], preload: false })
const anekBangla = Anek_Bangla({ variable: "--font-anek-bangla", subsets: ["latin"], weight: ["400"], preload: false })
// Stand-in for the design's Paralucent (commercial) used in the reviews block.
const urbanist = Urbanist({ variable: "--font-urbanist", subsets: ["latin"], preload: false })

export const metadata: Metadata = {
  title: { default: "Vellora Moto UK — Ride. Perform. Live Vellora", template: "%s | Vellora Moto UK" },
  description: "Premium riding gear and accessories crafted for those who live for the ride.",
  metadataBase: new URL("https://velloramoto.co.uk"),
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${mulish.variable} ${inter.variable} ${sourceCodePro.variable} ${anekBangla.variable} ${urbanist.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CartProvider>{children}</CartProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
