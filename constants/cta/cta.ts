export const ctaContent = {
  title: "Ready to Find Your Perfect Dress?",
  description: "Start your search now and discover thousands of options from trusted vendors",
  button: {
    text: "Start Shopping",
    href: "/",
    variant: "white" as const,
  },
  animatedBag: {
    initial: {
      y: -100,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
    },
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 100,
      duration: 1.5,
    },
    swing: {
      rotate: [0, 3, 0, -3, 0],
      transition: {
        duration: 2.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
    styles: {
      string: {
        height: "h-16",
        width: "w-1",
        background: "bg-white/40",
      },
      bag: {
        size: 48,
        color: "text-white",
        shadow: "drop-shadow-md",
      },
    },
  },
  styles: {
    section: {
      padding: "py-12 md:py-16",
      background: "bg-gold",
      overflow: "relative overflow-hidden",
    },
    container: {
      padding: "px-4 md:px-6",
    },
    title: {
      fontSize: "text-3xl sm:text-4xl md:text-5xl",
      fontWeight: "font-bold",
      tracking: "tracking-tighter",
      color: "text-white",
      font: "font-playfair",
    },
    description: {
      maxWidth: "max-w-[700px]",
      color: "text-white/90",
      responsive: "md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed",
    },
  },
}