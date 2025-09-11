"use client"

import { useRef, useEffect } from "react"
import { Star, Quote } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    const cards = containerRef.current.querySelectorAll(".testimonial-card")
    cards.forEach((card) => observer.observe(card))

    return () => {
      cards.forEach((card) => observer.unobserve(card))
    }
  }, [])

  const testimonials = [
    {
      rating: 5,
      text: "I found my dream wedding dress through DressMarket. The vendor selection process made it so easy to find exactly what I was looking for!",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
      type: "New",
      location: "New York",
    },
    {
      rating: 5,
      text: "Renting a designer gown for my gala was so affordable and easy. The dress arrived in perfect condition and I felt amazing!",
      name: "Emily Chen",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
      type: "Rental",
      location: "Los Angeles",
    },
    {
      rating: 4,
      text: "I bought a pre-loved cocktail dress that looked brand new for half the retail price. The filtering system made it easy to find exactly what I wanted.",
      name: "Jessica Miller",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop",
      type: "Used",
      location: "Chicago",
    },
  ]

  return (
    <section className="py-12 md:py-16 bg-slate-50 overflow-hidden">
      <div className="container px-4 md:px-6 relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-playfair">
                What Our Customers Say
              </h2>
              <p className="max-w-[700px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear from people who have found their perfect dress through our platform
              </p>
            </div>
          </motion.div>

          <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="testimonial-card bg-white p-6 rounded-lg shadow-sm border group hover:shadow-lg transition-all duration-500 relative overflow-hidden"
              >
                {/* Decorative quote icon */}
                <div className="absolute -top-2 -right-2 text-gold/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                  <Quote size={40} strokeWidth={1} />
                </div>

                {/* Animated border on hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/20 rounded-lg transition-all duration-500"></div>

                {/* Card content with animations */}
                <div className="flex items-center gap-2 mb-4 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 transition-all duration-300 ${
                        i < testimonial.rating
                          ? "text-yellow-400 fill-yellow-400 group-hover:scale-110"
                          : "text-slate-200"
                      }`}
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>

                <p className="text-slate-600 mb-4 relative z-10 group-hover:text-slate-800 transition-colors duration-300">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-3 relative z-10">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-500">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium group-hover:text-gold transition-colors duration-300">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-slate-500">
                      <span className="text-gold">{testimonial.type}</span> Customer • {testimonial.location}
                    </p>
                  </div>
                </div>

                {/* Animated background on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </div>

          {/* Add a subtle animation to encourage scrolling/interaction */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex justify-center mt-10"
          >
            <a href="#" className="fancy-button fancy-button-secondary">
              View All Reviews
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
