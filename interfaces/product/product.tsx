"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronRight,
  ChevronLeft,
  X,
  Minus,
  Plus,
  Facebook,
  Twitter,
  Instagram,
  PinIcon as Pinterest,
  Truck,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import HeartButton from "@/components/heart-button"
import { useQuery } from "@apollo/client"
import { GET_PRODUCT_BY_ID } from "@/graphql/query"
import { useTranslation } from "@/hooks/use-translation"
import { useCurrency } from "@/contexts/currency-context"
import { ProductByIdResponse, ProductPicture } from "@/types/product"
import { config } from "@/constants/app"
import { arColors, enColors } from "@/constants/colors"
import { useParams } from "next/navigation"
import ProductActionButton from "@/components/productActionButton"
import { useAuth } from "@/contexts/auth-context"
import { capitalizeFirstLetter } from "@/lib/utils"

export default function Product({id}:{id:string}) {
  // Find the product based on the id

  // State for selected options
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [mainImage, setMainImage] = useState<ProductPicture | null>(null)
  const [activeTab, setActiveTab] = useState("description")
  // State for image modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentModalImage, setCurrentModalImage] = useState(0)
  // Cart and wishlist hooks
  const { addToCart } = useCart()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()

  const { language } = useTranslation()
  const { selectedCurrency } = useCurrency()

  const {cart} = useCart()
  const {user} = useAuth()

  // Handle keyboard navigation
  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (!isModalOpen) return

  //     if (e.key === "Escape") closeModal()
  //     if (e.key === "ArrowRight") nextImage()
  //     if (e.key === "ArrowLeft") prevImage()
  //   }

  //   window.addEventListener("keydown", handleKeyDown)
  //   return () => window.removeEventListener("keydown", handleKeyDown)
  // }, [isModalOpen])

  const { data, loading, error } = useQuery<ProductByIdResponse>(GET_PRODUCT_BY_ID, {
    variables: {
      id: id,
      language: language,
      currency: selectedCurrency.code.toLowerCase(),
    },
    skip: !id,
    fetchPolicy: 'network-only',
  });


  useEffect(() => {
    if (data?.productById) {
      setSelectedSize(data?.productById.size[0].value)
      setSelectedColor(data?.productById.color[0])
      setMainImage(data?.productById.pictures[0])
    }
  }, [data])
  const {t} = useTranslation();

  const product = data?.productById
  if (loading) {
    return <ProductSkeleton />
  }
  if (!product) {
    return <div>Product not found</div>
  }
  const cartItem = cart.find((el) => el.id === product.id)

  // Handle add to cart
  const handleAddToCart = () => {
    // addToCart({
    //   ...product,
    //   selectedSize,
    //   selectedColor,
    //   quantity: selectedQuantity,
    // })
  }

  // Handle wishlist toggle
  // const handleWishlistToggle = () => {
  //   if (isInWishlist(product.id)) {
  //     removeFromWishlist(product.id)
  //   } else {
  //     addToWishlist(product)
  //   }
  // }

  // Open modal with specific image
  const openImageModal = (imageIndex: number) => {
    setCurrentModalImage(imageIndex)
    setIsModalOpen(true)
    document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = "" // Restore scrolling
  }

  // Navigate to next image in modal
  const nextImage = () => {
    setCurrentModalImage((prev) => (prev + 1) % product.pictures.length)
  }

  // Navigate to previous image in modal
  const prevImage = () => {
    setCurrentModalImage((prev) => (prev - 1 + product.pictures.length) % product.pictures.length)
  }



  // Increment quantity
  const incrementQuantity = () => {
    setSelectedQuantity((prev) => Math.min(prev + 1, product.qty))
  }

  // Decrement quantity
  const decrementQuantity = () => {
    setSelectedQuantity((prev) => Math.max(prev - 1, 1))
  }


const matchedColors = (language === "AR" ? arColors : enColors).filter((color) =>
  product.color.some((c: string) => c.toLowerCase() === color.value.toLowerCase())
);



  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-slate-50 py-3 border-b">
        <div className="container px-4 md:px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-slate-600">
            <Link href="/" className="hover:text-slate-900">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link href="/vendors" className="hover:text-slate-900">
              Vendors
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            {/* {product.vendor && typeof product.vendor === "object" ? (
              <Link href={`/vendors/${product.vendor.slug}`} className="hover:text-slate-900">
                {product.vendor.name}
              </Link>
            ) : (
              <span className="hover:text-slate-900">
                {typeof product.vendor === "string" ? product.vendor : "Unknown Vendor"}
              </span>
            )} */}
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-slate-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="container px-4 md:px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="">
            <div className="md:flex md:gap-4">
              {/* Thumbnails - Left side on desktop, hidden on mobile */}
              <div className="hidden md:flex md:flex-col md:gap-3 md:w-20">
                {product.pictures.map((image, index) => (
                  <button
                    key={index}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${mainImage === image ? "ring-2 ring-gold" : ""
                      }`}
                    onClick={() => setMainImage(image)}
                  >
                    <Image
                      src={config.API_URL + image.path || "/placeholder.svg"}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1">
                <div
                  className="relative aspect-square overflow-hidden rounded-lg border cursor-pointer"
                  onClick={() => mainImage && openImageModal(product.pictures.indexOf(mainImage))}
                >
                  <Image
                    src={mainImage ? config.API_URL + mainImage.path : "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <Badge
                    className={`
                      absolute top-3 left-3 z-10
                      ${product.type === "new"  || product.type === "جديد" ? "bg-green-500" : ""}
                      ${product.type === "used"  || product.type ==="مستعمل" ? "bg-amber-500" : ""}
                      ${product.type === "rental" || product.type === "الإيجار" ? "bg-purple-500" : ""}
                    `}
                  >
                    {capitalizeFirstLetter(product.type)}
                  </Badge>
                  <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/80 text-slate-800 px-3 py-1 rounded-md text-sm font-medium">
                     {t('productpageid.zoom')}
                    </span>
                  </div>
                </div>

                {/* Thumbnails - Bottom on mobile only */}
                <div className="flex md:hidden gap-3 overflow-auto pb-2 mt-4">
                  {product.pictures.map((image, index) => (
                    <button
                      key={index}
                      className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${mainImage === image ? "ring-2 ring-gold" : ""
                        }`}
                      onClick={() => setMainImage(image)}
                    >
                      <Image
                        src={config.API_URL + image.path || "/placeholder.svg"}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        fill
                        className="object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
              <div className="mt-2 flex items-center gap-4">
                <div className="text-2xl font-bold">{product?.price && <> <span>{selectedCurrency.symbol} </span>{(product.price)}</>} </div>
                {product.oldPrice && (
                  <div className="text-lg text-slate-500 line-through">
                    {product?.oldPrice && <> <span>{selectedCurrency.symbol} </span>{product.oldPrice}</>}
                  </div>

                )}
              </div>

              <p className="mt-4 text-slate-600">{product.description && product.description}</p>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <div className="font-medium">
                {t('productpageid.color')}: <span className="uppercase">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {matchedColors.map((color) => (
                  <button
                    key={color.value}
                    className={`w-8 h-8 rounded-full border ${selectedColor === color.value ? "ring-2 ring-gold ring-offset-2" : "border-slate-300"
                      }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color.value)}
                    aria-label={`Select ${color.name} color`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-2">
              <div className="font-medium">{t('productpageid.size')}: {selectedSize?.toUpperCase()}</div>
              <div className="flex flex-wrap gap-2">
                {product.size.map((el) => (
                  <button
                    key={el.value}
                    className={`w-8 h-8 flex items-center justify-center border rounded-md ${selectedSize === el.value
                      ? "bg-slate-900 text-white border-slate-900"
                      : "border-slate-300 text-slate-900"
                      } `}
                    onClick={() => setSelectedSize(el.value)}
                  // disabled={!el.inStock}
                  >
                    {el.label}
                  </button>
                ))}
              </div>
              <Link href="#" className="text-sm text-gold hover:underline">
                {t('productpageid.sizeguide')}
              </Link>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <button className="px-3 py-2 text-slate-500 hover:text-slate-900" onClick={decrementQuantity}>
                  <Minus className="h-4 w-4" />
                </button>
                <div className="w-10 text-center">{selectedQuantity}</div>
                <button className="px-3 py-2 text-slate-500 hover:text-slate-900" onClick={incrementQuantity}>
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* <Button className="bg-black hover:bg-black/90 text-white flex-1" onClick={handleAddToCart}>
                ADD TO CART
              </Button> */}
              <ProductActionButton
                user={user}
                product={{
                    ...product,
                    selectedSize: selectedSize,
                    selectedColor: selectedColor
                }}
                cartItem={cartItem}
                addToCart={addToCart}
            />

              <div className="h-10 w-10 flex items-center justify-center">
                <HeartButton productId={product.id} size="md" product={{
                  id:product.id,
                  name:product.name,
                  price:product.price || 0,
                  vendor:{
                    name: '',
                    slug:''
                  },
                  images:product.pictures.map((el) => el.path),
                  originalPrice: product.oldPrice || 0
                }}/>
              </div>
            </div>

            {/* Payment Methods */}

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t">
              <div>
                <div className="font-medium">{t('productpageid.ref')}: {product.ref}</div>
                <div className="text-slate-500 mt-1">
                  {t('productpageid.categories')}:{" "}
                  <Link href="#" className="text-gold hover:underline">
                    {product.category?.name}
                  </Link>
                </div>
              </div>
              {/* <div>
                <Link href="#" className="text-gold hover:underline">
                  Ask a Question
                </Link>
                <div className="text-slate-500 mt-1">Delivery and Return</div>
              </div> */}
            </div>

            {/* Social Share */}
            <div className="flex items-center gap-4 pt-4 border-t">
              <div className="text-sm font-medium">{t('productpageid.share')}:</div>
              <div className="flex gap-2">
                <Link href="#" className="text-slate-500 hover:text-gold">
                  <Facebook className="h-4 w-4" />
                </Link>
                <Link href="#" className="text-slate-500 hover:text-gold">
                  <Twitter className="h-4 w-4" />
                </Link>
                <Link href="#" className="text-slate-500 hover:text-gold">
                  <Instagram className="h-4 w-4" />
                </Link>
                <Link href="#" className="text-slate-500 hover:text-gold">
                  <Pinterest className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent text-slate-600 data-[state=active]:text-slate-900 font-medium"
              >
                {t('productpageid.description')}
              </TabsTrigger>
              <TabsTrigger
                value="additional"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent text-slate-600 data-[state=active]:text-slate-900 font-medium"
              >
                {t('productpageid.additionalinformation')}
              </TabsTrigger>
              {/* <TabsTrigger
                value="warranty"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent text-slate-600 data-[state=active]:text-slate-900 font-medium"
              >
                Warranty & Shipping
              </TabsTrigger> */}
            </TabsList>

            <TabsContent value="description" className="pt-6">
              <div className="prose max-w-none">
                <p>
                  {product?.description}
                </p>



                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-slate-100 rounded-full p-4 mb-3">
                      <ShieldCheck className="h-6 w-6 text-gold" />
                    </div>
                    <div className="text-sm font-medium">{t('productpageid.safe')}</div>
                    <div className="text-xs text-slate-500">{t('productpageid.guarant')}</div>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="bg-slate-100 rounded-full p-4 mb-3">
                      <Truck className="h-6 w-6 text-gold" />
                    </div>
                    <div className="text-sm font-medium">{t('productpageid.free')}</div>
                    <div className="text-xs text-slate-500">{t('productpageid.overon')}</div>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="bg-slate-100 rounded-full p-4 mb-3">
                      <RefreshCw className="h-6 w-6 text-gold" />
                    </div>
                    <div className="text-sm font-medium">{t('productpageid.hassle')}</div>
                    <div className="text-xs text-slate-500">{t('productpageid.moneyback')}</div>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="bg-slate-100 rounded-full p-4 mb-3">
                      <ShieldCheck className="h-6 w-6 text-gold" />
                    </div>
                    <div className="text-sm font-medium">{t('productpageid.authentic')}</div>
                    <div className="text-xs text-slate-500">{t('productpageid.guarantproduct')}</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="additional" className="pt-6">
              <div className="prose max-w-none">
                <h3 className="mb-4">{t('productpageid.productdetail')}</h3>
                <ul>
                  <li className={`flex gap-1 ${language === "AR" ? 'flex-row-reverse' : 'flex-row'}`}>
                    <strong>{t('productpageid.material')}</strong>
                    {product?.material}
                  </li>
                  <li className={`flex gap-1 ${language === "AR" ? 'flex-row-reverse' : 'flex-row'}`}>
                    <strong>{t('productpageid.care')}</strong>
                    {product?.careInstructions}
                  </li>
                  <li className={`flex gap-1 ${language === "AR" ? 'flex-row-reverse' : 'flex-row'}`}>
                    <strong>{t('productpageid.chest')}</strong>
                    {product?.chest}
                  </li>
                  <li className={`flex gap-1 ${language === "AR" ? 'flex-row-reverse' : 'flex-row'}`}>
                    <strong>{t('productpageid.waist')}</strong>
                    {product?.waist}
                  </li>
                  <li className={`flex gap-1 ${language === "AR" ? 'flex-row-reverse' : 'flex-row'}`}>
                    <strong>{t('productpageid.length')}</strong>
                    {product?.length}
                  </li>
                  <li className={`flex gap-1 ${language === "AR" ? 'flex-row-reverse' : 'flex-row'}`}>
                    <strong>{t('productpageid.height')}</strong>
                    {product?.high}
                  </li>
                  <li className={`flex gap-1 ${language === "AR" ? 'flex-row-reverse' : 'flex-row'}`}>
                    <strong>{t('productpageid.hip')}</strong>
                    {product?.hip}
                  </li>


                </ul>

                {/* <h3>Size & Fit</h3>
                <p>The model is 5'9" and wears size S.</p>
                <ul>
                  <li>Regular fit</li>
                  <li>True to size</li>
                  <li>Designed for a comfortable wear</li>
                </ul>

                <h3>Care Instructions</h3>
                <ul>
                  <li>Machine wash cold</li>
                  <li>Do not bleach</li>
                  <li>Tumble dry low</li>
                  <li>Iron on low heat if needed</li>
                </ul> */}
              </div>
            </TabsContent>

            {/* <TabsContent value="warranty" className="pt-6">
              <div className="prose max-w-none">
                <h3>Shipping Information</h3>
                <p>
                  We offer free standard shipping on all orders over $100. For orders under $100, standard shipping is
                  $5.99.
                </p>
                <ul>
                  <li>Standard Shipping: 3-5 business days</li>
                  <li>Express Shipping: 1-2 business days ($12.99)</li>
                  <li>Next Day Shipping: Next business day ($19.99)</li>
                </ul>

                <h3>Return Policy</h3>
                <p>
                  We accept returns within 30 days of purchase. Items must be unworn, unwashed, and with all original
                  tags attached.
                </p>
                <p>For rental items, returns must be made within 3 days of the rental period ending.</p>

                <h3>Warranty</h3>
                <p>
                  All new items come with a 90-day warranty against manufacturing defects. Used and rental items are
                  covered for 30 days.
                </p>
              </div>
            </TabsContent> */}
          </Tabs>
        </div>

        {/* You May Also Like */}
        {/* <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((product, index) => (
              <Link href={`/products/${product.id}`} key={index} className="group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {product.type && (
                    <Badge
                      className={`
                      absolute top-2 left-2 z-10
                      ${product.type === "New" ? "bg-green-500" : ""}
                      ${product.type === "Used" ? "bg-amber-500" : ""}
                      ${product.type === "Rental" ? "bg-purple-500" : ""}
                    `}
                    >
                      {product.type}
                    </Badge>
                  )}
                  {product.discount && (
                    <Badge className="absolute top-2 right-2 z-10 bg-red-500">{product.discount}</Badge>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="font-medium group-hover:text-gold transition-colors">{product.name}</h3>
                  <p className="text-sm text-slate-500">{product.vendor.name}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="font-bold">${product.price}</p>
                    {product.originalPrice && (
                      <p className="text-sm text-slate-500 line-through">${product.originalPrice}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div> */}

        {/* Recently Viewed Products */}
        {/* <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Recently Viewed Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentlyViewed.map((product, index) => (
              <Link href={`/products/${product.id}`} key={index} className="group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {product.discount && (
                    <Badge className="absolute top-2 right-2 z-10 bg-red-500">{product.discount}</Badge>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="font-medium group-hover:text-gold transition-colors">{product.name}</h3>
                  <p className="text-sm text-slate-500">{product.vendor.name}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="font-bold">${product.price}</p>
                    {product.originalPrice && (
                      <p className="text-sm text-slate-500 line-through">${product.originalPrice}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div> */}
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={closeModal}>
          <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Image */}
            <div className="relative w-full h-full max-w-4xl max-h-[80vh] mx-auto">
              <Image
                src={config.API_URL + product.pictures[currentModalImage].path || "/placeholder.svg"}
                alt={`${product.name} - image ${currentModalImage + 1} of ${product.pictures.length}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* Navigation buttons */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white"
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white"
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentModalImage + 1} / {product.pictures.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const ProductSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col md:flex-row gap-8 p-6">
      {/* Left Side */}
      <div className="flex-1 space-y-4">
        <div className="h-8 w-1/2 bg-gray-300 rounded" />
        <div className="flex items-center space-x-2">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-300 rounded" />
        </div>
        <div className="h-4 w-32 bg-gray-200 rounded" />
        {/* Color Circles */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300" />
          <div className="w-8 h-8 rounded-full bg-gray-300" />
          <div className="w-8 h-8 rounded-full bg-gray-300" />
          <div className="w-8 h-8 rounded-full bg-gray-300" />
        </div>
        {/* Sizes */}
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-gray-300 rounded-md w-12 h-10" />
          <div className="px-4 py-2 bg-gray-300 rounded-md w-12 h-10" />
        </div>
        {/* Add to Cart */}
        <div className="flex items-center gap-4 mt-6">
          <div className="h-12 w-40 bg-gray-300 rounded" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded" />
            <div className="w-8 h-8 bg-gray-300 rounded" />
          </div>
        </div>
        {/* Ref + Category */}
        <div className="h-4 w-32 bg-gray-200 mt-4 rounded" />
        <div className="h-4 w-40 bg-gray-200 rounded" />
        {/* Social icons */}
        <div className="flex gap-3 mt-4">
          <div className="w-6 h-6 rounded-full bg-gray-300" />
          <div className="w-6 h-6 rounded-full bg-gray-300" />
          <div className="w-6 h-6 rounded-full bg-gray-300" />
          <div className="w-6 h-6 rounded-full bg-gray-300" />
        </div>
      </div>

      {/* Right Side - Product Image */}
      <div className="w-full md:w-[500px] h-[500px] bg-gray-200 rounded-lg" />
    </div>
  )
}