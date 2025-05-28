"use client"

import type React from "react"

import { useState } from "react"
import { Search, X, Grid2X2, Grid3X3, List, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterPanelProps {
  onClose?: () => void
  isDrawer?: boolean
}

export default function FilterPanel({ onClose, isDrawer = false }: FilterPanelProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([32, 60])
  const [searchTerm, setSearchTerm] = useState("")
  const [gridView, setGridView] = useState<"2x2" | "3x3" | "4x4" | "list">("3x3")

  // Handle price range change
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
  }

  // Handle search term change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Handle filter application
  const applyFilters = () => {
    // Apply filters logic here
    console.log("Applying filters:", {
      priceRange,
      searchTerm,
    })

    // Close drawer if in mobile view
    if (isDrawer && onClose) {
      onClose()
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Header with close button for drawer */}
      {isDrawer && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Filter</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Grid View Options and Feature Dropdown */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 border rounded-md p-1">
          <Button
            variant={gridView === "2x2" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setGridView("2x2")}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button
            variant={gridView === "3x3" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setGridView("3x3")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={gridView === "4x4" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setGridView("4x4")}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <Button
            variant={gridView === "list" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setGridView("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Feature" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="best-selling">Best Selling</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* By Vendor */}
        <div>
          <h3 className="font-medium mb-3 pb-1 border-b">By Vendor</h3>
          <div className="space-y-2">
            {vendors.map((vendor) => (
              <div key={vendor.name} className="flex items-center space-x-2">
                <Checkbox id={`vendor-${vendor.slug}`} />
                <Label htmlFor={`vendor-${vendor.slug}`} className="text-sm">
                  {vendor.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* By Size */}
        <div>
          <h3 className="font-medium mb-3 pb-1 border-b">By Size</h3>
          <div className="space-y-2">
            {sizes.map((size) => (
              <div key={size.value} className="flex items-center space-x-2">
                <Checkbox id={`size-${size.value}`} />
                <Label htmlFor={`size-${size.value}`} className="text-sm">
                  {size.label} ({size.count})
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* By Color */}
        <div>
          <h3 className="font-medium mb-3 pb-1 border-b">By Color</h3>
          <div className="space-y-3">
            {colors.map((color) => (
              <div key={color.name} className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-full border cursor-pointer" style={{ backgroundColor: color.hex }} />
                <span className="text-sm">{color.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* By Category */}
        <div>
          <h3 className="font-medium mb-3 pb-1 border-b">By Category</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox id={`category-${category}`} />
                <Label htmlFor={`category-${category}`} className="text-sm">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* By Title */}
        <div>
          <h3 className="font-medium mb-3 pb-1 border-b">By Title</h3>
          <div className="space-y-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for product title"
                value={searchTerm}
                onChange={handleSearchChange}
                className="pr-8"
              />
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            <Button variant="outline" className="w-full rounded-lg" onClick={applyFilters}>
              FILTER
            </Button>
          </div>
        </div>

        {/* By Price */}
        <div>
          <h3 className="font-medium mb-3 pb-1 border-b">By Price</h3>
          <div className="space-y-6">
            <div className="px-2">
              <Slider
                defaultValue={[32, 60]}
                min={0}
                max={100}
                step={1}
                value={[priceRange[0], priceRange[1]]}
                onValueChange={handlePriceRangeChange}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>
                Price: ${priceRange[0].toFixed(2)} - ${priceRange[1].toFixed(2)}
              </span>
            </div>
            <Button variant="outline" className="w-full rounded-lg" onClick={applyFilters}>
              FILTER
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sample data
const vendors = [
  { name: "Elegance", slug: "elegance" },
  { name: "Bella Boutique", slug: "bella-boutique" },
  { name: "Dress Haven", slug: "dress-haven" },
  { name: "Chic Collection", slug: "chic-collection" },
  { name: "Glamour", slug: "glamour" },
  { name: "Runway Ready", slug: "runway-ready" },
]

const sizes = [
  { label: "L", value: "l", count: 9 },
  { label: "M", value: "m", count: 12 },
  { label: "S", value: "s", count: 6 },
  { label: "XS", value: "xs", count: 8 },
  { label: "XL", value: "xl", count: 25 },
  { label: "XXL", value: "xxl", count: 16 },
]

const colors = [
  { name: "Gray", hex: "#808080" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Sea", hex: "#20B2AA" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Red", hex: "#FF0000" },
  { name: "Orange", hex: "#FFA500" },
]

const categories = ["Accessories", "Men", "Women", "Shoes", "T-Shirt", "Dress", "Jackets"]
