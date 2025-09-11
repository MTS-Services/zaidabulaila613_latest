"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ShoppingBag,
  Heart,
  Phone,
  Mail,
  Plus,
  Minus,
  Shirt,
  Watch,
  Sparkles,
  Zap,
  ShoppingCart,
  Gem,
  ShirtIcon as TShirt,
  Baby,
  Home,
  User,
} from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import ReactCountryFlag from "react-country-flag"
import { useDrawer } from "@/contexts/drawer-context"
import { contactInfo, shippingInfo } from "@/constants/contact"
import { useCurrency } from "@/contexts/currency-context"
import { arCurrencies, cn, enCurrencies } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { useCategory } from "@/contexts/category-context"
import { useQuery } from "@apollo/client"
import { ShopsResponse } from "@/types/shop"
import { GET_SHOPS } from "@/graphql/query"
import { usePathname, useSearchParams } from "next/navigation"
import { useUpdateQueryParams } from "@/hooks/useSearchParams"
import { useTranslation } from "@/hooks/use-translation"
import { arProductTypes, enProductTypes } from "@/constants/product"
import { useAuth } from "@/contexts/auth-context"

// Add this currencies array near the top of the file, after the imports


// Add a state variable for the selected currency in the Navbar component
export default function Navbar() {

  const params = useSearchParams()
  const search = params.get("search")
  const pathname = usePathname();

  const isDashboard = pathname?.includes("/dashboard");
  const { logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const [activeTab, setActiveTab] = useState("menu")
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const [searchExpanded, setSearchExpanded] = useState(false)
  // const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])
  const { isDrawerOpen, setIsDrawerOpen } = useDrawer()
  const [isArabic, setIsArabic] = useState(false)
  const [searchTerm, setSearchTerm] = useState(search ? search : "")
  const [open, setOpen] = useState(false);
  const { selectedCurrency, setSelectedCurrency } = useCurrency();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation()

  const updateQuery = useUpdateQueryParams();

  const { categories } = useCategory()

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

  useEffect(() => {
    if (search) {
      setSearchTerm(search)
    }
  }, [search])

  const vendors = data?.shops?.data || []

  const displayVendors = vendors.map((el) => {
    return {
      label: el.shopName,
      href: `/vendors/${el.id}`
    }
  })

  const displayCategories = categories?.map((el) => {
    return {
      label: language === "AR" ? el.name.ar : el.name.en,
      href: `/categories/${el.id}`
    }
  })

  const displayProductTypes = (language === "AR" ? arProductTypes : enProductTypes)?.map((el) => {
    return {
      label: el,
      href: `/products?type=${el.toLowerCase()}`
    }
  })

  const currencies = language === "AR" ? arCurrencies : enCurrencies

  const handleSelect = (lang: "EN" | "AR") => {
    setLanguage(lang);
    setOpen(false);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  // Track scroll position to add background when scrolled
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolled])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    // Store the original scroll position and body styles
    const scrollY = window.scrollY
    const originalOverflow = document.body.style.overflow
    const originalHeight = document.body.style.height
    const originalPosition = document.body.style.position
    const originalTop = document.body.style.top

    if (isDrawerOpen) {
      // Save the current scroll position
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
      document.body.style.overflow = "hidden"
      document.body.classList.add("drawer-open")
    } else {
      // Restore the scroll position
      document.body.style.position = originalPosition
      document.body.style.top = originalTop
      document.body.style.height = originalHeight
      document.body.style.overflow = originalOverflow
      document.body.classList.remove("drawer-open")

      // Scroll back to the original position
      if (document.body.style.top) {
        const scrollY = Number.parseInt(document.body.style.top || "0") * -1
        window.scrollTo(0, scrollY)
      }
    }

    return () => {
      // Clean up - restore original body styles
      document.body.style.position = originalPosition
      document.body.style.top = originalTop
      document.body.style.height = originalHeight
      document.body.style.overflow = originalOverflow
      document.body.classList.remove("drawer-open")

      // Restore scroll position on unmount if needed
      if (document.body.style.position === "fixed") {
        const scrollY = Number.parseInt(document.body.style.top || "0") * -1
        window.scrollTo(0, scrollY)
      }
    }
  }, [isDrawerOpen])

  // Toggle submenu
  const toggleSubmenu = (e: React.MouseEvent, label: string) => {
    e.preventDefault()
    e.stopPropagation()
    setExpandedMenus((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]))
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-background"
        }`}
    >
      <div className="container px-4 lg:px-6 flex h-16 items-center justify-between">
        {/* Left - Logo and Navigation Links */}
        <div className="flex items-center gap-8">
          {/* Hamburger Menu - Mobile Only */}
          <label className="hamburger cursor-pointer lg:hidden mr-2">
            <input
              type="checkbox"
              checked={isDrawerOpen}
              onChange={toggleDrawer}
            />
            <svg viewBox="0 0 32 32" className="text-slate-700">
              <path
                className="line line-top-bottom"
                d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
              ></path>
              <path className="line" d="M7 16 27 16"></path>
            </svg>
          </label>

          {/* Logo */}
          <Link href="/" className="hidden lg:flex items-center">
            <svg width="130" height="78" viewBox="0 0 2000 2000" className="fill-[#CC9765]" aria-label="Layls">
              <g>
                <path
                  d="M199.09,1081.64V705.03h-77.95v390.42c0,21.08,2.86,39.56,8.79,55.29c5.79,15.84,13.74,29.02,23.7,39.55
                  c10.05,10.52,21.76,18.4,35.51,23.44c13.58,5.07,28.23,7.61,43.71,7.61c11.1,0,21.66-0.63,31.61-2.14
                  c10.09-1.42,18.01-2.93,24.07-4.46v-70.85c-11.07,3.43-23.66,5.18-37.53,5.18C216.34,1149.07,199.09,1126.67,199.09,1081.64"
                />
                <path
                  d="M1403.39,1081.64V705.03h-77.94v390.42c0,21.08,2.88,39.56,8.81,55.29c5.81,15.84,13.71,29.02,23.68,39.55
                  c10.08,10.52,21.8,18.4,35.53,23.44c13.58,5.07,28.22,7.61,43.69,7.61c11.1,0,21.65-0.63,31.65-2.14
                  c10.03-1.42,17.99-2.93,24.04-4.46v-70.85c-11.11,3.43-23.68,5.18-37.55,5.18C1420.67,1149.07,1403.39,1126.67,1403.39,1081.64"
                />
                <path
                  d="M736.57,890.99c0-121.84-57.25-182.81-171.73-182.81c-17.12,0-33.51,1.65-49.51,3.99
                  c-31.33,2.53-60.72,8.17-86.59,19.52v6.53v44.57v28.4c35.76-23.59,76.94-35.38,123.71-35.38c14.48,0,27.7,1.64,39.4,5.06
                  c11.69,3.3,21.8,7.99,30.22,14.09c6.85,4.93,11.49,11.16,15.83,17.62c13.51,20.6,20.68,49.18,20.68,86.65l-146.06,20.53
                  c-107.2,14.96-160.79,68.33-160.79,159.85c0,42.84,13.7,77.2,41.09,102.93c27.45,25.88,65.48,38.8,113.96,38.8h37.33
                  c198.36-5.89,192.47-171.82,192.47-171.82V890.99z M658.58,1049.51c0,103.95-114.48,103.95-114.48,103.95h-31.36
                  c-22.24-2.01-41.44-8.18-55.65-20.85c-16.99-15.21-25.48-34.74-25.48-58.71c0-32.83,9.19-55.75,27.62-68.68
                  c18.36-12.94,45.66-21.97,81.79-27.03l117.57-16.34V1049.51z"
                />
                <path
                  d="M1869.12,1024.36c-6.36-14.33-15.73-27.12-27.7-38.07c-12.03-11.02-26.66-20.91-43.81-29.77
                  c-17.14-8.74-36.39-17.23-58.08-25.6c-16.11-6.33-30.59-12.3-43.19-17.64c-12.77-5.45-23.58-11.53-32.37-18.23
                  c-8.93-6.76-15.58-14.32-20.29-22.97c-4.55-8.61-6.81-19.26-6.81-32.05c0-10.28,2.26-19.52,6.81-28.05
                  c4.71-8.48,11.08-15.69,19.51-21.78c8.44-6.08,18.53-10.8,30.23-14.07c11.7-3.43,24.96-5.07,39.47-5.07
                  c24.93,0,48.16,3.59,69.94,10.32v-70.92c-18.69-3.61-38.52-5.45-59.38-5.45c-23.82,0-46.88,3.04-69.33,9.12
                  c-22.27,5.96-42.15,14.98-59.65,27c-17.42,11.92-31.36,26.76-41.84,44.48c-10.44,17.76-15.73,38.06-15.73,61.11
                  c0,18.77,2.73,35.25,8.31,49.3c5.53,13.96,13.84,26.51,24.79,37.52c10.85,11.05,24.55,20.92,40.86,29.66
                  c16.34,8.9,35.23,17.52,56.93,26.13c15.45,6.1,29.98,11.93,43.43,17.52c13.49,5.56,25.19,11.89,35.29,18.87
                  c9.93,7.1,17.86,15.08,23.82,24.22c5.77,9.14,8.68,20.15,8.68,33.21c0,17.56-6.14,31-16.5,41.53
                  c-16.77,16.02-46.91,22.81-61.41,25.15c-4.52,0.49-9.08,1-13.66,1.4c-6.9,0.5-13.76,0.94-20.74,1.13
                  c-3.24,0.07-6.45-0.07-9.57-0.07c-61.13,0-121.17-11.59-121.17-11.59v70.86c0,0,3.67,0.77,9.25,1.71
                  c4.64,0.95,8.63,1.85,14.77,2.72c1.93,0.27,4.08,0.19,5.94,0.41c43.18,5.88,125.06,11.26,192.64-13.32
                  c6.46-2.29,12.79-4.56,18.79-7.34c1.65-0.84,3.48-1.21,5.12-2.04h-1.37c6.58-3.3,13.32-6.4,19.3-10.41
                  c17.76-11.77,32.02-26.74,42.58-44.59c10.69-17.91,16.02-38.94,16.02-63.14C1879,1055.79,1875.73,1038.68,1869.12,1024.36"
                />
                <path
                  d="M1028.72,1074.67L887.04,705.03h-87.57l184.77,482.34l-2.48,6.4c-17.61,21.41-39.18,33.14-65.74,33.14
                  c-13.95,0-29.33-2.92-46.07-8.61v70.34c13.58,4.22,30.59,6.24,50.9,6.24c56.05,0,102.25-30.88,138.93-91.92
                  c0,0,6.04-10.91,6.58-11.93c0,0,17.4-34.54,22.88-48.41l172.68-437.6h-87.55L1028.72,1074.67z"
                />
              </g>
            </svg>
          </Link>

          {/* Navigation Links */}
          <div className={`hidden lg:flex items-center space-x-4 transition-transform duration-300 ${searchExpanded ? 'lg:-translate-x-4' : ''}`}>
            <NavLinkWithDropdown
              label={t("navbar.shop")}
              items={[
                // { label: t("navbar.allProducts"), href: "/products" },
                ...displayProductTypes
              ]}
            />
            <NavLinkWithDropdown
              label={t("navbar.categories")}
              items={displayCategories}
            />
            <NavLinkWithDropdown
              label={t("navbar.vendors")}
              items={[
                { label: t("navbar.allVendors"), href: "/vendors" },
                ...displayVendors,

              ]}
            />
            {/* <NavLink href="#" label="Contact" /> */}
          </div>
        </div>

        {/* Center Logo for Mobile */}
        <div className="absolute left-1/2 transform -translate-x-1/2 lg:hidden">
          <Link href="/" className="flex items-center">
            <svg width="120" height="72" viewBox="0 0 2000 2000" className="fill-[#CC9765]" aria-label="Layls">
              <g>
                <path
                  d="M199.09,1081.64V705.03h-77.95v390.42c0,21.08,2.86,39.56,8.79,55.29c5.79,15.84,13.74,29.02,23.7,39.55
                  c10.05,10.52,21.76,18.4,35.51,23.44c13.58,5.07,28.23,7.61,43.71,7.61c11.1,0,21.66-0.63,31.61-2.14
                  c10.09-1.42,18.01-2.93,24.07-4.46v-70.85c-11.07,3.43-23.66,5.18-37.53,5.18C216.34,1149.07,199.09,1126.67,199.09,1081.64"
                />
                <path
                  d="M1403.39,1081.64V705.03h-77.94v390.42c0,21.08,2.88,39.56,8.81,55.29c5.81,15.84,13.71,29.02,23.68,39.55
                  c10.08,10.52,21.8,18.4,35.53,23.44c13.58,5.07,28.22,7.61,43.69,7.61c11.1,0,21.65-0.63,31.65-2.14
                  c10.03-1.42,17.99-2.93,24.04-4.46v-70.85c-11.11,3.43-23.68,5.18-37.55,5.18C1420.67,1149.07,1403.39,1126.67,1403.39,1081.64"
                />
                <path
                  d="M736.57,890.99c0-121.84-57.25-182.81-171.73-182.81c-17.12,0-33.51,1.65-49.51,3.99
                  c-31.33,2.53-60.72,8.17-86.59,19.52v6.53v44.57v28.4c35.76-23.59,76.94-35.38,123.71-35.38c14.48,0,27.7,1.64,39.4,5.06
                  c11.69,3.3,21.8,7.99,30.22,14.09c6.85,4.93,11.49,11.16,15.83,17.62c13.51,20.6,20.68,49.18,20.68,86.65l-146.06,20.53
                  c-107.2,14.96-160.79,68.33-160.79,159.85c0,42.84,13.7,77.2,41.09,102.93c27.45,25.88,65.48,38.8,113.96,38.8h37.33
                  c198.36-5.89,192.47-171.82,192.47-171.82V890.99z M658.58,1049.51c0,103.95-114.48,103.95-114.48,103.95h-31.36
                  c-22.24-2.01-41.44-8.18-55.65-20.85c-16.99-15.21-25.48-34.74-25.48-58.71c0-32.83,9.19-55.75,27.62-68.68
                  c18.36-12.94,45.66-21.97,81.79-27.03l117.57-16.34V1049.51z"
                />
                <path
                  d="M1869.12,1024.36c-6.36-14.33-15.73-27.12-27.7-38.07c-12.03-11.02-26.66-20.91-43.81-29.77
                  c-17.14-8.74-36.39-17.23-58.08-25.6c-16.11-6.33-30.59-12.3-43.19-17.64c-12.77-5.45-23.58-11.53-32.37-18.23
                  c-8.93-6.76-15.58-14.32-20.29-22.97c-4.55-8.61-6.81-19.26-6.81-32.05c0-10.28,2.26-19.52,6.81-28.05
                  c4.71-8.48,11.08-15.69,19.51-21.78c8.44-6.08,18.53-10.8,30.23-14.07c11.7-3.43,24.96-5.07,39.47-5.07
                  c24.93,0,48.16,3.59,69.94,10.32v-70.92c-18.69-3.61-38.52-5.45-59.38-5.45c-23.82,0-46.88,3.04-69.33,9.12
                  c-22.27,5.96-42.15,14.98-59.65,27c-17.42,11.92-31.36,26.76-41.84,44.48c-10.44,17.76-15.73,38.06-15.73,61.11
                  c0,18.77,2.73,35.25,8.31,49.3c5.53,13.96,13.84,26.51,24.79,37.52c10.85,11.05,24.55,20.92,40.86,29.66
                  c16.34,8.9,35.23,17.52,56.93,26.13c15.45,6.1,29.98,11.93,43.43,17.52c13.49,5.56,25.19,11.89,35.29,18.87
                  c9.93,7.1,17.86,15.08,23.82,24.22c5.77,9.14,8.68,20.15,8.68,33.21c0,17.56-6.14,31-16.5,41.53
                  c-16.77,16.02-46.91,22.81-61.41,25.15c-4.52,0.49-9.08,1-13.66,1.4c-6.9,0.5-13.76,0.94-20.74,1.13
                  c-3.24,0.07-6.45-0.07-9.57-0.07c-61.13,0-121.17-11.59-121.17-11.59v70.86c0,0,3.67,0.77,9.25,1.71
                  c4.64,0.95,8.63,1.85,14.77,2.72c1.93,0.27,4.08,0.19,5.94,0.41c43.18,5.88,125.06,11.26,192.64-13.32
                  c6.46-2.29,12.79-4.56,18.79-7.34c1.65-0.84,3.48-1.21,5.12-2.04h-1.37c6.58-3.3,13.32-6.4,19.3-10.41
                  c17.76-11.77,32.02-26.74,42.58-44.59c10.69-17.91,16.02-38.94,16.02-63.14C1879,1055.79,1875.73,1038.68,1869.12,1024.36"
                />
                <path
                  d="M1028.72,1074.67L887.04,705.03h-87.57l184.77,482.34l-2.48,6.4c-17.61,21.41-39.18,33.14-65.74,33.14
                  c-13.95,0-29.33-2.92-46.07-8.61v70.34c13.58,4.22,30.59,6.24,50.9,6.24c56.05,0,102.25-30.88,138.93-91.92
                  c0,0,6.04-10.91,6.58-11.93c0,0,17.4-34.54,22.88-48.41l172.68-437.6h-87.55L1028.72,1074.67z"
                />
              </g>
            </svg>
          </Link>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center gap-4 w-[750px] justify-end">
          {/* Search Icon */}
          <div className={`hidden lg:block transition-all duration-300 ${searchExpanded ? 'w-[300px]' : 'w-auto'}`}>
            <div className="search-container">
              <input
                checked={!searchExpanded}
                className="search-checkbox"
                type="checkbox"
                onChange={() => setSearchExpanded(!searchExpanded)}
              />
              <div className="search-mainbox">
                <div className={language === "AR" ? `search-iconContainer-ar` : `search-iconContainer`}>
                  <svg viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg" className="search-icon">
                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                  </svg>
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  updateQuery({ search: searchTerm })
                }}>
                  <input className="search-input" placeholder={t("common.search")} type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />


                </form>

              </div>
            </div>
          </div>

          {/* Upload Icon Button - Updated size and position */}
          <Link href="/dashboard/dress/create" className="hidden lg:flex flex-col items-center justify-center relative p-2 rounded-full transition-colors">

            <div className="flex gap-2 items-center w-full">
              <div className="group cursor-pointer outline-none hover:rotate-90 duration-300">
                <svg
                  className="stroke-gold fill-none group-hover:fill-black/20 group-hover:stroke-gold group-active:stroke-gold/50 group-active:fill-gold group-active:duration-0 duration-300 h-10 w-10"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeWidth="1.5"
                    d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                  ></path>
                  <path strokeWidth="1.5" d="M8 12H16"></path>
                  <path strokeWidth="1.5" d="M12 16V8"></path>
                </svg>
              </div>
              <p className="text-gold-dark mb-0 font-semibold">{t("common.uploadDress")}</p>

            </div>
          </Link>

          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            className="text-slate-700 hover:text-slate-900 relative p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {wishlistCount()}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="text-slate-700 hover:text-slate-900 relative p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount()}
              </span>
            )}
          </Link>

          {/* Account Icon */}
          <Link
            href="/dashboard"
            className="text-slate-700 hover:text-slate-900 relative p-2 rounded-full hover:bg-slate-100 transition-colors hidden lg:flex"
          >
            <User className="h-5 w-5" />
          </Link>

          {/* Arabic Language Toggle */}
          {/* <button
            onClick={() => setIsArabic(!isArabic)}
            className="text-slate-700 hover:text-slate-900 relative p-2 rounded-full hover:bg-slate-100 transition-colors hidden lg:flex items-center justify-center"
          >
            <span className="text-sm font-medium">العربية</span>
          </button> */}
          <div className="hidden relative lg:inline-block text-left">
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              {language === "EN" ? "English" : "العربية"}
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.187l3.71-3.955a.75.75 0 011.08 1.04l-4.25 4.52a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {open && (
              <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    onClick={() => handleSelect("EN")}
                    className={`w-full text-left px-4 py-2 text-sm ${language === "EN" ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-700"
                      }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleSelect("AR")}
                    className={`w-full text-left px-4 py-2 text-sm ${language === "AR" ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-700"
                      }`}
                  >
                    العربية
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Secondary Navigation Bar - Desktop Only */}
      <div className="hidden lg:block w-full border-t border-slate-100 bg-white">
        <div className="container px-4 lg:px-6 flex items-center justify-between h-10">
          {/* Left - Welcome Message */}

          {/* Left - Contact Info */}
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <a href={contactInfo.phone.href} className="flex items-center gap-2 hover:text-gold transition-colors">
              <Phone className="h-3 w-3" />
              <span>{contactInfo.phone.display}</span>
            </a>
            <a href={contactInfo.email.href} className="flex items-center gap-2 hover:text-gold transition-colors">
              <Mail className="h-3 w-3" />
              <span>{contactInfo.email.display}</span>
            </a>
          </div>

          {/* Center - Free Shipping Info */}
          <div className="text-sm text-slate-600">
            <span className="text-gold font-medium">
              {t("navbar.offer")}
            </span>
          </div>

          {/* Right - Currency Selector */}
          <div className="relative group">
            <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-gold">
              <ReactCountryFlag
                countryCode={selectedCurrency.countryCode}
                svg
                style={{ width: "1em", height: "1em" }}
              />
              <span>{selectedCurrency.symbol}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {/* Desktop currency selector */}
            <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {currencies.map((currency) => (
                <button
                  key={currency.id}  // Changed from currency.code to currency.id
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 ${selectedCurrency.code === currency.code ? "text-gold font-medium" : "text-slate-700"
                    }`}
                  onClick={() => setSelectedCurrency(currency)}
                >
                  <span className="flex items-center gap-2">
                    <ReactCountryFlag countryCode={currency.countryCode} svg style={{ width: "1em", height: "1em" }} />
                    <span>{currency.symbol}</span>
                    <span className="text-xs text-slate-500 ml-1">- {currency.name}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer - Custom implementation without using Radix UI */}
      <div
        className={`fixed inset-0 top-16 bg-black/50 z-40 transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-[300px] bg-white z-50 shadow-xl mt-16 transition-transform duration-300 ease-in-out ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Search in Drawer */}
        <div className="p-4 border-b">
          <div className="search-container w-full">
            <input
              checked={false}
              className="search-checkbox"
              type="checkbox"
            // onChange={() => setSearchExpanded(!searchExpanded)}
            />
            <div className="search-mainbox w-full">
              <div className={language === "AR" ? `search-iconContainer-ar` : `search-iconContainer`}>
                <svg viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg" className="search-icon">
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                </svg>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault()
                updateQuery({ search: searchTerm })
              }}>
                <input className="search-input" placeholder={t("common.search")} type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />


              </form>
            </div>
          </div>
          <div className="flex mt-3 justify-center gap-5 items-center">
            <div className="relative inline-block text-left">
              <button
                onClick={() => setOpen(!open)}
                className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                {language === "EN" ? "English" : "العربية"}
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.187l3.71-3.955a.75.75 0 011.08 1.04l-4.25 4.52a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      onClick={() => handleSelect("EN")}
                      className={`w-full text-left px-4 py-2 text-sm ${language === "EN" ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-700"
                        }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => handleSelect("AR")}
                      className={`w-full text-left px-4 py-2 text-sm ${language === "AR" ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-700"
                        }`}
                    >
                      العربية
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-gold">
                <ReactCountryFlag
                  countryCode={selectedCurrency.countryCode}
                  svg
                  style={{ width: "1em", height: "1em" }}
                />
                <span>{selectedCurrency.symbol}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {/* Desktop currency selector */}
              <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {currencies.map((currency) => (
                  <button
                    key={currency.id}  // Changed from currency.code to currency.id
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 ${selectedCurrency.code === currency.code ? "text-gold font-medium" : "text-slate-700"
                      }`}
                    onClick={() => setSelectedCurrency(currency)}
                  >
                    <span className="flex items-center gap-2">
                      <ReactCountryFlag countryCode={currency.countryCode} svg style={{ width: "1em", height: "1em" }} />
                      <span>{currency.symbol}</span>
                      <span className="text-xs text-slate-500 ml-1">- {currency.name}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
        {
          isDashboard ? <div className="flex flex-col divide-y pl-2" onClick={() => setIsDrawerOpen(false)}>
            <CategoryItem href={'/dashboard'} label={t('dashboard.sidebar.home')} />
            <CategoryItem href={'/dashboard/orders'} label={t('dashboard.sidebar.order')} />
            <CategoryItem href={'/dashboard/dress'} label={t('dashboard.sidebar.dress')} />
            <CategoryItem href={'/dashboard/profile'} label={t('dashboard.sidebar.profile')} />
            <CategoryItem href={'/dashboard/subscription'} label={t('dashboard.sidebar.subcription')} />
            <CategoryItem href={'/dashboard/shop'} label={t('dashboard.sidebar.shop')} />
            {/* <CategoryItem href={'/dashboard/dress'} label={t('dashboard.sidebar.logout')} /> */}
            <button
              onClick={() => logout()}
              className={cn(
                "flex items-center gap-3 py-3 px-4 hover:bg-slate-50",

              )}
            >
              {t('dashboard.sidebar.logout')}
            </button>
          </div>
            :
            <>
              {/* Tabs */}
              <div className="border-b">
                <div className="grid grid-cols-2 w-full">
                  <button
                    className={`py-3 font-medium text-center ${activeTab === "menu" ? "bg-white border-b-2 border-gold" : "bg-slate-50"}`}
                    onClick={() => setActiveTab("menu")}
                  >
                    {t("common.menu")}
                  </button>
                  <button
                    className={`py-3 font-medium text-center ${activeTab === "categories" ? "bg-white border-b-2 border-gold" : "bg-slate-50"}`}
                    onClick={() => setActiveTab("categories")}
                  >
                    {t("navbar.categories")}
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="overflow-y-auto h-[calc(100%-48px-56px)]">
                {" "}
                {/* Adjusted for search bar */}
                {activeTab === "menu" ? (
                  <div className="flex flex-col divide-y">

                    <NavItem
                      href="#"
                      label={t("navbar.shops")}
                      hasChildren
                      isExpanded={expandedMenus.includes("Shop")}
                      onToggle={(e) => toggleSubmenu(e, "Shop")}
                    >
                      <div className="bg-slate-50 pl-8 divide-y">
                        {displayProductTypes.map((el) => {
                          return (
                            <Link href={el.href} className="block py-2 px-4 hover:bg-slate-100">
                              {el.label}
                            </Link>

                          )
                        })}
                        {/* <Link href="#" className="block py-2 px-4 hover:bg-slate-100">
                    Blog List
                  </Link>
                  <Link href="#" className="block py-2 px-4 hover:bg-slate-100">
                    Blog Single
                  </Link> */}
                      </div>
                    </NavItem>
                    <NavItem
                      href="#"
                      label={t("navbar.vendors")}
                      hasChildren
                      isExpanded={expandedMenus.includes("Vendor")}
                      onToggle={(e) => toggleSubmenu(e, "Vendor")}
                    >
                      <div className="bg-slate-50 pl-8 divide-y">
                        {displayVendors.map((el) => {
                          return (
                            <Link href={el.href} className="block py-2 px-4 hover:bg-slate-100">
                              {el.label}
                            </Link>

                          )
                        })}
                        {/* <Link href="#" className="block py-2 px-4 hover:bg-slate-100">
                    Blog List
                  </Link>
                  <Link href="#" className="block py-2 px-4 hover:bg-slate-100">
                    Blog Single
                  </Link> */}
                      </div>
                    </NavItem>


                    {/* <NavItem href="/wishlist" label="Wishlist" icon={<Heart className="h-4 w-4" />} />

              <NavItem
                href="#"
                label="Currency Selector"
                hasChildren
                isExpanded={expandedMenus.includes("Currency")}
                onToggle={(e) => toggleSubmenu(e, "Currency")}
              >
                <div className="bg-slate-50 pl-8 divide-y">
                  {currencies.map((currency) => (
                    <button
                      key={currency.id}
                      className={`block w-full text-left py-2 px-4 hover:bg-slate-100 ${selectedCurrency.code === currency.code ? "text-gold font-medium" : ""
                        }`}
                      onClick={() => {
                        setSelectedCurrency(currency)
                        toggleSubmenu(
                          { preventDefault: () => { }, stopPropagation: () => { } } as React.MouseEvent,
                          "Currency"
                        )
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <ReactCountryFlag
                          countryCode={currency.countryCode}
                          svg
                          style={{ width: "1.2em", height: "1.2em" }}
                        />
                        <span>{currency.code}</span>
                        <span className="text-sm text-slate-500">- {currency.name}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </NavItem> */}
                    {/* 
              <NavLinkWithDropdown
                label={t("navbar.shop")}
                items={[
                  // { label: t("navbar.allProducts"), href: "/products" },
                  ...displayProductTypes
                ]}
              />
              <NavLinkWithDropdown
                label={t("navbar.categories")}
                items={displayCategories}
              />
              <NavLinkWithDropdown
                label={t("navbar.vendors")}
                items={[
                  { label: t("navbar.allVendors"), href: "/vendors" },
                  ...displayVendors,

                ]}
              /> */}

                    <div className="py-4 px-4">
                      <h3 className="font-medium mb-3">{t("common.needHelp")}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-slate-500" />
                          <span>+01 23456789</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-slate-500" />
                          <span>support@layls.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col divide-y">
                    {displayCategories.map((el) => {
                      return (
                        <CategoryItem href={el.href} label={el.label} />

                      )
                    })}

                  </div>
                )}
              </div>

            </>
        }



      </div>
    </header>
  )
}

