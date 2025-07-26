"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-mobile"
import { heroContent } from "@/constants/hero/hero-section"
import { useTranslation } from "@/hooks/use-translation"
import { useAuth } from "@/contexts/auth-context"

export default function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const isMobile = useIsMobile()
  const [scrollY, setScrollY] = useState(0)

  const { t } = useTranslation()
  const { user } = useAuth()

  // const slides = [
  //   {
  //     image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1920&auto=format&fit=crop",
  //     alt: "Elegant woman in a white wedding dress",
  //   },
  //   {
  //     image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1920&auto=format&fit=crop",
  //     alt: "Woman in a red evening gown",
  //   },
  //   {
  //     image: "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?q=80&w=1920&auto=format&fit=crop",
  //     alt: "Woman in a formal blue dress",
  //   },
  // ]

  // Handle parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const parallaxOffset = scrollY * 0.3
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    setScrollSnaps(emblaApi.scrollSnapList())
    onSelect()

    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)

    const autoplayInterval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext()
      } else {
        emblaApi.scrollTo(0)
      }
    }, 5000)

    return () => {
      emblaApi.off("select", onSelect)
      clearInterval(autoplayInterval)
    }
  }, [emblaApi, onSelect])

  // Remove the slides array and use heroContent.slides instead

  return (
    <section className="relative h-screen">
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10 pointer-events-none" />
      {/* Announcement Bar */}
      <div className="absolute top-0 left-0 right-0 z-30">
        <div className="bg-gold/90 text-white py-2 px-4 text-center text-sm font-medium">
          <span className="font-bold">{heroContent.announcement.prefix}</span> {heroContent.announcement.text}
        </div>
      </div>

      {/* Embla Carousel */}
      <div className="embla overflow-hidden h-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {heroContent.slides.map((slide, index) => (
            <div key={index} className="embla__slide flex-[0_0_100%] min-w-0 relative h-full">
              <div
                className="absolute inset-0"
                style={{
                  transform: `translateY(${parallaxOffset}px)`,
                  transition: "transform 0.1s ease-out",
                }}
              >
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-center pointer-events-none">
        <div className="container px-4 md:px-6">
          <div className="max-w-2xl space-y-4">
            <div className="space-y-2">
              <p className="text-white/80 font-great-vibes text-2xl md:text-3xl">{t('hero.subtitle')}</p>
              <h1 className="font-playfair text-4xl font-bold tracking-tight text-white sm:text-5xl xl:text-6xl/none elegant-letter-spacing hero-text-shadow">
                {t('hero.tittle')}
              </h1>
            </div>
            <p className="text-white/90 text-xl md:text-2xl">{t('hero.description')}</p>
            {!user &&
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href={heroContent.cta.href} className="fancy-button fancy-button-primary pointer-events-auto">
                  {t('hero.button')}
                </a>
              </div>

            }
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className={`absolute ${isMobile ? "bottom-24" : "bottom-6"} left-1/2 -translate-x-1/2 z-30 flex space-x-2`}>
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all ${selectedIndex === index ? "w-6 bg-white" : "bg-white/50"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
