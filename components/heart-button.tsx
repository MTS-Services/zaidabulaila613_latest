"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useWishlist, WishlistItem } from "@/hooks/use-wishlist"

interface HeartButtonProps {
  productId: string
  className?: string
  size?: "sm" | "md" | "lg"
  product:WishlistItem;
}

export default function HeartButton({ productId, className = "", size = "md", product }: HeartButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [isLiked, setIsLiked] = useState(false)

  // Sync with wishlist state
  useEffect(() => {
    setIsLiked(isInWishlist(productId))
  }, [isInWishlist, productId])

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (isLiked) {
      removeFromWishlist(productId)
    } else {
      // We need product details to add to wishlist, but we only have ID here
      // In a real implementation, you'd either pass the full product or fetch it
      addToWishlist(product)
    }

    setIsLiked(!isLiked)
  }

  // Size classes
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-10 h-10",
  }

  return (
    <div className={`con-like relative ${sizeClasses[size]} ${className}`} onClick={toggleLike}>
      <input
        className="like absolute w-full h-full opacity-0 z-20 cursor-pointer focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-0 active:outline-none appearance-none border-0 bg-transparent !outline-none !border-none !shadow-none"
        type="button"
        title="like"
        aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        style={{ outline: "none", border: "none", boxShadow: "none" }}
      />
      <div className="checkmark w-full h-full flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute" viewBox="0 0 24 24">
          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`filled absolute ${isLiked ? "block" : "hidden"}`}
          viewBox="0 0 24 24"
        >
          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="100"
          width="100"
          className={`celebrate absolute ${isLiked ? "block" : "hidden"}`}
        >
          <polygon className="poly" points="10,10 20,20"></polygon>
          <polygon className="poly" points="10,50 20,50"></polygon>
          <polygon className="poly" points="20,80 30,70"></polygon>
          <polygon className="poly" points="90,10 80,20"></polygon>
          <polygon className="poly" points="90,50 80,50"></polygon>
          <polygon className="poly" points="80,80 70,70"></polygon>
        </svg>
      </div>
    </div>
  )
}