// Simple Nav Link Component for Desktop
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="text-slate-700 hover:text-gold font-medium transition-colors">
      {label}
    </Link>
  )
}

// Nav Link with Dropdown for Desktop
function NavLinkWithDropdown({ label, items }: { label: string; items: { label: string; href: string }[] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative group" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button
        className="text-slate-700 hover:text-gold font-medium transition-colors flex items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-200 ease-in-out"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// Navigation Item Component for Mobile
interface NavItemProps {
  href: string
  label: string
  icon?: React.ReactNode
  hasChildren?: boolean
  isExpanded?: boolean
  onToggle?: (e: React.MouseEvent) => void
  children?: React.ReactNode
}

function NavItem({ href, label, icon, hasChildren, isExpanded, onToggle, children }: NavItemProps) {
  return (
    <div>
      <div
        className="flex items-center justify-between py-3 px-4 hover:bg-slate-50 cursor-pointer"
        onClick={hasChildren ? onToggle : undefined}
      >
        <Link
          href={hasChildren ? "#" : href}
          className="flex items-center gap-2 flex-1"
          onClick={hasChildren ? (e) => e.preventDefault() : undefined}
        >
          {icon && <span className="text-slate-500">{icon}</span>}
          <span>{label}</span>
        </Link>
        {hasChildren && (
          <div className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            {isExpanded ? <Minus className="h-4 w-4 text-slate-500" /> : <Plus className="h-4 w-4 text-slate-500" />}
          </div>
        )}
      </div>
      {isExpanded && children}
    </div>
  )
}

// Category Item Component for Mobile
function CategoryItem({ href, label, icon }: { href: string; label: string; icon?: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-3 py-3 px-4 hover:bg-slate-50" >
      {icon && <span className="text-slate-500">{icon}</span>}
      <span>{label}</span>
    </Link>
  )
}
