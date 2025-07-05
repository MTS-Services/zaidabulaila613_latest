"use client"

import Link from "next/link"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload, X, Info, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import UploadButton from "@/components/upload-button"
import { useMutation } from "@apollo/client"
import { CREATE_PRODUCT } from "@/graphql/mutation"
import { useAuth } from "@/contexts/auth-context"

export default function UploadPage() {
  const router = useRouter()
  const { user } = useAuth()



  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [dressType, setDressType] = useState("New")
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [files, setFiles] = useState<File[]>([]);
  const [createProduct] = useMutation(CREATE_PRODUCT);
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    sizes: [] as string[],
    colors: [] as string[],
    material: "",
    care: "",
    condition: "Excellent",
    vendorName: "",
  })

  if (!user) {
    return
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle checkbox change for sizes
  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({ ...prev, sizes: [...prev.sizes, size] }))
    } else {
      setFormData((prev) => ({
        ...prev,
        sizes: prev.sizes.filter((s) => s !== size),
      }))
    }
  }

  // Handle checkbox change for colors
  const handleColorChange = (color: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({ ...prev, colors: [...prev.colors, color] }))
    } else {
      setFormData((prev) => ({
        ...prev,
        colors: prev.colors.filter((c) => c !== color),
      }))
    }
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // Limit to 5 images
    if (images.length + files.length > 5) {
      toast({
        title: "Maximum 5 images allowed",
        description: "Please remove some images before adding more.",
        variant: "destructive",
      })
      return
    }

    // Create preview URLs for the images
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages((prev) => [...prev, e.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
      setFiles((prev) => [...prev, file])
    })
    // if (e.target.files) {
    //   setFiles(Array.from(e.target.files));
    // }
  }

  // Remove image
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle form submission
  // const handleSubmit = () => {
  //   setIsSubmitting(true)

  //   // Show success message after animation completes
  //   setTimeout(() => {
  //     toast({
  //       title: "Dress uploaded successfully!",
  //       description: "Your dress has been submitted for review.",
  //     })

  //     // Redirect to home page
  //     setTimeout(() => {
  //       router.push("/")
  //     }, 1000)
  //   }, 5500)
  // }

  const handleSubmit = async () => {
    console.log(files, "Files")
    const result = await createProduct({
      variables: {
        product: {
          name: "ABC",
          user: user.user.id,
          description: "Test desc",
          price: 120,
          oldPrice: 220,
          type: 'new',
          color: ['yellow', 'brown'],
          selectedColor: 'brown',
          chest: 10,
          waist: 2,
          hip: 1,
          shoulder: null,
          high: 12,
          length: 1,
          sleeve: false,
          underlay: false,
          qty: 12,
          ref: 'fghj',
          rent: true,
          sell: false,
          rentPerHur: 120,
          state: 'UU',
          size: [{ value: 'S', label: 'Small' }],
          shape: [{ value: 'SHS', label: 'snsn' }],
          category: 'wedding',
          material: 'sdfghjk',
          careInstructions: 'poiuytre',
          vendorShopName: 'cvbnm',
        },
        pictures: files,

      },
    });

    console.log('Created product:', result.data);
  };

  // Size options
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "Custom"]

  // Color options with hex values
  const colorOptions = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Red", hex: "#FF0000" },
    { name: "Blue", hex: "#0000FF" },
    { name: "Green", hex: "#008000" },
    { name: "Yellow", hex: "#FFFF00" },
    { name: "Purple", hex: "#800080" },
    { name: "Pink", hex: "#FFC0CB" },
    { name: "Orange", hex: "#FFA500" },
    { name: "Brown", hex: "#A52A2A" },
    { name: "Gray", hex: "#808080" },
    { name: "Gold", hex: "#FFD700" },
    { name: "Silver", hex: "#C0C0C0" },
    { name: "Beige", hex: "#F5F5DC" },
    { name: "Ivory", hex: "#FFFFF0" },
    { name: "Champagne", hex: "#F7E7CE" },
  ]

  // Category options
  const categoryOptions = [
    "Wedding",
    "Evening",
    "Casual",
    "Formal",
    "Cocktail",
    "Prom",
    "Bridal",
    "Bridesmaid",
    "Maternity",
    "Plus Size",
    "Petite",
    "Vintage",
    "Designer",
    "Traditional",
    "Seasonal",
  ]

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-playfair">
              Upload Your Dress
            </h1>
            <p className="max-w-[700px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Share your beautiful dress with our community
            </p>
          </div>
        </div>

        <form className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Images */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Dress Images</CardTitle>
                  <CardDescription>Upload up to 5 images of your dress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Image upload area */}
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        id="images"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <label
                        htmlFor="images"
                        className="flex flex-col items-center justify-center gap-2 cursor-pointer py-4"
                      >
                        <Upload className="h-8 w-8 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">Click to upload</span>
                        <span className="text-xs text-slate-500">PNG, JPG, WEBP up to 5MB</span>
                      </label>
                    </div>

                    {/* Image previews */}
                    {images.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Uploaded Images ({images.length}/5)</p>
                        <div className="grid grid-cols-2 gap-2">
                          {images.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square relative rounded-md overflow-hidden">
                                <Image
                                  src={image || "/placeholder.svg"}
                                  alt={`Dress image ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Dress Type</CardTitle>
                  <CardDescription>Select the type of listing</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={dressType} onValueChange={setDressType} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="New" id="type-new" />
                      <Label htmlFor="type-new" className="flex items-center">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                          New
                        </span>
                        Brand new dress with tags
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Used" id="type-used" />
                      <Label htmlFor="type-used" className="flex items-center">
                        <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                          Used
                        </span>
                        Pre-owned dress in good condition
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Rental" id="type-rental" />
                      <Label htmlFor="type-rental" className="flex items-center">
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                          Rental
                        </span>
                        Available for rental only
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Details */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the details of your dress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Dress Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Dress Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., Elegant Silk Wedding Gown"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your dress, including details about style, fit, and any special features"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">
                        Price ($) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-9"
                          value={formData.price}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="originalPrice">Original Price ($)</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-slate-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px] text-xs">
                                For used or rental items, specify the original retail price to show the discount
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                          id="originalPrice"
                          name="originalPrice"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-9"
                          value={formData.originalPrice}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                  <CardDescription>Add details about size, color, and materials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sizes */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>
                        Available Sizes <span className="text-red-500">*</span>
                      </Label>
                      <Button
                        type="button"
                        variant="link"
                        className="text-gold p-0 h-auto"
                        onClick={() => setShowSizeGuide(!showSizeGuide)}
                      >
                        Size Guide
                      </Button>
                    </div>

                    {showSizeGuide && (
                      <div className="bg-slate-50 p-3 rounded-md text-sm mb-2">
                        <h4 className="font-medium mb-1">Size Guide</h4>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div>XS: US 0-2</div>
                          <div>S: US 4-6</div>
                          <div>M: US 8-10</div>
                          <div>L: US 12-14</div>
                          <div>XL: US 16-18</div>
                          <div>XXL: US 20-22</div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {sizeOptions.map((size) => (
                        <div key={size} className="flex items-center space-x-2">
                          <Checkbox
                            id={`size-${size}`}
                            checked={formData.sizes.includes(size)}
                            onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                          />
                          <Label htmlFor={`size-${size}`}>{size}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Colors */}
                  <div className="space-y-3">
                    <Label>
                      Available Colors <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {colorOptions.map((color) => (
                        <div key={color.name} className="flex items-center space-x-2">
                          <Checkbox
                            id={`color-${color.name}`}
                            checked={formData.colors.includes(color.name)}
                            onCheckedChange={(checked) => handleColorChange(color.name, checked as boolean)}
                          />
                          <Label htmlFor={`color-${color.name}`} className="flex items-center gap-2">
                            <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: color.hex }} />
                            {color.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Material and Care */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="material">Material</Label>
                      <Input
                        id="material"
                        name="material"
                        placeholder="e.g., 100% Silk, Polyester blend"
                        value={formData.material}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="care">Care Instructions</Label>
                      <Input
                        id="care"
                        name="care"
                        placeholder="e.g., Dry clean only"
                        value={formData.care}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Condition - Only for Used items */}
                  {dressType === "Used" && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <Label htmlFor="condition">Condition</Label>
                        <Select
                          value={formData.condition}
                          onValueChange={(value) => handleSelectChange("condition", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Like New">Like New</SelectItem>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Fair">Fair</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vendor Information</CardTitle>
                  <CardDescription>Tell us about yourself as a seller</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendorName">
                      Vendor/Shop Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="vendorName"
                      name="vendorName"
                      placeholder="Your shop or business name"
                      value={formData.vendorName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <Link href="#" className="text-gold hover:underline">
                        terms and conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="#" className="text-gold hover:underline">
                        privacy policy
                      </Link>
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => router.back()}>
                    Cancel
                  </Button>

                  {!isSubmitting ? (
                    <Button type="button" className="bg-black hover:bg-black/90 text-white" onClick={handleSubmit}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Dress
                    </Button>
                  ) : (
                    <UploadButton isSubmitting={true} />
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
