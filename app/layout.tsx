import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, Great_Vibes } from "next/font/google"
import "./globals.css"
import "./embla.css" // Import the Embla CSS
import { CartProvider } from "@/hooks/use-cart"
import { WishlistProvider } from "@/hooks/use-wishlist"
import { DrawerProvider } from "@/contexts/drawer-context"
import Navbar from "@/components/navbar"
import BackToTop from "@/components/back-to-top"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import { Toaster } from "@/components/ui/use-toast"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-great-vibes" })

export const metadata: Metadata = {
  title: "DressMarket - Find Your Perfect Dress",
  description: "Shop for new, used, and rental dresses from trusted vendors",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-arp="">
      
      <body className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} font-sans pt-16`}>
        <CartProvider>
          <WishlistProvider>
            <DrawerProvider>
              <Navbar />
              {children}
              <BackToTop />
              <MobileBottomNav />
              <Toaster />
            </DrawerProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}
