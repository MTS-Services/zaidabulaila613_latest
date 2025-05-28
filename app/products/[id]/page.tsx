"use client"

import { useState, useEffect } from "react"
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

export default function ProductPage({ params }: { params: { id: string } }) {
  // Find the product based on the id
  const product = products.find((p) => p.id.toString() === params.id) || products[0]

  // State for selected options
  const [selectedSize, setSelectedSize] = useState("m")
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.value || "black")
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [mainImage, setMainImage] = useState(product.images[0])
  const [activeTab, setActiveTab] = useState("description")

  // State for image modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentModalImage, setCurrentModalImage] = useState(0)

  // Cart and wishlist hooks
  const { addToCart } = useCart()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()

  // Handle add to cart
  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity: selectedQuantity,
    })
  }

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

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
    setCurrentModalImage((prev) => (prev + 1) % product.images.length)
  }

  // Navigate to previous image in modal
  const prevImage = () => {
    setCurrentModalImage((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return

      if (e.key === "Escape") closeModal()
      if (e.key === "ArrowRight") nextImage()
      if (e.key === "ArrowLeft") prevImage()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isModalOpen])

  // Increment quantity
  const incrementQuantity = () => {
    setSelectedQuantity((prev) => Math.min(prev + 1, 10))
  }

  // Decrement quantity
  const decrementQuantity = () => {
    setSelectedQuantity((prev) => Math.max(prev - 1, 1))
  }

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
            {product.vendor && typeof product.vendor === "object" ? (
              <Link href={`/vendors/${product.vendor.slug}`} className="hover:text-slate-900">
                {product.vendor.name}
              </Link>
            ) : (
              <span className="hover:text-slate-900">
                {typeof product.vendor === "string" ? product.vendor : "Unknown Vendor"}
              </span>
            )}
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
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${
                      mainImage === image ? "ring-2 ring-gold" : ""
                    }`}
                    onClick={() => setMainImage(image)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
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
                  onClick={() => openImageModal(product.images.indexOf(mainImage))}
                >
                  <Image
                    src={mainImage || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <Badge
                    className={`
                      absolute top-3 left-3 z-10
                      ${product.type === "New" ? "bg-green-500" : ""}
                      ${product.type === "Used" ? "bg-amber-500" : ""}
                      ${product.type === "Rental" ? "bg-purple-500" : ""}
                    `}
                  >
                    {product.type}
                  </Badge>
                  <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/80 text-slate-800 px-3 py-1 rounded-md text-sm font-medium">
                      Click to zoom
                    </span>
                  </div>
                </div>

                {/* Thumbnails - Bottom on mobile only */}
                <div className="flex md:hidden gap-3 overflow-auto pb-2 mt-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${
                        mainImage === image ? "ring-2 ring-gold" : ""
                      }`}
                      onClick={() => setMainImage(image)}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
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
                <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>
                {product.originalPrice && (
                  <div className="text-lg text-slate-500 line-through">${product.originalPrice.toFixed(2)}</div>
                )}
              </div>

              <p className="mt-4 text-slate-600">{product.description}</p>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <div className="font-medium">
                COLOR: <span className="uppercase">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.value}
                    className={`w-8 h-8 rounded-full border ${
                      selectedColor === color.value ? "ring-2 ring-gold ring-offset-2" : "border-slate-300"
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
              <div className="font-medium">SIZE: {selectedSize.toUpperCase()}</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.value}
                    className={`w-8 h-8 flex items-center justify-center border rounded-md ${
                      selectedSize === size.value
                        ? "bg-slate-900 text-white border-slate-900"
                        : "border-slate-300 text-slate-900"
                    } ${!size.inStock ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => size.inStock && setSelectedSize(size.value)}
                    disabled={!size.inStock}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
              <Link href="#" className="text-sm text-gold hover:underline">
                Size Guide
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

              <Button className="bg-black hover:bg-black/90 text-white flex-1" onClick={handleAddToCart}>
                ADD TO CART
              </Button>

              <div className="h-10 w-10 flex items-center justify-center">
                <HeartButton productId={product.id} size="md" />
              </div>
            </div>

            {/* Payment Methods */}

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t">
              <div>
                <div className="font-medium">SKU: {product.id}</div>
                <div className="text-slate-500 mt-1">
                  Categories:{" "}
                  <Link href="#" className="text-gold hover:underline">
                    {product.category}
                  </Link>
                </div>
              </div>
              <div>
                <Link href="#" className="text-gold hover:underline">
                  Ask a Question
                </Link>
                <div className="text-slate-500 mt-1">Delivery and Return</div>
              </div>
            </div>

            {/* Social Share */}
            <div className="flex items-center gap-4 pt-4 border-t">
              <div className="text-sm font-medium">Share:</div>
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
                Description
              </TabsTrigger>
              <TabsTrigger
                value="additional"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent text-slate-600 data-[state=active]:text-slate-900 font-medium"
              >
                Additional Information
              </TabsTrigger>
              <TabsTrigger
                value="warranty"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent text-slate-600 data-[state=active]:text-slate-900 font-medium"
              >
                Warranty & Shipping
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-6">
              <div className="prose max-w-none">
                <p>
                  Design inspiration lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi commodo, ipsum sed
                  pharetra gravida, orci magna rhoncus neque, id pulvinar odio lorem non turpis. Nullam sit amet enim.
                  Suspendisse id velit vitae ligula volutpat condimentum. Aliquam erat volutpat. Sed quis velit. Nulla
                  facilisi. Nulla libero. Vivamus pharetra posuere sapien. Nam consectetuer. Sed aliquam, nunc eget
                  euismod ullamcorper, lectus nunc ullamcorper orci.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="rounded-md"
                  />
                  <Image
                    src={product.images[1] || product.images[0]}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="rounded-md"
                  />
                  <Image
                    src={product.images[2] || product.images[0]}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="rounded-md"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-slate-100 rounded-full p-4 mb-3">
                      <ShieldCheck className="h-6 w-6 text-gold" />
                    </div>
                    <div className="text-sm font-medium">Safe & Secure</div>
                    <div className="text-xs text-slate-500">Guaranteed</div>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="bg-slate-100 rounded-full p-4 mb-3">
                      <Truck className="h-6 w-6 text-gold" />
                    </div>
                    <div className="text-sm font-medium">Free Shipping</div>
                    <div className="text-xs text-slate-500">On orders over $100</div>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="bg-slate-100 rounded-full p-4 mb-3">
                      <RefreshCw className="h-6 w-6 text-gold" />
                    </div>
                    <div className="text-sm font-medium">Hassle-Free Returns</div>
                    <div className="text-xs text-slate-500">30 day money back</div>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="bg-slate-100 rounded-full p-4 mb-3">
                      <ShieldCheck className="h-6 w-6 text-gold" />
                    </div>
                    <div className="text-sm font-medium">100% Authentic</div>
                    <div className="text-xs text-slate-500">Guaranteed Products</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="additional" className="pt-6">
              <div className="prose max-w-none">
                <h3>Product Details</h3>
                <ul>
                  <li>
                    <strong>Material:</strong> {product.material}
                  </li>
                  <li>
                    <strong>Care:</strong> {product.care}
                  </li>
                  <li>
                    <strong>Condition:</strong> {product.condition}
                  </li>
                  <li>
                    <strong>Style:</strong> {product.style}
                  </li>
                </ul>

                <h3>Size & Fit</h3>
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
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="warranty" className="pt-6">
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
            </TabsContent>
          </Tabs>
        </div>

        {/* You May Also Like */}
        <div className="mt-16">
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
        </div>

        {/* Recently Viewed Products */}
        <div className="mt-16">
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
        </div>
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
                src={product.images[currentModalImage] || "/placeholder.svg"}
                alt={`${product.name} - image ${currentModalImage + 1} of ${product.images.length}`}
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
              {currentModalImage + 1} / {product.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Sample data with real dress images
const products = [
  {
    id: 1,
    name: "Silk Wedding Gown",
    description:
      "Luxurious silk wedding gown with intricate lace detailing and a flowing train. Perfect for your special day, this dress combines traditional elegance with modern design elements.",
    price: 1299,
    originalPrice: 1499,
    type: "New",
    rating: 4.8,
    reviewCount: 24,
    material: "100% Silk with lace detailing",
    care: "Dry clean only",
    condition: "New with tags",
    style: "A-line silhouette with sweetheart neckline",
    images: [
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585241920473-b472eb9ffbae?q=80&w=1000&auto=format&fit=crop",
    ],
    colors: [
      {
        value: "ivory",
        name: "Ivory",
        hex: "#fffff0",
      },
      {
        value: "white",
        name: "White",
        hex: "#ffffff",
      },
      {
        value: "champagne",
        name: "Champagne",
        hex: "#f7e7ce",
      },
    ],
    sizes: [
      {
        value: "xs",
        label: "XS",
        inStock: true,
      },
      {
        value: "s",
        label: "S",
        inStock: true,
      },
      {
        value: "m",
        label: "M",
        inStock: true,
      },
      {
        value: "l",
        label: "L",
        inStock: true,
      },
      {
        value: "xl",
        label: "XL",
        inStock: false,
      },
    ],
    category: "Wedding Dresses",
    vendor: {
      name: "Elegance Bridal",
      slug: "elegance-bridal",
    },
    reviews: [
      {
        name: "Sarah J.",
        rating: 5,
        comment:
          "Absolutely stunning dress! The silk is so soft and the lace is exquisite. I felt like a princess on my wedding day.",
        date: "2024-03-15",
      },
      {
        name: "Emily K.",
        rating: 4,
        comment:
          "Beautiful dress, but the sizing runs a bit small. I recommend ordering a size up for a comfortable fit.",
        date: "2024-02-28",
      },
    ],
  },
  {
    id: 2,
    name: "Lace Mermaid Gown",
    description:
      "Elegant mermaid gown featuring delicate lace appliques and a dramatic flared skirt. This dress is designed to accentuate your curves and create a memorable silhouette.",
    price: 999,
    originalPrice: 1199,
    type: "Used",
    rating: 4.5,
    reviewCount: 18,
    material: "Lace and Tulle",
    care: "Dry clean only",
    condition: "Gently used, excellent condition",
    style: "Mermaid silhouette with sweetheart neckline",
    images: [
      "https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
    ],
    colors: [
      {
        value: "ivory",
        name: "Ivory",
        hex: "#fffff0",
      },
      {
        value: "white",
        name: "White",
        hex: "#ffffff",
      },
    ],
    sizes: [
      {
        value: "xs",
        label: "XS",
        inStock: true,
      },
      {
        value: "s",
        label: "S",
        inStock: true,
      },
      {
        value: "m",
        label: "M",
        inStock: true,
      },
      {
        value: "l",
        label: "L",
        inStock: true,
      },
      {
        value: "xl",
        label: "XL",
        inStock: false,
      },
    ],
    category: "Wedding Dresses",
    vendor: {
      name: "Glamour Gowns",
      slug: "glamour-gowns",
    },
    reviews: [
      {
        name: "Jessica L.",
        rating: 5,
        comment:
          "I felt absolutely stunning in this dress! The lace detailing is exquisite and the fit was perfect. Highly recommend!",
        date: "2024-04-01",
      },
      {
        name: "Amanda S.",
        rating: 4,
        comment:
          "The dress is gorgeous, but the train was a bit longer than I expected. Overall, I was very happy with my purchase.",
        date: "2024-03-20",
      },
    ],
  },
]

// Update the relatedProducts array to ensure each product has a proper vendor object
const relatedProducts = [
  {
    id: 3,
    name: "Lace Bridal Gown",
    vendor: {
      name: "Elegance",
      slug: "elegance",
    },
    price: "599",
    originalPrice: "1299",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=1000&auto=format&fit=crop",
    type: "Used",
  },
  {
    id: 4,
    name: "Satin Ball Gown",
    vendor: {
      name: "Dress Haven",
      slug: "dress-haven",
    },
    price: "199",
    image: "https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=1000&auto=format&fit=crop",
    type: "Rental",
  },
  {
    id: 5,
    name: "Sequin Cocktail Dress",
    vendor: {
      name: "Glamour",
      slug: "glamour",
    },
    price: "499",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop",
    type: "New",
  },
  {
    id: 6,
    name: "Chiffon Bridesmaid Dress",
    vendor: {
      name: "Bella Boutique",
      slug: "bella-boutique",
    },
    price: "299",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop",
    type: "New",
  },
]

// Update the recentlyViewed array to ensure each product has a proper vendor object
const recentlyViewed = [
  {
    id: 7,
    name: "Bohemian Maxi Dress",
    vendor: {
      name: "Style Studio",
      slug: "style-studio",
    },
    price: "159",
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1000&auto=format&fit=crop",
    type: "New",
  },
  {
    id: 8,
    name: "Prom Night Special",
    vendor: {
      name: "Dress Dreams",
      slug: "dress-dreams",
    },
    price: "179",
    originalPrice: "249",
    image: "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?q=80&w=1000&auto=format&fit=crop",
    type: "Used",
    discount: "-20%",
  },
  {
    id: 9,
    name: "Floral Summer Dress",
    vendor: {
      name: "Bella Boutique",
      slug: "bella-boutique",
    },
    price: "129",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
    type: "New",
  },
  {
    id: 10,
    name: "Vintage Evening Gown",
    vendor: {
      name: "Dress Haven",
      slug: "dress-haven",
    },
    price: "249",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop",
    type: "Rental",
    discount: "RENTAL",
  },
]
