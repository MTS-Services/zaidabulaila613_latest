"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Star, Percent, Check } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect, useCallback } from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import HeartButton from "@/components/heart-button"
import NeumorphicButton from "@/components/neumorphic-button"
import { featuredContent } from "@/constants/products/featured"
import { useQuery } from "@apollo/client"
import { GET_PRODUCTS } from "@/graphql/query"
import { config } from "@/constants/app"
import { Checkbox } from "./ui/checkbox"
import { RadioGroup } from "./ui/radio-group"
import { useAuth } from "@/contexts/auth-context"
import ProductActionButton from "./productActionButton"
import { useTranslation } from "@/hooks/use-translation"
import { useCurrency } from "@/contexts/currency-context"
import { Product, ProductsResponse } from "@/types/product"
import { arProductTypes, enProductTypes } from "@/constants/product"
import { capitalizeFirstLetter } from "@/lib/utils"
import { arColors, enColors } from "@/constants/colors"



interface SizeOption {
    label: string;
    value: string;
}

interface ProductV {
    id: number;
    name: string;
    colors: string[];
    sizes: SizeOption[];
}

interface SelectedOption {
    productId: string;
    color: string;
    size: string;
}


export default function ProductCard({ product }: { product: Product }) {
    const {
        // products: featuredProducts,
        discount,
        badgeColors
    } = featuredContent
    const { addToCart, cart } = useCart()
    const { language } = useTranslation()
    const { selectedCurrency } = useCurrency()
    const { addToWishlist, removeFromWishlist, wishlist } = useWishlist()
    // const { loading, error, data, refetch } = useQuery<ProductsResponse>(GET_PRODUCTS, {
    //     variables: {
    //         language: language,
    //         currency: (selectedCurrency.code).toLowerCase(),
    //         page: 1,
    //         limit: 10,
    //         search: "",
    //         sortField: "createdAt",
    //         sortOrder: "desc",
    //     },
    //     fetchPolicy: 'network-only',
    // });
    const { user } = useAuth()
    // At the beginning of the component:
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)
    const [activeTag, setActiveTag] = useState("All")
    const [discountVisible, setDiscountVisible] = useState([true, true, true, true, true, true, true, true])
    const [discountIntervals, setDiscountIntervals] = useState<NodeJS.Timeout[]>([])
    const [selectedOptions, setSelectedOptions] = useState<SelectedOption>({
        productId: product.id,
        color: product.color[0],
        size: product.size[0].value,
    });
    // const [products, setProducts] = useState(featuredProducts)

    // const products = data?.products?.data || []


    const handleChange = (
        key: 'color' | 'size',
        value: string
    ) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // useEffect(() => {
    //     if (data) {
    //         const defaultSelections = data?.products?.data.map((product: any) => ({
    //             productId: product.id,
    //             color: product.color[0],
    //             size: product.size[0].value,
    //         }));
    //         setSelectedOptions(defaultSelections);
    //     }

    // }, [data])

    // Add this useEffect for mouse drag scrolling
    // useEffect(() => {
    //     const slider = scrollContainerRef.current
    //     if (!slider) return

    //     let isDown = false
    //     let startX: number
    //     let scrollLeft: number

    //     const handleMouseDown = (e: MouseEvent) => {
    //         isDown = true
    //         slider.classList.add("active")
    //         startX = e.pageX - slider.offsetLeft
    //         scrollLeft = slider.scrollLeft
    //         slider.style.cursor = "grabbing"
    //     }

    //     const handleMouseLeave = () => {
    //         isDown = false
    //         slider.classList.remove("active")
    //         slider.style.cursor = "grab"
    //     }

    //     const handleMouseUp = () => {
    //         isDown = false
    //         slider.classList.remove("active")
    //         slider.style.cursor = "grab"
    //     }

    //     const handleMouseMove = (e: MouseEvent) => {
    //         if (!isDown) return
    //         e.preventDefault()
    //         const x = e.pageX - slider.offsetLeft
    //         const walk = (x - startX) * 1.5 // Scroll speed multiplier
    //         slider.scrollLeft = scrollLeft - walk
    //     }

    //     // Touch events for mobile
    //     const handleTouchStart = (e: TouchEvent) => {
    //         isDown = true
    //         slider.classList.add("active")
    //         startX = e.touches[0].pageX - slider.offsetLeft
    //         scrollLeft = slider.scrollLeft
    //     }

    //     const handleTouchMove = (e: TouchEvent) => {
    //         if (!isDown) return
    //         const x = e.touches[0].pageX - slider.offsetLeft
    //         const walk = (x - startX) * 1.5
    //         slider.scrollLeft = scrollLeft - walk
    //     }

    //     slider.addEventListener("mousedown", handleMouseDown)
    //     slider.addEventListener("mouseleave", handleMouseLeave)
    //     window.addEventListener("mouseup", handleMouseUp)
    //     slider.addEventListener("mousemove", handleMouseMove)

    //     // Add touch events
    //     slider.addEventListener("touchstart", handleTouchStart)
    //     slider.addEventListener("touchend", handleMouseUp)
    //     slider.addEventListener("touchcancel", handleMouseLeave)
    //     slider.addEventListener("touchmove", handleTouchMove)

    //     return () => {
    //         slider.removeEventListener("mousedown", handleMouseDown)
    //         slider.removeEventListener("mouseleave", handleMouseLeave)
    //         window.removeEventListener("mouseup", handleMouseUp)
    //         slider.removeEventListener("mousemove", handleMouseMove)

    //         slider.removeEventListener("touchstart", handleTouchStart)
    //         slider.removeEventListener("touchend", handleMouseUp)
    //         slider.removeEventListener("touchcancel", handleMouseLeave)
    //         slider.removeEventListener("touchmove", handleTouchMove)
    //     }
    // }, [])

    // Filter products based on active tag
    // const filteredProducts = activeTag === "All" || activeTag === "الكل" ? products : products.filter((product: any) => product.type === (activeTag).toLowerCase())

    // Get discount tag with animated text
    const getDiscountTag = (index: number, discount = "40% OFF") => {
        // Animation variants for text
        const textVariants = {
            hidden: { opacity: 0, y: 10 },
            visible: {
                opacity: 1,
                y: 0,
                transition: {
                    duration: 0.3,
                },
            },
            exit: {
                opacity: 0,
                y: -10,
                transition: {
                    duration: 0.2,
                },
            },
        }

        // Animation variants for individual characters
        const charVariants = {
            hidden: { opacity: 0, y: 20 },
            visible: (i: number) => ({
                opacity: 1,
                y: 0,
                transition: {
                    delay: i * 0.05,
                    duration: 0.3,
                },
            }),
        }

        // Split the discount text into individual characters for animation
        const discountChars = discount.split("")

        return (
            <div className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md flex items-center justify-center gap-1 overflow-hidden">
                <Percent className="h-3 w-3" />
                <motion.div key={`discount-${index}`} initial="hidden" animate="visible" className="flex overflow-hidden">
                    {discountChars.map((char, i) => (
                        <motion.span
                            key={`char-${i}`}
                            custom={i}
                            variants={charVariants}
                            initial="hidden"
                            animate="visible"
                            style={{
                                display: "inline-block",
                                transformOrigin: "bottom",
                            }}
                            className="inline-block"
                        >
                            {char}
                        </motion.span>
                    ))}
                </motion.div>
            </div>
        )
    }

    const getAnimatedDiscountTag = useCallback(
        (index: number, discount = "40% OFF") => {
            const isVisible = discountVisible[index]

            return (
                <div className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md flex items-center justify-center gap-1">
                    <Percent className="h-3 w-3" />
                    <div className="w-[55px] h-[16px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {isVisible && (
                                <motion.div
                                    key={`text-${index}-${isVisible}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 15,
                                        },
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -10,
                                        transition: {
                                            duration: 0.2,
                                        },
                                    }}
                                >
                                    {discount}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )
        },
        [discountVisible],
    )

    // useEffect(() => {
    //     const intervals: NodeJS.Timeout[] = []

    //     for (let index = 0; index < products.length; index++) {
    //         const intervalId = setInterval(() => {
    //             setDiscountVisible((prev) => {
    //                 const newDiscountVisible = [...prev]
    //                 newDiscountVisible[index] = false
    //                 return newDiscountVisible
    //             })
    //             setTimeout(() => {
    //                 setDiscountVisible((prev) => {
    //                     const newDiscountVisible = [...prev]
    //                     newDiscountVisible[index] = true
    //                     return newDiscountVisible
    //                 })
    //             }, 500) // Wait before showing again
    //         }, 3000) // Change every 3 seconds

    //         intervals.push(intervalId)
    //     }

    //     setDiscountIntervals(intervals)

    //     return () => {
    //         intervals.forEach(clearInterval)
    //     }
    // }, [])





    console.log(selectedOptions, "selectedOptions")

    // const selected = selectedOptions.productId === product.id;
    const cartItem = cart.find((el) => el.id === product.id)
    const matchedColors = (language === "AR" ? arColors : enColors).filter((color) =>
        product.color.some((c: string) => c.toLowerCase() === color.value.toLowerCase())
    );
    return (
        <div className="group relative">
            <div className="relative overflow-hidden rounded-lg">
                {/* Discount Badge - Using animated text */}
                {/* <div className="absolute top-2 left-2 z-30">{getAnimatedDiscountTag(index)}</div> */}

                {product.type && (
                    <div className="absolute top-12 left-2 z-10">
                        <Badge
                            className={`rounded-md
                        ${product.type === "new" || product.type === "جديد" ? "bg-green-500" : ""}
                        ${product.type === "used" || product.type === "مستعمل" ? "bg-amber-500" : ""}
                        ${product.type === "rental" || product.type === "الإيجار" ? "bg-purple-500" : ""}
                      `}
                        >
                            {capitalizeFirstLetter(product.type)}
                        </Badge>
                    </div>
                )}

                <div className="absolute top-2 right-2 z-20">
                    <div className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
                        {/* <HeartButton productId={product.id} size="sm" /> */}
                        <span className="sr-only">Add to wishlist</span>
                    </div>
                </div>
                <Link href={`/products/${product.id}`} className="block">
                    <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                        <Image
                            src={`${config.API_URL + product.pictures[0]?.path}` || "/placeholder.svg"}
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
                    {/* <p className="text-sm text-slate-500">{product.vendorShopName}</p> */}

                    {/* Ratings */}
                    <div className="flex items-center gap-1 mt-1">
                        {/* <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-3.5 w-3.5 ${i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"}`}
                                                    />
                                                ))}
                                            </div> */}
                        {/* <span className="text-xs text-slate-500">({product.reviewCount})</span> */}
                        {/* <span className="text-xs text-slate-500">(3)</span> */}
                    </div>

                    <div className="flex justify-between items-center">
                        <p className="font-bold">
                            {selectedCurrency.symbol} {product?.type === 'rental' || product?.type === 'الإيجار' ? `${product.price} / Per Day` : product.price
                            }
                        </p>
                        {product.oldPrice && (
                            <p className="text-sm text-slate-500 line-through">${product.oldPrice}</p>
                        )}
                    </div>

                    {/* Total Sales */}
                    <p className="text-xs text-slate-500">10+ sold</p>
                </div>
            </Link>
            <div>
                <div className="mt-2">
                    <div className="flex gap-2 mt-1">
                        {matchedColors.map((color) => (
                            <label key={color.value}
                                style={{ backgroundColor: color.hex }}
                                className={`cursor-pointer px-2 py-1 border text-sm font-medium h-6 w-6 pr-2
                                rounded-full
        ${selectedOptions?.color.toLowerCase() === color.value.toLowerCase() ? `border-gold-dark border-[3px]` : ' border-gray-400'}
      `}>
                                {selectedOptions?.color.toLowerCase() === color.value.toLowerCase() &&
                                    <Check color="#fff" size={12} />

                                }
                                <input
                                    type="radio"
                                    name={`color-${product.id}`}
                                    value={color.value.toLowerCase()}
                                    checked={selectedOptions?.color?.toLowerCase() === color.value.toLowerCase()}
                                    onChange={() => handleChange('color', color.value.toLowerCase())}
                                    className="hidden"
                                />
                                {/* <span>{capitalizeFirstLetter(color)}</span> */}
                            </label>
                        ))}

                        {/* {product.color.map((color: any) => (
                           
                        ))} */}
                    </div>
                </div>

                {/* Sizes */}
                <div className="mt-2">
                    <div className="flex gap-2 mt-1">
                        {product.size.map(({ label, value }: { label: string, value: string }) => (
                            <label key={value} className={`cursor-pointer px-2 py-1 rounded border text-sm font-medium 
        ${selectedOptions?.size === value ? 'bg-black text-white' : 'bg-white text-black border-gray-400'}
      `}>
                                <input
                                    type="radio"
                                    name={`size-${product.id}`}
                                    value={value}
                                    checked={selectedOptions?.size === value}
                                    onChange={() => handleChange('size', value)}
                                    className="hidden"
                                />
                                <span>{label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>


            <ProductActionButton
                user={user}
                product={{
                    ...product,
                    selectedSize: selectedOptions?.size,
                    selectedColor: selectedOptions?.color
                }}
                cartItem={cartItem}
                addToCart={addToCart}
            />
        </div>
    )
}


