"use client"

import { useState } from "react"
import { Grid2X2, Grid3X3, List, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: any) => void
  initialFilters?: any
}

export default function FilterModal({ isOpen, onClose, onApplyFilters, initialFilters = {} }: FilterModalProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters.priceRange || [32, 60])
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || "")
  const [selectedVendors, setSelectedVendors] = useState<string[]>(initialFilters.vendors || [])
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialFilters.sizes || [])
  const [selectedColors, setSelectedColors] = useState<string[]>(initialFilters.colors || [])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.categories || [])
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialFilters.types || [])
  const [gridView, setGridView] = useState<"2x2" | "3x3" | "4x4" | "list">("3x3")

  // Handle price range change
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
  }

  // Toggle vendor selection
  const toggleVendor = (vendor: string) => {
    setSelectedVendors((prev) => (prev.includes(vendor) ? prev.filter((v) => v !== vendor) : [...prev, vendor]))
  }

  // Toggle size selection
  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
  }

  // Toggle color selection
  const toggleColor = (color: string) => {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]))
  }

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Toggle type selection
  const toggleType = (type: string) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  // Reset all filters
  const resetFilters = () => {
    setPriceRange([32, 60])
    setSearchTerm("")
    setSelectedVendors([])
    setSelectedSizes([])
    setSelectedColors([])
    setSelectedCategories([])
    setSelectedTypes([])
  }

  // Apply filters
  const applyFilters = () => {
    onApplyFilters({
      priceRange,
      searchTerm,
      vendors: selectedVendors,
      sizes: selectedSizes,
      colors: selectedColors,
      categories: selectedCategories,
      types: selectedTypes,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Filter</DialogTitle>
        </DialogHeader>

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
                  <Checkbox
                    id={`vendor-${vendor.slug}`}
                    checked={selectedVendors.includes(vendor.name)}
                    onCheckedChange={() => toggleVendor(vendor.name)}
                  />
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
                  <Checkbox
                    id={`size-${size.value}`}
                    checked={selectedSizes.includes(size.value)}
                    onCheckedChange={() => toggleSize(size.value)}
                  />
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
                  <div
                    className={`h-6 w-6 rounded-full border cursor-pointer ${
                      selectedColors.includes(color.name) ? "ring-2 ring-black ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => toggleColor(color.name)}
                  />
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
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-8"
                />
              </div>
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
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-between">
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
          <Button onClick={applyFilters} className="bg-black text-white hover:bg-black/90">
            APPLY FILTERS
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
