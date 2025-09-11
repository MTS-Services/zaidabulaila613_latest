"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface ImageGalleryProps {
  images: {
    src: string
    alt: string
  }[]
  className?: string
}

export default function ImageGallery({ images, className = "" }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="relative overflow-hidden rounded-lg shadow-md cursor-pointer"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedImage(index)}
          >
            <div className="aspect-[4/3] relative">
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-4xl max-h-[90vh] w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={images[selectedImage].src || "/placeholder.svg"}
                alt={images[selectedImage].alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            <button
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white"
              onClick={() => setSelectedImage(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
