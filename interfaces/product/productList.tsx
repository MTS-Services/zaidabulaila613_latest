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
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"
import { ProductsResponse } from "@/types/product"
import { GET_PRODUCTS } from "@/graphql/query"
import { useCurrency } from "@/contexts/currency-context"
import ProductCard from "@/components/productCard"
import Loader from "@/components/loader"
import { useUpdateQueryParams } from "@/hooks/useSearchParams"


interface ProductListProps {
    searchPlaceHolder?: string
    categoryId?: string
    type?: string
}

export default function ProductList({ searchPlaceHolder, categoryId,
    type }: ProductListProps) {
    // Find the category based on the slug
    // const category = categories.find((c) => c.slug === params.slug) || categories[0]
    const router = useRouter()
    const params = useSearchParams()
    const searchQuery = params.get('search')
    const minPrice = params.get('minPrice')
    const maxPrice = params.get('maxPrice')
    const colors = params.get('colors')
    const categoryIds = params.get('categories')
    const vendorParam = params.get('vendors')
    const sizeParam = params.get('sizes')
    // State for filters
    const [productType, setProductType] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
    const [filteredProducts, setFilteredProducts] = useState<any[]>([])
    const [groupedByVendor, setGroupedByVendor] = useState<Record<string, any[]>>({})
    const [selectedVendors, setSelectedVendors] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState(searchQuery ? searchQuery : "")
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
    const [activeFilters, setActiveFilters] = useState<string[]>([])
    const { categories } = useCategory()
    const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()
    const { addToCart } = useCart()
    const { language } = useTranslation()
    const { selectedCurrency } = useCurrency()
    const updateQuery = useUpdateQueryParams();
    const queryVariables: any = {
        language: language,
        currency: selectedCurrency.code.toLowerCase(),
        page: 1,
        limit: 10,
        search: searchQuery ? searchQuery : "",
        sortField: "createdAt",
        sortOrder: "desc",
    };

    if (categoryId) {
        queryVariables.categoryId = categoryId;

    }
    if (type) {
        queryVariables.type = type;

    }
    if (minPrice && maxPrice) {
        if (parseFloat(minPrice) && parseFloat(maxPrice)) {

            queryVariables.minPrice = parseFloat(minPrice);
            queryVariables.maxPrice = parseFloat(maxPrice);
        }
    }
    if (colors) {
        const validColors = colors.split(',')
        if (validColors)
            queryVariables.colors = validColors;
    }
    if (categoryIds) {
        const validcategoryIds = categoryIds.split(',')
        if (validcategoryIds)
            queryVariables.categoryIds = validcategoryIds;
    }
    if (vendorParam) {
        const validVendors = vendorParam.split(',')
        if (validVendors)
            queryVariables.userIds = validVendors;
    }
    if (sizeParam) {
        const validSizes = sizeParam.split(',')
        if (validSizes)
            queryVariables.sizes = validSizes;
    }

    const { loading, error, data, refetch } = useQuery<ProductsResponse>(GET_PRODUCTS, {
        variables: queryVariables,
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        if (searchQuery) {
            setSearchTerm(searchQuery)
            refetch(queryVariables)
        }
    }, [searchQuery])

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

    const products = data?.products?.data || []
    const count = data?.products?.total

    return (
        <div>
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

                            {/* Search Input */}
                            <form onSubmit={(e) => {
                                e.preventDefault()
                                updateQuery({ search: searchTerm })
                            }}>
                                <div className="relative w-full max-w-xs">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        type="search"
                                        placeholder={searchPlaceHolder}
                                        className="pl-8 rounded-lg border-slate-200"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                            </form>
                        </div>

                        <div className="text-sm text-slate-500">Showing {count} products</div>
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
                    {loading ? <Loader /> :
                        count === 0 ?
                            <div className="bg-white rounded-lg p-8 text-center">
                                <h3 className="font-bold text-lg">No products found</h3>
                                <p className="text-slate-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
                                <Button variant="outline" className="mt-4" onClick={resetFilters}>
                                    Reset Filters
                                </Button>
                            </div>
                            :
                            <div className="space-y-4">
                                {/* <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold">{vendorName}</h2>
                                        <Link href={`/vendors/${products[0].vendor.slug}`} className="text-sm text-gold hover:underline">
                                            View all from this vendor
                                        </Link>
                                    </div> */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products.map((el) => {
                                        return (
                                            <ProductCard product={el} />
                                        )
                                    })}
                                </div>
                            </div>

                    }


                    {/* Products by Vendor */}
                    {/* {Object.keys(groupedByVendor).length > 0 ? (
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
                                        {data?.products.data.map((el) => {
                                            return (
                                                <ProductCard product={el} />
                                            )
                                        })}
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
                    )} */}
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






