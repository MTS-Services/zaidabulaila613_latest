"use client"

import { useState } from "react"
import Image from "next/image"
import { Tag } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AnimatedButton } from "./animated-button"

interface Vendor {
  name: string
  slug: string
  logo: string
  coverImage: string
  description: string
  productsCount: number
  tags: string[]
}

interface VendorGridProps {
  vendors: Vendor[]
}

export function VendorGrid({ vendors }: VendorGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hoveredButtons, setHoveredButtons] = useState<Record<number, boolean>>({})

  // Filter vendors based on search query
  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleButtonMouseEnter = (index: number) => {
    setHoveredButtons((prev) => ({ ...prev, [index]: true }))
  }

  const handleButtonMouseLeave = (index: number) => {
    setHoveredButtons((prev) => ({ ...prev, [index]: false }))
  }

  const handleNavigate = (slug: string) => {
    window.location.href = `/vendors/${slug}`
  }

  return (
    <>
      {filteredVendors.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No vendors found</h2>
          <p className="text-slate-500">Try adjusting your search criteria</p>
          <Button className="mt-4 bg-gold hover:bg-gold/90 text-white" onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </div>
      ) : (
        <>
          {/* Mobile View */}
          <div className="grid grid-cols-2 gap-3 lg:hidden">
            {filteredVendors.map((vendor, index) => (
              <div
                key={`mobile-${index}`}
                className="block h-[240px] rounded-lg overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all group cursor-pointer"
                onClick={() => handleNavigate(vendor.slug)}
              >
                <div className="relative h-full">
                  {/* Background image */}
                  <div className="absolute inset-0 w-full h-full">
                    <Image
                      src={vendor.coverImage || "/placeholder.svg?height=240&width=150"}
                      alt={vendor.name}
                      fill
                      className="object-cover brightness-[0.85] group-hover:brightness-[0.75] transition-all"
                      sizes="(max-width: 640px) 42vw, 33vw"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=240&width=150"
                      }}
                    />
                    {/* Overlay gradient for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>

                  <div className="p-3 flex flex-col items-start text-left h-full relative z-10">
                    <h3 className="font-medium text-sm text-white group-hover:text-gold transition-colors line-clamp-1">
                      {vendor.name}
                    </h3>
                    <div className="bg-gold/80 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-lg mt-1 mb-1 inline-block">
                      40% OFF
                    </div>
                    <div className="text-[10px] text-white/90 line-clamp-3 mb-2 mt-auto">{vendor.description}</div>

                    {/* Replace the custom button with NeumorphicButton */}
                    <AnimatedButton
                text="View Collection"
                href={`/vendors/${vendor.slug}`}
                size="sm"
                asDiv={true}
                onClick={() => {
                  window.location.href = `/vendors/${vendor.slug}`
                }}
              />
            
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View remains unchanged as it already uses NeumorphicButton */}
          <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">
            {filteredVendors.map((vendor, index) => (
              <div
                key={`desktop-${index}`}
                className="block h-[280px] rounded-lg overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all group cursor-pointer"
                onClick={() => handleNavigate(vendor.slug)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative h-full">
                  {/* Background image */}
                  <div className="absolute inset-0 w-full h-full">
                    <Image
                      src={vendor.coverImage || "/placeholder.svg?height=280&width=175"}
                      alt={vendor.name}
                      fill
                      className="object-cover brightness-[0.85] group-hover:brightness-[0.75] transition-all"
                      sizes="25vw"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=280&width=175"
                      }}
                    />
                    {/* Overlay gradient for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>

                  <div className="p-5 flex flex-col items-start text-left h-full relative z-10">
                    <div className="flex-1 flex flex-col justify-between h-full">
                      <div>
                        <h3 className="font-medium text-base text-white group-hover:text-gold transition-colors">
                          {vendor.name}
                        </h3>
                        <div className="bg-gold/80 text-white text-xs font-medium px-2 py-0.5 rounded-lg mt-1 mb-2 inline-block">
                          40% OFF
                        </div>
                      </div>

                      <div className="mt-auto">
                        <div className="text-xs text-white/90 line-clamp-3 mb-3">{vendor.description}</div>

                        {/* Custom View Collection Button */}
                        <AnimatedButton
                text="View Collection"
                href={`/vendors/${vendor.slug}`}
                size="sm"
                asDiv={true}
                onClick={() => {
                  window.location.href = `/vendors/${vendor.slug}`
                }}
              />
                   
                      </div>
                    </div>

                  </div>

                  {/* Add discount badge with animation when hovered */}
            
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination or load more button could be added here */}
      {filteredVendors.length > 0 && filteredVendors.length < vendors.length && (
        <div className="flex justify-center mt-8">
     
        </div>
      )}
    </>
  )
}

