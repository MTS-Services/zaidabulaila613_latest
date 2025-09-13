// "use client";

// import { heroContent } from "@/constants/hero/hero-section";
// import { useAuth } from "@/contexts/auth-context";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { useTranslation } from "@/hooks/use-translation";
// import useEmblaCarousel from "embla-carousel-react";
// import Image from "next/image";
// import { useCallback, useEffect, useState } from "react";

// export default function HeroSection() {
//   const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
//   const isMobile = useIsMobile();
//   const [scrollY, setScrollY] = useState(0);

//   const { t } = useTranslation();
//   const { user } = useAuth();

//   // const slides = [
//   //   {
//   //     image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1920&auto=format&fit=crop",
//   //     alt: "Elegant woman in a white wedding dress",
//   //   },
//   //   {
//   //     image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1920&auto=format&fit=crop",
//   //     alt: "Woman in a red evening gown",
//   //   },
//   //   {
//   //     image: "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?q=80&w=1920&auto=format&fit=crop",
//   //     alt: "Woman in a formal blue dress",
//   //   },
//   // ]

//   // Handle parallax effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrollY(window.scrollY);
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const parallaxOffset = scrollY * 0.3;
//   const scrollTo = useCallback(
//     (index: number) => emblaApi?.scrollTo(index),
//     [emblaApi]
//   );

//   const onSelect = useCallback(() => {
//     if (!emblaApi) return;
//     setSelectedIndex(emblaApi.selectedScrollSnap());
//   }, [emblaApi]);

//   useEffect(() => {
//     if (!emblaApi) return;

//     setScrollSnaps(emblaApi.scrollSnapList());
//     onSelect();

//     emblaApi.on("select", onSelect);
//     emblaApi.on("reInit", onSelect);

//     const autoplayInterval = setInterval(() => {
//       if (emblaApi.canScrollNext()) {
//         emblaApi.scrollNext();
//       } else {
//         emblaApi.scrollTo(0);
//       }
//     }, 5000);

//     return () => {
//       emblaApi.off("select", onSelect);
//       clearInterval(autoplayInterval);
//     };
//   }, [emblaApi, onSelect]);

//   // Remove the slides array and use heroContent.slides instead

//   return (
//     <section className="relative h-[95vh]">
//       {/* Overlay for better text visibility */}
//       <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10 pointer-events-none" />
//       {/* Announcement Bar */}
//       <div className="absolute top-0 left-0 right-0 z-30">
//         <div className="bg-gold/90 text-white py-2 px-4 text-center text-sm font-medium">
//           <span className="font-bold">{heroContent.announcement.prefix}</span>{" "}
//           {heroContent.announcement.text}
//         </div>
//       </div>

//       {/* Embla Carousel */}
//       <div className="embla overflow-hidden h-full" ref={emblaRef}>
//         <div className="embla__container flex h-full">
//           {heroContent.slides.map((slide, index) => (
//             <div
//               key={index}
//               className="embla__slide flex-[0_0_100%] min-w-0 relative h-full"
//             >
//               <div
//                 className="absolute inset-0"
//                 style={{
//                   transform: `translateY(${parallaxOffset}px)`,
//                   transition: "transform 0.1s ease-out",
//                 }}
//               >
//                 <Image
//                   src={slide.image || "/placeholder.svg"}
//                   alt={slide.alt}
//                   fill
//                   className="object-cover"
//                   priority={index === 0}
//                   sizes="100vw"
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Content */}
//       <div className="absolute inset-0 z-20 flex items-center pointer-events-none">
//         <div className="container px-4 md:px-6">
//           <div className="max-w-2xl space-y-4">
//             <div className="space-y-2">
//               <p className="text-white/80 font-great-vibes text-2xl md:text-3xl">
//                 {t("hero.subtitle")}
//               </p>
//               <h1 className="font-playfair text-4xl font-bold tracking-tight text-white sm:text-5xl xl:text-6xl/none elegant-letter-spacing hero-text-shadow">
//                 {t("hero.tittle")}
//               </h1>
//             </div>
//             <p className="text-white/90 text-xl md:text-2xl">
//               {t("hero.description")}
//             </p>
//             {!user && (
//               <div className="flex flex-col sm:flex-row gap-4 pt-4">
//                 <a
//                   href={heroContent.cta.href}
//                   className="fancy-button fancy-button-primary pointer-events-auto"
//                 >
//                   {t("hero.button")}
//                 </a>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Indicators */}
//       <div
//         className={`absolute ${
//           isMobile ? "bottom-24" : "bottom-6"
//         } left-1/2 -translate-x-1/2 z-30 flex space-x-2`}
//       >
//         {scrollSnaps.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => scrollTo(index)}
//             className={`w-2 h-2 rounded-full transition-all ${
//               selectedIndex === index ? "w-6 bg-white" : "bg-white/50"
//             }`}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }

