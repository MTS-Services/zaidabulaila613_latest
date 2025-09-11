"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ShoppingBag, X, Search, SlidersHorizontal, Percent, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"
import FilterModal from "@/components/filter-modal"
import HeartButton from "@/components/heart-button"
import { gql, useQuery } from "@apollo/client"
import { useCategory } from "@/contexts/category-context"
import { useParams, useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"
import { ProductsResponse } from "@/types/product"
import { GET_PRODUCTS } from "@/graphql/query"
import { useCurrency } from "@/contexts/currency-context"
import ProductList from "@/interfaces/product/productList"



export default function CategoryPage() {
  // Find the category based on the slug
  // const category = categories.find((c) => c.slug === params.slug) || categories[0]

  const params = useParams(); // ✅ safe
  const slug = params?.slug as string;
  if (!slug) return null;

  const router = useRouter()
  // State for filters
  const [productType, setProductType] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [groupedByVendor, setGroupedByVendor] = useState<Record<string, any[]>>({})
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const { categories } = useCategory()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { language } = useTranslation()
  const { selectedCurrency } = useCurrency()

  // Apply filters and group by vendor
  // useEffect(() => {
  //   // Filter products by category and other filters
  //   const filtered = allProducts.filter((product) => {
  //     // Filter by category
  //     if (product.category.toLowerCase() !== category.name.toLowerCase()) {
  //       return false
  //     }

  //     // Filter by product type if any selected
  //     if (productType.length > 0 && !productType.includes(product.type)) {
  //       return false
  //     }

  //     // Filter by vendor if any selected
  //     if (selectedVendors.length > 0 && !selectedVendors.includes(product.vendor.name)) {
  //       return false
  //     }

  //     // Filter by price range
  //     const price = Number.parseFloat(product.price)
  //     if (price < priceRange[0] || price > priceRange[1]) {
  //       return false
  //     }

  //     // Filter by search term
  //     if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
  //       return false
  //     }

  //     return true
  //   })

  //   setFilteredProducts(filtered)

  //   // Group filtered products by vendor
  //   const grouped = filtered.reduce(
  //     (acc, product) => {
  //       const vendorName = product.vendor.name
  //       if (!acc[vendorName]) {
  //         acc[vendorName] = []
  //       }
  //       acc[vendorName].push(product)
  //       return acc
  //     },
  //     {} as Record<string, any[]>,
  //   )

  //   setGroupedByVendor(grouped)

  //   // Update active filters
  //   const filters = []
  //   if (productType.length > 0) filters.push(...productType)
  //   if (selectedVendors.length > 0) filters.push(...selectedVendors)
  //   if (priceRange[0] > 0 || priceRange[1] < 1000) filters.push(`$${priceRange[0]}-$${priceRange[1]}`)
  //   if (searchTerm) filters.push(`"${searchTerm}"`)
  //   setActiveFilters(filters)
  // }, [category.name, productType, selectedVendors, priceRange, searchTerm])

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
    setProductType([])
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
      setProductType((prev) => prev.filter((type) => type !== filter))
    } else {
      setSelectedVendors((prev) => prev.filter((vendor) => vendor !== filter))
    }
  }


  const cat = categories.find((el) => el.id === slug)
  if (!cat) {
    // router.push('/404')
    return null
  }
  const catName = language === "AR" ? cat?.name.ar : cat?.name.en

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Category Header */}
      <div className="relative h-64 md:h-80">
        <Image src={"https://images.unsplash.com/photo-1594612076394-2a31c2e4c726?q=80&w=1000&auto=format&fit=crop"} alt={catName || ""} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex flex-col">
            <div className="flex items-center text-white/80 text-sm mb-2">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <ChevronRight className="h-3 w-3 mx-1" />
              <span>Categories</span>
              <ChevronRight className="h-3 w-3 mx-1" />
              <span>{catName}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white font-playfair">{catName}</h1>
          </div>
        </div>
      </div>

      <ProductList categoryId={cat.id} searchPlaceHolder={`Search in ${catName}`} />
    </div>
  )
}

// Sample data for categories
const categories = [
  {
    name: "WEDDING",
    slug: "wedding",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "EVENING",
    slug: "evening",
    image: "https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "CASUAL",
    slug: "casual",
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "FORMAL",
    slug: "formal",
    image: "https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "COCKTAIL",
    slug: "cocktail",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "PROM",
    slug: "prom",
    image: "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "BRIDAL",
    slug: "bridal",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "BRIDESMAID",
    slug: "bridesmaid",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "MATERNITY",
    slug: "maternity",
    image: "https://images.unsplash.com/photo-1556139954-ec19cce61d61?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "PLUS SIZE",
    slug: "plus-size",
    image: "https://images.unsplash.com/photo-1603217192634-61068e4d4bf9?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "PETITE",
    slug: "petite",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "VINTAGE",
    slug: "vintage",
    image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "DESIGNER",
    slug: "designer",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "TRADITIONAL",
    slug: "traditional",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "SEASONAL",
    slug: "seasonal",
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "ACCESSORIES",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=1000&auto=format&fit=crop",
  },
]

// Sample data for products
const allProducts = [
  // WEDDING CATEGORY
  // Elegance vendor - Wedding
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

  // Bella Boutique vendor - Wedding
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

  // EVENING CATEGORY
  // Elegance vendor - Evening
  {
    id: 201,
    name: "Beaded Evening Dress",
    category: "Evening",
    type: "New",
    price: "899",
    image: "https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=1000&auto=format&fit=crop",
    vendor: {
      name: "Elegance",
      slug: "elegance",
    },
  },
  {
    id: 202,
    name: "Silk Evening Gown",
    category: "Evening",
    type: "New",
    price: "799",
    image: "https://images.unsplash.com/photo-1559673950-46c63c31bc57?q=80&w=1000&auto=format&fit=crop",
    vendor: {
      name: "Elegance",
      slug: "elegance",
    },
  },
]
