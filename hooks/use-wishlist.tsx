"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type WishlistItem = {
  id: number
  name: string
  price: number | string
  originalPrice?: number | string
  images?: string[]
  type?: string
  vendor: {
    name: string
    slug: string
  }
}

type WishlistContextType = {
  wishlist: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: number) => void
  clearWishlist: () => void
  isInWishlist: (id: number) => boolean
  wishlistCount: () => number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist))
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage", error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  // Add item to wishlist
  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prevWishlist) => {
      // Check if item already exists in wishlist
      const existingItem = prevWishlist.find((wishlistItem) => wishlistItem.id === item.id)

      if (existingItem) {
        // Don't add if already in wishlist
        return prevWishlist
      } else {
        // Add new item if it doesn't exist
        return [...prevWishlist, item]
      }
    })
  }

  // Remove item from wishlist
  const removeFromWishlist = (id: number) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== id))
  }

  // Clear wishlist
  const clearWishlist = () => {
    setWishlist([])
  }

  // Check if item is in wishlist
  const isInWishlist = (id: number) => {
    return wishlist.some((item) => item.id === id)
  }

  // Calculate wishlist item count
  const wishlistCount = () => {
    return wishlist.length
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
