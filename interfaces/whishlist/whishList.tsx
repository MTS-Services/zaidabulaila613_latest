"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Trash2, ShoppingBag, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"
import { useTranslation } from "@/hooks/use-translation"
import { useCurrency } from "@/contexts/currency-context"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()

  // Handle move to cart
  const handleMoveToCart = (item:any) => {
    addToCart({
      ...item,
      quantity: 1,
      selectedSize: "m", // Default size
      selectedColor: "black", // Default color
    })
    removeFromWishlist(item.id)
  }
const {t} = useTranslation();
const {selectedCurrency} = useCurrency()
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">{t('wishlist.title')}</h1>
          <Link href="/" className="flex items-center text-sm text-slate-600 hover:text-slate-900">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t('cartpage.continue')}
          </Link>
        </div>

        {wishlist.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative">
                    <Link href={`/products/${item.id}`}>
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <Image
                          src={item.images?.[0] || "/placeholder.svg?height=400&width=300"}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    </Link>
                    {item.type && (
                      <Badge
                        className={`
                          absolute top-2 left-2 z-10
                          ${item.type === "New" ? "bg-green-500" : ""}
                          ${item.type === "Used" ? "bg-amber-500" : ""}
                          ${item.type === "Rental" ? "bg-purple-500" : ""}
                        `}
                      >
                        {item.type}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <Link href={`/products/${item.id}`}>
                      <h3 className="font-medium hover:text-rose-500 transition-colors">{item.name}</h3>
                    </Link>
                    <p className="text-sm text-slate-500">{item.vendor.name}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="font-bold">
                        {selectedCurrency.symbol} {typeof item.price === t('wishlist.number') ? item.price : item.price}
                      </p>
                      {item.originalPrice && (
                        <p className="text-sm text-slate-500 line-through">
                          {selectedCurrency.symbol} {typeof item.originalPrice === t('wishlist.number') ? item.originalPrice : item.originalPrice}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        className="flex-1 bg-gold hover:bg-gold/90 text-white"
                        onClick={() => handleMoveToCart(item)}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                       {t('productpageid.addtocart')}
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => removeFromWishlist(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" size="sm" onClick={clearWishlist}>
               {t('wishlist.clear')}
              </Button>
              <div className="text-sm text-slate-500">
                {wishlist.length} {wishlist.length === 1 ? t('cartpage.item') : t('cartpage.items')} {t('wishlist.inwishlist')}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <Heart className="h-16 w-16 text-slate-300" />
            </div>
            <h2 className="text-xl font-bold mb-2">{t('wishlist.empty')}</h2>
            <p className="text-slate-500 mb-6">{t('wishlist.love')}</p>
            <Button asChild>
              <Link href="/">{t('cartpage.startshopping')}</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
