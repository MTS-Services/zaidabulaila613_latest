"use client"

import { useState } from "react"
import { X, Tag, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gold text-white relative z-50"
        >
          <div className="container mx-auto px-4 py-2 flex items-center justify-center">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Tag className="h-4 w-4 md:h-5 md:w-5 animate-pulse" />
              <p className="text-sm md:text-base font-medium">
                <span className="hidden md:inline">Special Offer:</span> Get{" "}
                <span className="font-bold text-base md:text-lg">40% OFF</span> on All Categories!
              </p>
              <Clock className="h-4 w-4 md:h-5 md:w-5" />
              <p className="text-xs md:text-sm">Limited Time Only</p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white"
              aria-label="Close announcement"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
