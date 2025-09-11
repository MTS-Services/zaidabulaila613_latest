import type React from "react"
import type { Metadata } from "next"

import "./globals.css"
import "./embla.css" // Import the Embla CSS
import { CartProvider } from "@/hooks/use-cart"
import { WishlistProvider } from "@/hooks/use-wishlist"
import { DrawerProvider } from "@/contexts/drawer-context"
import Navbar from "@/components/navbar"
import BackToTop from "@/components/back-to-top"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import { Toaster } from "@/components/ui/use-toast"
import { ApolloProvider } from "@apollo/client"
import client from "@/lib/apolloClient"
import ApolloClientProvider from "@/lib/apolloClientProvider"
import { AuthProvider } from "@/contexts/auth-context"
import { CurrencyProvider } from "@/contexts/currency-context"
import { LanguageProvider } from "@/contexts/language-context"
import AppLayout from "@/components/app-layout"
import { CategoryProvider } from "@/contexts/category-context"
import { Suspense } from "react"



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

    <ApolloClientProvider>
      <AuthProvider>
        <LanguageProvider>

          <CurrencyProvider>
            <CategoryProvider>


              <CartProvider>
                <WishlistProvider>
                  <DrawerProvider>
                    <Suspense>


                      <AppLayout>

                        <Navbar />
                        {children}
                        <BackToTop />
                        <MobileBottomNav />
                        <Toaster />
                        
                      </AppLayout>
                    </Suspense>
                  </DrawerProvider>
                </WishlistProvider>
              </CartProvider>
            </CategoryProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </AuthProvider>
    </ApolloClientProvider>

  )
}