"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * HeroSection – Parallax Edge-Swipe slider (Framer Motion)
 *
 * Sandbox note: Using in-file fallbacks for heroContent, useIsMobile, useTranslation, useAuth
 * to avoid alias build errors in this environment.
 *
 * - Whole slide sweeps from container EDGE (±100%) based on direction
 * - Left: parallax image layers; Right: staged text (title -> description -> button)
 * - Bottom-right: fixed rolling counter ("01" only) with crisp vertical digits
 */

// -------------------- Local fallbacks (sandbox only) --------------------
const heroContent = {
  announcement: { prefix: "NEW", text: " Exclusive designs now available" },
  cta: { href: "#" },
  slides: [
    {
      image:
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1920&auto=format&fit=crop",
      alt: "Elegant woman in a white wedding dress",
    },
    {
      image:
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1920&auto=format&fit=crop",
      alt: "Woman in a red evening gown",
    },
    {
      image:
        "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?q=80&w=1920&auto=format&fit=crop",
      alt: "Woman in a formal blue dress",
    },
  ],
} as const;

function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return mobile;
}

function useTranslation() {
  const dict: Record<string, string> = {
    "hero.subtitle": "Timeless Elegance",
    "hero.tittle": "Airokom Boutique",
    "hero.description":
      "Discover handcrafted couture with exquisite details and modern silhouettes.",
    "hero.button": "Explore Collection",
  };
  return { t: (k: string) => dict[k] ?? k };
}

function useAuth() {
  return { user: null as null | { name: string } };
}

// -------------------- Helpers --------------------
function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
function wrapIndex(i: number, len: number): number {
  return ((i % len) + len) % len;
}

