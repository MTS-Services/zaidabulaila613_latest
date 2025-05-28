"use client"

import { useState, useEffect } from "react"
import { useDrawer } from "@/contexts/drawer-context"
import Link from "next/link"
import { Home, Grid, ShoppingBag, User } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"

export default function MobileBottomNav() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const { isDrawerOpen } = useDrawer()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Always show when at the top of the page (hero section)
      if (currentScrollY <= 100) {
        setIsVisible(true)
      }
      // Show when scrolling up and not at the top
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      }
      // Hide when scrolling down and not at the top
      else {
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Only render on client-side to avoid hydration issues
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 transition-transform duration-300 md:hidden ${
        isVisible && !isDrawerOpen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex justify-around items-center h-16">
        <Link
          href="/"
          className="flex flex-col items-center justify-center w-full h-full text-slate-600 hover:text-gold"
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          href="/categories"
          className="flex flex-col items-center justify-center w-full h-full text-slate-600 hover:text-gold"
        >
          <Grid className="h-5 w-5" />
          <span className="text-xs mt-1">Categories</span>
        </Link>

        <Link href="/upload" className="flex flex-col items-center justify-center w-full h-full relative">
          <div className="group cursor-pointer outline-none hover:rotate-90 duration-300">
            <svg
              className="stroke-gold fill-none group-hover:fill-gold/80 group-active:stroke-gold/50 group-active:fill-gold group-active:duration-0 duration-300 h-[50px] w-[50px]"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeWidth="1.5"
                d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
              ></path>
              <path strokeWidth="1.5" d="M8 12H16"></path>
              <path strokeWidth="1.5" d="M12 16V8"></path>
            </svg>
          </div>
        </Link>

        <Link
          href="/cart"
          className="flex flex-col items-center justify-center w-full h-full text-slate-600 hover:text-gold relative"
        >
          <ShoppingBag className="h-5 w-5" />
          {cartCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-gold text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {cartCount()}
            </span>
          )}
          <span className="text-xs mt-1">Cart</span>
        </Link>

        <Link
          href="/account"
          className="flex flex-col items-center justify-center w-full h-full text-slate-600 hover:text-gold"
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Account</span>
        </Link>
      </div>
    </div>
  )
}
