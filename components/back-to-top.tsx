"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { usePathname } from "next/navigation"

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  // Check if we're on the upload page
  const isUploadPage = pathname === "/upload"

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    window.addEventListener("scroll", toggleVisibility)
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("scroll", toggleVisibility)
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (isUploadPage) return null

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className={`
       fixed right-6 z-50
       ${isMobile ? "bottom-24" : "bottom-6"}
       w-[50px] h-[50px] rounded-full
       bg-[#141414] border-none font-semibold
       flex items-center justify-center
       shadow-[0px_0px_0px_4px_rgba(204,151,101,0.25)]
       cursor-pointer overflow-hidden
       transition-all duration-300 ease-in-out
       hover:w-[140px] hover:rounded-[50px] hover:bg-[#CC9765]
       group
     `}
      aria-label="Back to top"
    >
      <ArrowUp
        className="
         w-[18px] h-[18px] text-white
         transition-transform duration-300 ease-in-out
         group-hover:translate-y-[-200%]
       "
      />
      <span
        className="
         absolute text-white text-[0px]
         transition-all duration-300 ease-in-out
         group-hover:text-[13px] group-hover:opacity-100
       "
      >
        Back to Top
      </span>
    </button>
  )
}
