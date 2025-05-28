"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, SlidersHorizontal, X, Percent, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"
import FilterModal from "@/components/filter-modal"
import HeartButton from "@/components/heart-button"

export default function ShopByTypePage() {
  const searchParams = useSearchParams()
  const typeParam = searchParams.get("type")

  // State for filters
  const [productType, setProductType] = useState<string[]>(typeParam ? [typeParam] : [])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [groupedByVendor, setGroupedByVendor] = useState<Record<string, any[]>>({})
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])

  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  // Apply filters and group by vendor
  useEffect(() => {
    // Filter products by type and other filters
    const filtered = allProducts.filter((product) => {
      // Filter by product type if any selected
      if (productType.length > 0 && !productType.includes(product.type)) {
        return false
      }

      // Filter by vendor if any selected
      if (selectedVendors.length > 0 && !selectedVendors.includes(product.vendor.name)) {
        return false
      }

      // Filter by price range
      const price = Number.parseFloat(product.price)
      if (price < priceRange[0] || price > priceRange[1]) {
        return false
      }

      // Filter by search term
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      return true
    })

    setFilteredProducts(filtered)

    // Group filtered products by vendor
    const grouped = filtered.reduce(
      (acc, product) => {
        const vendorName = product.vendor.name
        if (!acc[vendorName]) {
          acc[vendorName] = []
        }
        acc[vendorName].push(product)
        return acc
      },
      {} as Record<string, any[]>,
    )

    setGroupedByVendor(grouped)

    // Update active filters
    const filters = []
    if (productType.length > 0) filters.push(...productType)
    if (selectedVendors.length > 0) filters.push(...selectedVendors)
    if (priceRange[0] > 0 || priceRange[1] < 1000) filters.push(`$${priceRange[0]}-$${priceRange[1]}`)
    if (searchTerm) filters.push(`"${searchTerm}"`)
    setActiveFilters(filters)
  }, [productType, selectedVendors, priceRange, searchTerm])

  // Handle add to cart
  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: Number.parseFloat(product.price),
      originalPrice: product.originalPrice ? Number.parseFloat(product.originalPrice) : undefined,
      quantity: 1,
      images: [product.image],
      selectedSize: "m", // Default size
      selectedColor: "black", // Default color
      type: product.type,
      vendor: product.vendor,
    })
  }

  // Handle wishlist toggle
  const handleWishlistToggle = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        images: [product.image],
        type: product.type,
        vendor: product.vendor,
      })
    }
  }

  // Handle applying filters from modal
  const handleApplyFilters = (filters: any) => {
    setPriceRange(filters.priceRange)
    setSearchTerm(filters.searchTerm)
    setSelectedVendors(filters.vendors)
    setProductType(filters.types)
  }

  // Reset filters
  const resetFilters = () => {
    setProductType(typeParam ? [typeParam] : [])
    setPriceRange([0, 1000])
    setSelectedVendors([])
    setSearchTerm("")
  }

  // Remove a specific filter
  const removeFilter = (filter: string) => {
    if (filter.startsWith("$")) {
      setPriceRange([0, 1000])
    } else if (filter.startsWith('"')) {
      setSearchTerm("")
    } else if (["New", "Used", "Rental"].includes(filter)) {
      // Don't remove the type filter if it's the one from the URL
      if (typeParam !== filter) {
        setProductType((prev) => prev.filter((type) => type !== filter))
      }
    } else {
      setSelectedVendors((prev) => prev.filter((vendor) => vendor !== filter))
    }
  }

  // Get page title based on selected type
  const getPageTitle = () => {
    if (productType.length === 1) {
      return `${productType[0]} Dresses`
    }
    return "Shop by Type"
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="container py-8 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{getPageTitle()}</h1>
              <p className="max-w-[700px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {productType.length === 1 &&
                  productType[0] === "Used" &&
                  "Browse our collection of pre-loved dresses at amazing prices"}
                {productType.length === 1 &&
                  productType[0] === "Rental" &&
                  "Rent designer dresses for a fraction of the cost"}
                {productType.length === 1 &&
                  productType[0] === "New" &&
                  "Discover brand new dresses from top designers and boutiques"}
                {productType.length !== 1 && "Browse our collection of dresses by type"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container py-8 px-4 md:px-6">
        <div className="flex flex-col gap-6">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsFilterModalOpen(true)}>
                <SlidersHorizontal className="h-4 w-4" />
                Filter
              </Button>
            </div>

            <div className="text-sm text-slate-500">Showing {filteredProducts.length} products</div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium">Active Filters:</span>
              {activeFilters.map((filter) => (
                <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                  {filter}
                  <button onClick={() => removeFilter(filter)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button variant="link" size="sm" onClick={resetFilters} className="text-sm text-slate-500">
                Clear All
              </Button>
            </div>
          )}

          {/* Products by Vendor */}
          {Object.keys(groupedByVendor).length > 0 ? (
            <div className="space-y-10">
              {Object.entries(groupedByVendor).map(([vendorName, products]) => (
                <div key={vendorName} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">{vendorName}</h2>
                    <Link href={`/vendors/${products[0].vendor.slug}`} className="text-sm text-gold hover:underline">
                      View all from this vendor
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <div key={product.id} className="group relative">
                        <div className="relative overflow-hidden rounded-lg">
                          {/* Discount Badge */}
                          <div className="absolute top-2 left-2 z-30">
                            <div className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md flex items-center justify-center gap-1">
                              <Percent className="h-3 w-3" />
                              <div className="w-[55px] h-[16px] flex items-center justify-center">40% OFF</div>
                            </div>
                          </div>

                          {product.type && (
                            <div className="absolute top-12 left-2 z-10">
                              <Badge
                                className={`rounded-md
                                  ${product.type === "New" ? "bg-green-500" : ""}
                                  ${product.type === "Used" ? "bg-amber-500" : ""}
                                  ${product.type === "Rental" ? "bg-purple-500" : ""}
                                `}
                              >
                                {product.type}
                              </Badge>
                            </div>
                          )}

                          <div className="absolute top-2 right-2 z-20">
                            <div className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
                              <HeartButton productId={product.id} size="sm" />
                              <span className="sr-only">Add to wishlist</span>
                            </div>
                          </div>

                          <Link href={`/products/${product.id}`} className="block">
                            <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                              />
                            </div>
                          </Link>
                        </div>

                        <Link href={`/products/${product.id}`} className="block">
                          <div className="mt-3 space-y-1">
                            <h3
                              className="font-medium group-hover:text-gold transition-colors truncate overflow-hidden"
                              title={product.name}
                            >
                              {product.name}
                            </h3>
                            <p className="text-sm text-slate-500">{product.vendor.name}</p>

                            {/* Ratings */}
                            <div className="flex items-center gap-1 mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3.5 w-3.5 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-slate-200"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-slate-500">(24)</span>
                            </div>

                            <div className="flex justify-between items-center">
                              <p className="font-bold">
                                ${typeof product.price === "number" ? product.price.toFixed(2) : product.price}
                              </p>
                              {product.originalPrice && (
                                <p className="text-sm text-slate-500 line-through">
                                  $
                                  {typeof product.originalPrice === "number"
                                    ? product.originalPrice.toFixed(2)
                                    : product.originalPrice}
                                </p>
                              )}
                            </div>

                            {/* Total Sales */}
                            <p className="text-xs text-slate-500">86 sold</p>
                          </div>
                        </Link>

                        {/* Cart Button */}
                        <button
                          className="cart-button noselect w-full mt-3"
                          onClick={(e) => {
                            e.preventDefault()
                            handleAddToCart(product)
                          }}
                        >
                          <span className="text">Add to Cart</span>
                          <span className="icon">
                            <ShoppingBag className="h-5 w-5" />
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center">
              <h3 className="font-bold text-lg">No products found</h3>
              <p className="text-slate-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
              <Button variant="outline" className="mt-4" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={{
          priceRange,
          searchTerm,
          vendors: selectedVendors,
          types: productType,
        }}
      />
    </div>
  )
}

// Sample data for products - using the same data structure as in the categories page
const allProducts = [
  // NEW PRODUCTS
  {
    id: 101,
    name: "Silk Wedding Gown",
    category: "Wedding",
    type: "New",
    price: "1299",
    originalPrice: "1499",
    image: "https://images.unsplash.com/photo-1594612076394-2a31c2e4c726?q=80&w=1000&auto=format&fit=crop",
    vendor: {
      name: "Elegance",
      slug: "elegance",
    },
  },
  {
    id: 103,
    name: "Princess Wedding Dress",
    category: "Wedding",
    type: "New",
    price: "1499",
    image: "https://images.unsplash.com/photo-1550151103-401cbd2a6614?q=80&w=1000&auto=format&fit=crop",
    vendor: {
      name: "Elegance",
      slug: "elegance",
    },
  },
  {
    id: 105,
    name: "Minimalist Wedding Dress",
    category: "Wedding",
    type: "New",
    price: "999",
    image: "https://images.unsplash.com/photo-1583804555142-aaa6bf4575b9?q=80&w=1000&auto=format&fit=crop",
    vendor: {
      name: "Elegance",
      slug: "elegance",
    },
  },
  {
    id: 108,
    name: "Romantic Wedding Dress",
    category: "Wedding",
    type: "New",
    price: "1199",
    image: "https://images.unsplash.com/photo-1595158232095-01d2a6c0f841?q=80&w=1000&auto=format&fit=crop",
    vendor: {
      name: "Bella Boutique",
      slug: "bella-boutique",
    },
  },
  {
    id: 110,
    name: "Classic A-line Wedding Dress",
    category: "Wedding",
    type: "New",
    price: "899",
    image: "https://images.unsplash.com/photo-1594612076394-2a31c2e4c726?q=80&w=1000&auto=format&fit=crop",
    vendor: {
      name: "Bella Boutique",
      slug: "bella-boutique",
    },
  },
  {
    id: 113,
    name: "Beach Wedding Gown",
    category: "Wedding",
    type: "New",
    price: "699",
    image: "https://images.unsplash.com/photo-1525257831700-9e2e6b3e5ec3?q=80&w=1000&auto=format&fit=crop",
    vendor: {
      name: "Dress Haven",
      slug: "dress-haven",
    },
  },

  // USED PRODUCTS
  {
    id: 102,
    name: "Lace Bridal Gown",
    category: "Wedding",
    type: "Used",
    price: "599",
    originalPrice: "1299",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=1000&auto=format&fit=crop",
    vendor: {
      name: "Elegance",
      slug: "elegance",
    },
  },
  {
    id: 106,
    name: "Vintage Wedding Dress",
    category: "Wedding",
    type: "Used",
    price: "799",
    originalPrice: "1599",
    image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=1000&auto=format&fit=crop",
    vendor: {
      name: "Bella Boutique",
      slug: "bella-boutique",
    },
  },
  {
    id: 107,
    name: "Traditional Wedding Gown",
    category: "Wedding",
    type: "Used",
    price: "699",
    originalPrice: "1399",
    image: "https://images.unsplash.com/photo-1583804555142-aaa6bf4575b9?q=80&w=1000&auto=format&fit=crop",
    vendor: {
      name: "Bella Boutique",
      slug: "bella-boutique",
    },
  },
  {
    id: 114,
    name: "Simple Wedding Dress",
    category: "Wedding",
    type: "Used",
    price: "399",
    originalPrice: "899",
    image: "https://images.unsplash.com/photo-1583804555142-aaa6bf4575b9?q=80&w=1000&auto=format&fit=crop",
    vendor: {
      name: "Dress Haven",
      slug: "dress-haven",
    },
  },

  // RENTAL PRODUCTS
  {
    id: 104,
    name: "Beaded Wedding Gown",
    category: "Wedding",
    type: "Rental",
    price: "349",
    image: "https://images.unsplash.com/photo-1525257831700-9e2e6b3e5ec3?q=80&w=1000&auto=format&fit=crop",
    vendor: {
      name: "Elegance",
      slug: "elegance",
    },
  },
  {
    id: 109,
    name: "Boho Wedding Gown",
    category: "Wedding",
    type: "Rental",
    price: "279",
    image: "https://images.unsplash.com/photo-1550151103-401cbd2a6614?q=80&w=1000&auto=format&fit=crop",
    vendor: {
      name: "Bella Boutique",
      slug: "bella-boutique",
    },
  },
  {
    id: 111,
    name: "Modern Wedding Gown",
    category: "Wedding",
    type: "Rental",
    price: "299",
    image: "https://images.unsplash.com/photo-1585241920473-b472eb9ffbae?q=80&w=1000&auto=format&fit=crop",
    vendor: {
      name: "Dress Haven",
      slug: "dress-haven",
    },
  },
  {
    id: 112,
    name: "Destination Wedding Dress",
    category: "Wedding",
    type: "Rental",
    price: "249",
    image: "https://images.unsplash.com/photo-1550151103-401cbd2a6614?q=80&w=1000&auto=format&fit=crop",
    vendor: {
      name: "Dress Haven",
      slug: "dress-haven",
    },
  },
  {
    id: 115,
    name: "Elegant Wedding Gown",
    category: "Wedding",
    type: "Rental",
    price: "329",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=1000&auto=format&fit=crop",
    vendor: {
      name: "Dress Haven",
      slug: "dress-haven",
    },
  },
]
