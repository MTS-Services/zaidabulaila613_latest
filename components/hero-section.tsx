"use client";

import { heroContent } from "@/constants/hero/hero-section";
import { useAuth } from "@/contexts/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/use-translation";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Banner = {
  _id: string;
  bigheading: string;
  body: string;
  lowerheading: string;
  image: string;
  order: number;
  isActive: boolean;
};

export default function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const isMobile = useIsMobile();
  const [scrollY, setScrollY] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);

  const { t } = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch("https://api.layls.com/banners/active");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setBanners(json.data.sort((a, b) => a.order - b.order));
        }
      } catch (e) {
        setBanners([]);
      }
    }
    fetchBanners();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.3;
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || banners.length === 0) {
      return;
    }

    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    const autoplayInterval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 5000);

    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(autoplayInterval);
    };
  }, [emblaApi, onSelect, banners]);

  const slides = banners.length > 0 ? banners : [];

  return (
    <section className="relative h-screen">
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 z-30">
        <div className="bg-gold/90 text-white py-2 px-4 text-center text-sm font-medium">
          <span className="font-bold">{heroContent.announcement.prefix}</span>{" "}
          {heroContent.announcement.text}
        </div>
      </div>

      <div className="embla overflow-hidden h-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {slides.map((slide, index) => (
            <div
              key={slide._id || index}
              className="embla__slide flex-[0_0_100%] min-w-0 relative h-full"
            >
              <div
                className="absolute inset-0"
                style={{
                  transform: `translateY(${parallaxOffset}px)`,
                  transition: "transform 0.1s ease-out",
                }}
              >
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.bigheading}
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

      <div className="absolute inset-0 z-20 flex items-center pointer-events-none">
        <div className="container px-4 md:px-6">
          {slides[selectedIndex] && (
            <div className="max-w-2xl space-y-4">
              <div className="space-y-2">
                <p className="text-white/80 font-great-vibes text-2xl md:text-3xl">
                  {slides[selectedIndex].body}
                </p>
                <h1 className="font-playfair text-4xl font-bold tracking-tight text-white sm:text-5xl xl:text-6xl/none elegant-letter-spacing hero-text-shadow">
                  {slides[selectedIndex].bigheading}
                </h1>
              </div>
              <p className="text-white/90 text-xl md:text-2xl">
                {slides[selectedIndex].lowerheading}
              </p>
              {!user && (
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <a
                    href={heroContent.cta.href}
                    className="fancy-button fancy-button-primary pointer-events-auto"
                  >
                    {t("hero.button")}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        className={`absolute ${
          isMobile ? "bottom-24" : "bottom-6"
        } left-1/2 -translate-x-1/2 z-30 flex space-x-2`}
      >
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              selectedIndex === index ? "w-6 bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
