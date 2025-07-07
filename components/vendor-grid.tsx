"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, Tag } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AnimatedButton } from "./animated-button"
import { ShopItem, ShopsResponse } from "@/types/shop"
import { config } from "@/constants/app"
import { useQuery } from "@apollo/client"
import { GET_SHOPS } from "@/graphql/query"
import { useTranslation } from "@/hooks/use-translation"
import Loader from "./loader"
import { Input } from "./ui/input"



interface VendorGridProps {
  vendors: ShopItem[]
}

export function VendorGrid() {

  const { language } = useTranslation()
  const { loading, error, data, refetch } = useQuery<ShopsResponse>(GET_SHOPS, {
    variables: {
      language: language,
      page: 1,
      limit: 10,
      search: "",
      sortField: "createdAt",
      sortOrder: "desc",
    },
    fetchPolicy: 'network-only',
  });
  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hoveredButtons, setHoveredButtons] = useState<Record<number, boolean>>({})

  // Filter vendors based on search query
  // const filteredVendors = vendors.filter(
  //   (vendor) =>
  //     vendor.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     vendor.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  // )

  const vendorsData = data?.shops.data || []
  const count = data?.shops?.total

  const handleButtonMouseEnter = (index: number) => {
    setHoveredButtons((prev) => ({ ...prev, [index]: true }))
  }

  const handleButtonMouseLeave = (index: number) => {
    setHoveredButtons((prev) => ({ ...prev, [index]: false }))
  }

  const handleNavigate = (slug: string) => {
    window.location.href = `/vendors/${slug}`
  }

  const handleSearch = () => {
    refetch({
      language: language,
      page: 1,
      limit: 10,
      search: searchQuery,
      sortField: "createdAt",
      sortOrder: "desc",
    })
  }
const {t} = useTranslation();

  return (
    <>
      
      {count === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">{t('vendorpage.novendor')}</h2>
          <p className="text-slate-500">{t('vendorpage.try')}</p>
          <Button className="mt-4 bg-gold hover:bg-gold/90 text-white" onClick={() => setSearchQuery("")}>
            {t('vendorpage.clear')}
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-white border-b">
            <div className="container mx-auto py-8 px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-playfair">{t('vendorpage.title')}</h1>
                  <p className="max-w-[700px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    {t('vendorpage.description')}
                  </p>
                </div>
              </div>

              <div className="max-w-md mx-auto mt-6">
                <form onSubmit={() => { handleSearch() }}>
                  <div className="relative">

                    <Input
                      type="search"
                      placeholder= {t('vendorpage.placeholder')}
                      className="w-full bg-slate-50 pl-8 rounded-lg border-slate-200"
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  </div>

                </form>
              </div>

            </div>
          </div>
          {/* Mobile View */}
          <div className="grid grid-cols-2 gap-3 lg:hidden">
            {vendorsData.map((vendor, index) => (
              <div
                key={`mobile-${index}`}
                className="block h-[240px] rounded-lg overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all group cursor-pointer"
                onClick={() => handleNavigate(vendor.id)}
              >
                <div className="relative h-full">
                  {/* Background image */}
                  <div className="absolute inset-0 w-full h-full">
                    <Image
                      src={vendor.profileImage?.path ? config.API_URL + vendor.profileImage?.path : "/placeholder.svg?height=240&width=150"}
                      alt={vendor.shopName}
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
                      {vendor.shopName}
                    </h3>
                    <div className="bg-gold/80 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-lg mt-1 mb-1 inline-block">
                      40% OFF
                    </div>
                    <div className="text-[10px] text-white/90 line-clamp-3 mb-2 mt-auto">{vendor.description}</div>

                    {/* Replace the custom button with NeumorphicButton */}
                    <AnimatedButton
                      text="View Collection"
                      href={`/vendors/${vendor.id}`}
                      size="sm"
                      asDiv={true}
                      onClick={() => {
                        window.location.href = `/vendors/${vendor.id}`
                      }}
                    />

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View remains unchanged as it already uses NeumorphicButton */}
          <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">
            {vendorsData.map((vendor, index) => (
              <div
                key={`desktop-${index}`}
                className="block h-[280px] rounded-lg overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all group cursor-pointer"
                onClick={() => handleNavigate(vendor.id)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative h-full">
                  {/* Background image */}
                  <div className="absolute inset-0 w-full h-full">
                    <Image
                      src={vendor.profileImage?.path ? config.API_URL + vendor.profileImage?.path : "/placeholder.svg?height=280&width=175"}
                      alt={vendor.shopName}
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
                          {vendor.shopName}
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
                          href={`/vendors/${vendor.id}`}
                          size="sm"
                          asDiv={true}
                          onClick={() => {
                            window.location.href = `/vendors/${vendor.id}`
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
      {loading && <Loader />}

      {/* Pagination or load more button could be added here */}
      {/* {filteredVendors.length > 0 && filteredVendors.length < vendors.length && (
        <div className="flex justify-center mt-8">
     
        </div>
      )} */}
    </>
  )
}

