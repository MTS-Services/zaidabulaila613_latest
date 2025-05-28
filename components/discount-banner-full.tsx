"use client"

import { motion } from "framer-motion"

export default function DiscountBannerFull() {
  return (
    <section className="bg-black text-white py-3">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-3 text-center">
          <motion.span
            className="text-gold font-bold"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            LIMITED TIME
          </motion.span>
          <motion.span
            className="bg-gold text-white text-sm font-bold px-3 py-1 rounded-full"
            animate={{
              scale: [1, 1.1, 1],
              backgroundColor: ["#CC9765", "#D9A97C", "#CC9765"],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            40% OFF
          </motion.span>
          <span>
            Use code: <span className="font-mono bg-white/20 px-2 py-1 rounded">DRESS40</span>
          </span>
        </div>
      </div>
    </section>
  )
}
