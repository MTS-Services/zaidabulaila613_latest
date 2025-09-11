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
import ProductList from "@/interfaces/product/productList"



export default function Products() {
  // Find the category based on the slug
  // const category = categories.find((c) => c.slug === params.slug) || categories[0]

  

   const params = useSearchParams();
  const search = params.get('search'); 
  const type = params.get('type'); 

  const router = useRouter()

  const { categories } = useCategory()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { language } = useTranslation()
  const { selectedCurrency } = useCurrency()



  const validTypes = ['new', 'used', 'rental']
  const validType = type ? validTypes.includes(type) : null;

  const getTypeLabel = (prType: string) => {
    const translations: Record<string, { en: string; ar: string }> = {
      new: { en: 'New', ar: 'جديد' },
      used: { en: 'Used', ar: 'مستعمل' },
      rental: { en: 'Rental', ar: 'إيجار' },
    };

    return translations[prType.toLowerCase()]?.[language === "AR" ? "ar" : "en"] || type;
  };


  return (
    <div className="min-h-screen bg-slate-50 mt-6">
      {/* Category Header */}
      {validType && type && 
      <div className="relative h-64 md:h-80">
        {/* <Image src={"https://images.unsplash.com/photo-1594612076394-2a31c2e4c726?q=80&w=1000&auto=format&fit=crop"} alt={catName || ""} fill className="object-cover" /> */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex flex-col">
            <div className="flex items-center text-white/80 text-sm mb-2">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <ChevronRight className="h-3 w-3 mx-1" />
              <span>Product Types</span>
              <ChevronRight className="h-3 w-3 mx-1" />
              <span>{getTypeLabel(type)}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white font-playfair">{getTypeLabel(type)}</h1>
          </div>
        </div>
      </div>
      
      }

      <ProductList searchPlaceHolder={`Search products`} type={type ? type : undefined} />
    </div>
  )
}