// Counter digits (odometer-style, single row visible)
const DIGIT_H = 40; // integer px to avoid sub-pixel bleed
function RollDigit({ d }: { d: number }) {
  const target = -d * DIGIT_H;
  return (
    <div
      className="relative w-[0.7em] overflow-hidden select-none font-mono"
      style={{ height: DIGIT_H, lineHeight: `${DIGIT_H}px` }}
    >
      <motion.div
        initial={{ y: target }}
        animate={{ y: target }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div
            key={n}
            className="flex items-center justify-center"
            style={{ height: DIGIT_H, lineHeight: `${DIGIT_H}px` }}
          >
            {n}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
function RollNumber({
  value,
  className = "",
}: {
  value: string | number;
  className?: string;
}) {
  const str = String(value);
  return (
    <div
      className={`inline-flex items-center ${className}`}
      style={{ lineHeight: `${DIGIT_H}px` }}
    >
      {str.split("").map((ch, i) =>
        ch >= "0" && ch <= "9" ? (
          <RollDigit key={i} d={parseInt(ch, 10)} />
        ) : (
          <span key={i} className="mx-1 select-none">
            {ch}
          </span>
        )
      )}
    </div>
  );
}

// -------------------- Component --------------------
export default function HeroSection() {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const { user } = useAuth();

  const slides = heroContent.slides.map(
    (s: { image: string; alt: string }, idx: number) => ({
      id: idx + 1,
      bg: s.image,
      mid: s.image,
      fg: s.image,
      alt: s.alt,
    })
  );

  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);

  const bgX = useTransform(x, (v) => v * -0.02);
  const bgY = useTransform(y, (v) => v * -0.02);
  const midX = useTransform(x, (v) => v * -0.06);
  const midY = useTransform(y, (v) => v * -0.06);
  const fgX = useTransform(x, (v) => v * -0.12);
  const fgY = useTransform(y, (v) => v * -0.12);

  useEffect(() => {
    stopAutoplay();
    timerRef.current = window.setTimeout(() => next(), 5000);
    return stopAutoplay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const stopAutoplay = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  const prev = () => {
    setDir(-1);
    setIndex((i) => wrapIndex(i - 1, slides.length));
  };
  const next = () => {
    setDir(1);
    setIndex((i) => wrapIndex(i + 1, slides.length));
  };
  const goTo = useCallback(
    (i: number) => {
      const target = wrapIndex(i, slides.length);
      const forward =
        wrapIndex(target - index, slides.length) <= slides.length / 2;
      setDir(forward ? 1 : -1);
      setIndex(target);
    },
    [index, slides.length]
  );

  const onPointerMove = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = ((e.clientX - rect.left) / rect.width - 0.5) * 200;
    const my = ((e.clientY - rect.top) / rect.height - 0.5) * 200;
    x.set(mx);
    y.set(my);
  };
  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  const dragConstraints = useMemo(() => ({ left: 0, right: 0 }), []);

  const current = slides[index];
  const total = slides.length;

  const pageVariants = {
    initial: (d: 1 | -1) => ({ x: d * 100 + "%", opacity: 1 }),
    animate: {
      x: "0%",
      opacity: 1,
      transition: { duration: 1.15, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (d: 1 | -1) => ({
      x: d * -100 + "%",
      opacity: 1,
      transition: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
    }),
  } as const;

  const titleVariants = {
    initial: (d: 1 | -1) => ({ x: d * 26, opacity: 0 }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 1.05, delay: 0.28, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (d: 1 | -1) => ({
      x: d * -26,
      opacity: 0,
      transition: { duration: 0.8 },
    }),
  } as const;
  const subtitleVariants = {
    initial: (d: 1 | -1) => ({ x: d * 22, opacity: 0 }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 1.05, delay: 0.42, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (d: 1 | -1) => ({
      x: d * -22,
      opacity: 0,
      transition: { duration: 0.8 },
    }),
  } as const;
  const buttonVariants = {
    initial: (d: 1 | -1) => ({ x: d * 18, opacity: 0 }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 1.05, delay: 0.56, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (d: 1 | -1) => ({
      x: d * -18,
      opacity: 0,
      transition: { duration: 0.8 },
    }),
  } as const;

  const layerEnter = (mult: number) => ({ x: dir * 12 * mult, opacity: 1 });
  const layerExit = (mult: number) => ({ x: dir * -12 * mult, opacity: 1 });

  return (
    <section className="relative h-[92vh] md:h-[92vh]">
      {/* Top announcement */}
      <div className="absolute top-0 left-0 right-0 z-30">
        <div className="bg-gold/90 text-white py-2 px-4 text-center text-sm font-medium">
          <span className="font-bold">{heroContent.announcement.prefix}</span>{" "}
          {heroContent.announcement.text}
        </div>
      </div>

      {/* Edge-swipe slider container */}
      <div
        ref={containerRef}
        className="relative h-full w-full overflow-hidden bg-white"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <AnimatePresence custom={dir}>
          <motion.div
            key={current.id}
            className="absolute inset-0"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            custom={dir}
          >
            <div className="grid h-full grid-cols-1 md:grid-cols-2">
              {/* LEFT: Parallax image (3 layers) */}
              <div className="relative h-full">
                {/* bg */}
                <motion.div
                  style={{ x: bgX, y: bgY, willChange: "transform" }}
                  initial={layerEnter(0.6)}
                  exit={layerExit(0.6)}
                  transition={{ duration: 1.2 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={current.bg}
                    alt={current.alt ?? "slide"}
                    fill
                    priority
                    className="object-cover object-top md:object-center"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                </motion.div>
                {/* mid */}
                <motion.div
                  style={{ x: midX, y: midY, willChange: "transform" }}
                  initial={layerEnter(1)}
                  exit={layerExit(1)}
                  transition={{ duration: 1.25 }}
                  className="absolute inset-0 mix-blend-overlay opacity-80"
                >
                  <Image
                    src={current.mid}
                    alt=""
                    fill
                    className="object-cover object-top md:object-center"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                </motion.div>
                {/* fg */}
                <motion.div
                  style={{ x: fgX, y: fgY, willChange: "transform" }}
                  initial={layerEnter(1.3)}
                  exit={layerExit(1.3)}
                  transition={{ duration: 1.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={current.fg}
                    alt=""
                    fill
                    className="object-cover object-top md:object-center"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                </motion.div>

                {/* MOBILE: Overlay content over the image instead of stacking */}
                {isMobile && (
                  <div className="absolute inset-0 z-10 flex items-end p-6 pt-24">
                    <div className="pointer-events-none w-full">
                      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      <motion.p
                        className="text-white/80 font-great-vibes text-2xl"
                        variants={subtitleVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        custom={dir}
                      >
                        {t("hero.subtitle")}
                      </motion.p>
                      <motion.h1
                        className="font-playfair text-4xl font-bold tracking-tight text-white elegant-letter-spacing hero-text-shadow mt-1"
                        variants={titleVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        custom={dir}
                      >
                        {t("hero.tittle")}
                      </motion.h1>
                      <motion.p
                        className="text-white/90 text-base mt-3 max-w-xl"
                        variants={subtitleVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        custom={dir}
                      >
                        {t("hero.description")}
                      </motion.p>
                      {!user && (
                        <motion.div
                          className="mt-5 pointer-events-auto"
                          variants={buttonVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          custom={dir}
                        >
                          <a
                            href={heroContent.cta.href}
                            className="fancy-button fancy-button-primary"
                          >
                            {t("hero.button")}
                          </a>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT: Content (staged) – hidden on mobile, visible on md+ */}
              <div className="relative hidden md:flex h-full items-center">
                <div className="relative z-10 px-6 md:px-12 py-10 pointer-events-none">
                  <div className="pointer-events-none absolute inset-0 -z-10 bg-white" />
                  <motion.p
                    className="text-zinc-600 font-great-vibes text-2xl md:text-3xl"
                    variants={subtitleVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    custom={dir}
                  >
                    {t("hero.subtitle")}
                  </motion.p>
                  <motion.h1
                    className="font-playfair text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl xl:text-6xl/none elegant-letter-spacing hero-text-shadow mt-1"
                    variants={titleVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    custom={dir}
                  >
                    {t("hero.tittle")}
                  </motion.h1>
                  <motion.p
                    className="text-zinc-700 text-lg md:text-xl mt-4 max-w-xl"
                    variants={subtitleVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    custom={dir}
                  >
                    {t("hero.description")}
                  </motion.p>
                  {!user && (
                    <motion.div
                      className="mt-6 pointer-events-auto"
                      variants={buttonVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      custom={dir}
                    >
                      <a
                        href={heroContent.cta.href}
                        className="fancy-button fancy-button-primary"
                      >
                        {t("hero.button")}
                      </a>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Swipe/Drag overlay */}
        <motion.div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={dragConstraints}
          dragElastic={0.2}
          onDragEnd={(e, info) => {
            const threshold = 120;
            if (info.offset.x < -threshold) {
              setDir(1);
              next();
            } else if (info.offset.x > threshold) {
              setDir(-1);
              prev();
            }
          }}
        />

        {/* Bottom-right counter (ONLY current number) */}
        <div className="pointer-events-none absolute bottom-4 right-5 z-20 text-white/90 md:text-zinc-900/90">
          <RollNumber
            value={`${pad2(index + 1)}`}
            className="text-3xl md:text-5xl font-semibold tabular-nums tracking-tight"
          />
        </div>

        {/* Bottom center controls (arrows + bullets) */}
        <div className="hidden md:block absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
          <div className="flex items-center gap-3 rounded-full bg-white/80 px-3 py-1.5 ring-1 ring-zinc-300 backdrop-blur">
            <button
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white ring-1 ring-zinc-300 hover:bg-zinc-100 transition"
              onClick={() => {
                setDir(-1);
                prev();
              }}
              aria-label="Previous"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-zinc-900"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? "w-5 bg-zinc-900"
                      : "w-1.5 bg-zinc-400 hover:bg-zinc-600"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white ring-1 ring-zinc-300 hover:bg-zinc-100 transition"
              onClick={() => {
                setDir(1);
                next();
              }}
              aria-label="Next"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-zinc-900"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Side arrows */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-3 md:px-4">
          <button
            className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-white ring-1 ring-zinc-300 hover:bg-zinc-100 transition"
            onClick={() => {
              setDir(-1);
              prev();
            }}
            aria-label="Previous slide"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-zinc-900"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-white ring-1 ring-zinc-300 hover:bg-zinc-100 transition"
            onClick={() => {
              setDir(1);
              next();
            }}
            aria-label="Next slide"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-zinc-900"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// Lightweight unit tests (console)
// -------------------------------------------------------------
(function runHeroSliderTests() {
  try {
    console.assert(
      Array.isArray(heroContent.slides) && heroContent.slides.length >= 1,
      "heroContent.slides must have items"
    );
    console.assert(pad2(1) === "01" && pad2(10) === "10", "pad2 basic");
    console.assert(
      pad2(0) === "00" && pad2(9) === "09" && pad2(123) === "123",
      "pad2 edge cases"
    );
    console.assert(
      wrapIndex(-1, 5) === 4 && wrapIndex(5, 5) === 0 && wrapIndex(-7, 5) === 3,
      "wrapIndex checks"
    );

    const testSlides = heroContent.slides.map(
      (s: { image: string }, i: number) => ({
        id: i + 1,
        bg: s.image,
        mid: s.image,
        fg: s.image,
      })
    );
    console.assert(
      testSlides.length === heroContent.slides.length,
      "slides mapping preserves length"
    );
    console.assert(
      wrapIndex(999, 1) === 0 && wrapIndex(-999, 1) === 0,
      "wrapIndex len=1 always 0"
    );

    const { t } = {
      t: (k: string) => ({ "hero.subtitle": "Timeless Elegance" }[k] ?? k),
    };
    console.assert(typeof t("hero.subtitle") === "string", "t returns string");

    // New tests for additional edge cases
    console.assert(
      pad2(1000) === "1000",
      "pad2 large number should not truncate"
    );
    console.assert(wrapIndex(-12, 7) === 2, "wrapIndex(-12, 7) === 2");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Hero slider tests encountered an error:", e);
  }
})();
