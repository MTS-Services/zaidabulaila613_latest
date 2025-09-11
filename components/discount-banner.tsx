"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function DiscountBanner() {
  const buttonVariants = {
    initial: { scale: 1, backgroundColor: "#ffffff" },
    hover: {
      scale: 1.05,
      backgroundColor: "#ffffff",
      boxShadow: "0 0 15px rgba(255, 255, 255, 0.5)",
      transition: { duration: 0.3 },
    },
  }

  return (
    <section className="py-3 md:py-6 bg-gradient-to-r from-gold/90 to-gold/70 text-white">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-row items-center justify-between gap-2 md:gap-4"
        >
          <div className="flex items-center gap-1 md:gap-2">
            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            >
              <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </motion.div>
            <div>
              <h3 className="text-sm md:text-lg font-bold leading-tight">Special Discount</h3>
              <p className="text-white/90 text-xs md:text-sm leading-tight hidden sm:block">Limited time offer</p>
            </div>
          </div>

          <motion.div
            className="text-center"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <div className="text-xl md:text-3xl font-bold leading-tight">40% OFF</div>
            <p className="text-white/90 text-xs md:text-sm leading-tight">
              Code:{" "}
              <motion.span
                className="font-mono bg-white/20 px-1 py-0.5 rounded text-xs"
                animate={{
                  backgroundColor: ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.4)", "rgba(255,255,255,0.2)"],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                DRESS40
              </motion.span>
            </p>
          </motion.div>

          <motion.div initial="initial" whileHover="hover" variants={buttonVariants}>
            <Link
              href="/categories"
              className="px-3 py-1.5 md:px-5 md:py-2 bg-white text-gold hover:bg-white/90 
                       transition-colors rounded-full font-medium text-xs md:text-sm whitespace-nowrap"
            >
              Shop Now
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
