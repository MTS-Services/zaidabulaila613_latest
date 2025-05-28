"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingBag } from "lucide-react"

import VendorSelection from "@/components/vendor-selection"
import FeaturedProducts from "@/components/featured-products"
import CategorySection from "@/components/category-section"
import HeroSection from "@/components/hero-section" // Re-enabled hero section
import BenefitsSection from "@/components/benefits-section"
import ShopByType from "@/components/shop-by-type"
import AnimatedLoader from "@/components/animated-loader"
import NeumorphicButton from "@/components/neumorphic-button"
import { ctaContent } from "@/constants/cta/cta"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Using the hero section instead of test carousel */}
        <HeroSection />

        {/* Animated Loader */}
        <AnimatedLoader />

        {/* Remove the DiscountBannerFull component */}

        {/* Vendor Selection */}
        <VendorSelection />

        {/* Categories */}
        <CategorySection />

        {/* Shop by Type - Now hidden on desktop */}
        <ShopByType />

        {/* Featured Products */}
        <FeaturedProducts />

        {/* Benefits */}
        <BenefitsSection />

        {/* CTA */}
        <section className={`${ctaContent.styles.section.padding} ${ctaContent.styles.section.background} ${ctaContent.styles.section.overflow}`}>
          {/* Animated Shopping Bag - Hide on mobile */}
          <div className="absolute top-0 right-12 md:right-24 z-10 hidden md:block">
            <motion.div
              initial={ctaContent.animatedBag.initial}
              animate={ctaContent.animatedBag.animate}
              transition={ctaContent.animatedBag.transition}
              className="relative"
            >
              <motion.div
                animate={{ rotate: ctaContent.animatedBag.swing.rotate }}
                transition={ctaContent.animatedBag.swing.transition}
                style={{ transformOrigin: "top center" }}
              >
                <div className={`${ctaContent.animatedBag.styles.string.height} ${ctaContent.animatedBag.styles.string.width} ${ctaContent.animatedBag.styles.string.background} mx-auto mb-1`}></div>
                <ShoppingBag 
                  size={ctaContent.animatedBag.styles.bag.size}
                  className={`${ctaContent.animatedBag.styles.bag.color} ${ctaContent.animatedBag.styles.bag.shadow}`}
                />
              </motion.div>
            </motion.div>
          </div>

          <div className={`container ${ctaContent.styles.container}`}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className={`${ctaContent.styles.title.fontSize} ${ctaContent.styles.title.fontWeight} ${ctaContent.styles.title.tracking} ${ctaContent.styles.title.color} ${ctaContent.styles.title.font}`}>
                  {ctaContent.title}
                </h2>
                <p className={`${ctaContent.styles.description.maxWidth} ${ctaContent.styles.description.color} ${ctaContent.styles.description.responsive}`}>
                  {ctaContent.description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <NeumorphicButton 
                  href={ctaContent.button.href} 
                  text={ctaContent.button.text} 
                  variant={ctaContent.button.variant} 
                />
              </div>
            </div>
          </div>
        </section>

    
      </main>
    
    <Footer></Footer>

    </div>
  )
}
