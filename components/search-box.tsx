"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"

export default function SearchBox() {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Function to handle expanding the search
  const expandSearch = () => {
    if (isCollapsed) {
      setIsCollapsed(false)
      // Focus the input after expanding
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300) // Wait for animation to complete
    }
  }

  // Function to handle collapsing the search
  const collapseSearch = () => {
    if (!isCollapsed && !searchTerm) {
      setIsCollapsed(true)
    }
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)

    // Reset the auto-collapse timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set a new timeout to collapse after inactivity (5 seconds)
    if (!e.target.value) {
      timeoutRef.current = setTimeout(() => {
        collapseSearch()
      }, 5000)
    }
  }

  // Handle input click to prevent propagation
  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // Handle search icon click
  const handleSearchIconClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isCollapsed) {
      expandSearch()
    } else if (!searchTerm) {
      collapseSearch()
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Perform search action here
    console.log("Searching for:", searchTerm)

    // Optionally collapse after search if empty
    if (!searchTerm) {
      collapseSearch()
    }
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="relative">
      {/* Invisible clickable area when expanded */}
      {!isCollapsed && <div className="fixed inset-0 z-40" onClick={collapseSearch} />}

      <form
        onSubmit={handleSubmit}
        className={`
          relative flex items-center justify-end
          rounded-full bg-black transition-all duration-300 ease-in-out
          h-10 ${isCollapsed ? "w-10" : "w-[230px]"}
        `}
      >
        <button
          type="button"
          onClick={handleSearchIconClick}
          className={`
            absolute z-10 flex items-center justify-center
            transition-all duration-300 ease-in-out
            w-10 h-10 ${isCollapsed ? "right-0" : "right-[10px]"}
          `}
          aria-label="Toggle search"
        >
          <Search className="h-5 w-5 text-white" />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder="Search"
          className={`
            bg-transparent border-none outline-none text-white
            transition-all duration-300 ease-in-out pl-4 pr-12
            placeholder:text-white/70 font-sans text-base h-full
            ${isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"}
          `}
        />
      </form>
    </div>
  )
}
