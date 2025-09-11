"use client"

import Link from "next/link"
import type { ButtonHTMLAttributes } from "react"

interface NeumorphicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  href?: string
  className?: string
  variant?: "default" | "white"
}

export default function NeumorphicButton({
  text,
  href,
  className = "",
  variant = "default",
  ...props
}: NeumorphicButtonProps) {
  const baseClasses = `
    neumorphic-button
    flex items-center justify-center
    outline-none cursor-pointer
    w-[150px] h-[50px]
    rounded-lg
    transition-all duration-200 ease-in-out
    font-sans text-sm font-semibold
    shadow-sm
    ${className}
  `

  const variantClasses = {
    default: `
      bg-gradient-to-t from-[#D8D9DB] via-white to-[#FDFDFD]
      border border-[#8F9092]
      text-[#606060]
      neumorphic-text-shadow
    `,
    white: `
    bg-white
    border border-white/80
    text-gold
    hover:text-[#B07845]
    shadow-[0_4px_6px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.6)]
    hover:shadow-[0_6px_10px_rgba(0,0,0,0.15),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)]
    active:shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_2px_3px_rgba(0,0,0,0.05)]
  `,
  }

  const buttonClasses = `${baseClasses} ${variantClasses[variant]}`

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {text}
      </Link>
    )
  }

  return (
    <button className={buttonClasses} {...props}>
      {text}
    </button>
  )
}
