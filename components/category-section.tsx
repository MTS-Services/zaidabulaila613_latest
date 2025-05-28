"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Tag } from "lucide-react"
import { motion } from "framer-motion"
import useEmblaCarousel from "embla-carousel-react"
import { categoryContent } from "@/constants/categories/category"

export default function CategorySection() {
  const { carousel, categories } = categoryContent
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [cardsPerSlide, setCardsPerSlide] = useState(6) // Default, will be calculated based on container width
  const [containerWidth, setContainerWidth] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Initialize Embla Carousel for swipeable functionality
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false
  })

  useEffect(() => {
    const updateCardsPerSlide = () => {
      if (!emblaApi) return

      const containerWidth = emblaApi.containerNode().clientWidth
      setContainerWidth(containerWidth)

      // Check if we're on mobile
      const mobile = window.innerWidth < carousel.breakpoint
      setIsMobile(mobile)

      const dimensions = mobile ? carousel.dimensions.mobile : carousel.dimensions.desktop
      const availableWidth = containerWidth - dimensions.padding

      // Calculate cards per slide
      let calculatedCardsPerSlide = Math.floor(availableWidth / (dimensions.cardWidth + dimensions.cardGap))
      calculatedCardsPerSlide = Math.max(1, Math.min(calculatedCardsPerSlide, categories.length))

      setCardsPerSlide(calculatedCardsPerSlide)
    }

    if (emblaApi) {
      updateCardsPerSlide()
      emblaApi.on("resize", updateCardsPerSlide)
      emblaApi.on("select", () => {
        setCurrentSlide(emblaApi.selectedScrollSnap())
      })
    }

    window.addEventListener("resize", updateCardsPerSlide)

    return () => {
      window.removeEventListener("resize", updateCardsPerSlide)
      if (emblaApi) {
        emblaApi.off("resize", updateCardsPerSlide)
      }
    }
  }, [emblaApi])

  // Calculate total slides
  const totalSlides = Math.ceil(categories.length / cardsPerSlide)

  // Navigate between slides
  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev()
  }

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext()
  }

  // Go to specific slide
  const goToSlide = (slideIndex: number) => {
    if (emblaApi) emblaApi.scrollTo(slideIndex)
  }

  // Calculate the width and position for each card
  const getCardStyle = (index: number, isHovered: boolean) => {
    // Reduce the base width for mobile while keeping the same height
    const baseCardWidth = isMobile ? 55 : 150

    // If this card is hovered, it should be expanded
    if (isHovered) {
      // Limit expanded width to prevent overflow
      const maxExpandedWidth = isMobile ? 90 : 280
      return {
        width: `${maxExpandedWidth}px`,
        height: isMobile ? "110px" : "220px", // Keep the same height
        transition: "all 0.3s ease-in-out",
        flexShrink: 0,
        flexGrow: 0,
      }
    }

    // If no card is hovered, distribute space evenly
    if (hoveredIndex === null) {
      // For the last slide, ensure cards don't exceed their normal width
      const evenCardWidth = Math.min(
        baseCardWidth * 1.2, // Allow slight growth but not too much
        baseCardWidth,
      )

      return {
        width: `${evenCardWidth}px`,
        height: isMobile ? "110px" : "220px", // Keep the same height
        transition: "all 0.3s ease-in-out",
        flexShrink: 0,
        flexGrow: 0,
      }
    }

    // If another card is hovered, calculate the remaining width for other cards
    const minWidth = isMobile ? 45 : 100
    const maxWidth = baseCardWidth * 1.1 // Limit maximum width

    return {
      width: `${Math.min(maxWidth, Math.max(minWidth, baseCardWidth))}px`,
      height: isMobile ? "110px" : "220px", // Keep the same height
      transition: "all 0.3s ease-in-out",
      flexShrink: 0,
      flexGrow: 0,
    }
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container px-2 md:px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tighter font-playfair">{categoryContent.title}</h2>
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              className="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollNext}
              className="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          {/* Embla Carousel Container */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 mx-1.5 md:mx-3"
                  style={getCardStyle(index, hoveredIndex === index)}
                >
                  <Link
                    href={`/categories/${category.slug}`}
                    className={`h-full flex items-center justify-center rounded-lg overflow-hidden relative transition-all duration-300`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      backgroundColor: category.backgroundColor,
                      color: category.textColor,
                      ['--hover-color' as string]: category.hoverColor,
                    } as React.CSSProperties}
                  >
                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Vertical text (visible when not hovered) */}
                      <h3
                        className={`
                         text-xs md:text-base font-medium ${category.textColor} whitespace-nowrap absolute
                         transition-all duration-300 ease-in-out
                         ${hoveredIndex === index ? "opacity-0 rotate-90 transform scale-50" : "opacity-100 rotate-90 transform scale-100"}
                       `}
                      >
                        {category.name}
                      </h3>

                      {/* Horizontal text (visible when hovered) */}
                      <h3
                        className={`
                         text-sm md:text-2xl font-medium ${category.textColor} text-center px-2 md:px-4 absolute
                         transition-all duration-300 ease-in-out
                         ${hoveredIndex === index ? "opacity-100 transform scale-100" : "opacity-0 transform scale-50"}
                       `}
                      >
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Slide indicators */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === index ? "w-6 bg-gold" : "w-2 bg-slate-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
