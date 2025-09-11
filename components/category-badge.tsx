"use client"

import { motion } from "framer-motion"

interface CategoryBadgeProps {
  text: string
  discount?: string
  className?: string
}

export default function CategoryBadge({ text, discount = "40% OFF", className = "" }: CategoryBadgeProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -right-2 -top-2 z-10">
        <div className="relative">
          <motion.div
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            className="bg-gold text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center justify-center"
          >
            {discount}
          </motion.div>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
            className="absolute inset-0 bg-gold rounded-full -z-10 blur-sm"
          />
        </div>
      </div>
      <span className="bg-black/70 text-white px-3 py-1 text-sm font-medium rounded-full">{text}</span>
    </div>
  )
}
