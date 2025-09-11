"use client"

import { useState } from "react"
import Link from "next/link"

interface AnimatedButtonProps {
  text: string
  href: string
  size?: "sm" | "md" | "lg"
  className?: string
  asDiv?: boolean
  onClick?: () => void
}

export function AnimatedButton({
  text,
  href,
  size = "md",
  className = "",
  asDiv = false,
  onClick,
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    sm: "h-[30px] max-w-[130px] w-full text-[9px]",
    md: "h-[35px] max-w-[180px] w-full text-xs",
    lg: "h-[40px] max-w-[200px] w-full text-sm",
  }

  const commonProps = {
    className: `flex items-center justify-center px-3 pr-4 py-2 rounded-md 
               bg-gold hover:bg-gold/90 text-white border-none relative cursor-pointer 
               transition-all duration-200 active:translate-x-[1px] active:translate-y-[1px] ${sizeClasses[size]} ${className}`,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onClick,
  }

  const buttonContent = (
    <>
      <span className={`transition-transform duration-200 ${isHovered ? "transform -translate-x-2" : ""}`}>{text}</span>
      <div
        className={`absolute right-0 w-[30px] h-full text-lg flex items-center justify-center
                    ${isHovered ? "animate-slide-right" : "opacity-0"}`}
      >
        ›
      </div>
    </>
  )

  if (asDiv) {
    return <div {...commonProps}>{buttonContent}</div>
  }

  return (
    <Link href={href} {...commonProps}>
      {buttonContent}
    </Link>
  )
}
