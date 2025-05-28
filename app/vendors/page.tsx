import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { VendorGrid } from "@/components/vendor-grid"

export default function VendorsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b">
        <div className="container mx-auto py-8 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-playfair">Our Vendors</h1>
              <p className="max-w-[700px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover our curated selection of trusted dress vendors
              </p>
            </div>
          </div>

          <div className="max-w-md mx-auto mt-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search vendors..."
                className="w-full bg-slate-50 pl-8 rounded-lg border-slate-200"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 md:py-12 md:px-6">
        <VendorGrid vendors={vendors} />
      </div>
    </div>
  )
}

const vendors = [
  {
    name: "Elegance",
    slug: "elegance",
    logo: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop",
    description: "Luxury wedding and evening gowns for the most special occasions.",
    productsCount: 124,
    tags: ["Wedding", "Luxury", "Evening"],
  },
  {
    name: "Bella Boutique",
    slug: "bella-boutique",
    logo: "https://images.unsplash.com/photo-1551645120-d70bfe84c826?q=80&w=200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop",
    description: "Curated collection of designer dresses at affordable prices.",
    productsCount: 98,
    tags: ["Designer", "Affordable", "Formal"],
  },
  {
    name: "Dress Haven",
    slug: "dress-haven",
    logo: "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=800&auto=format&fit=crop",
    description: "Specializing in vintage and pre-loved formal wear.",
    productsCount: 76,
    tags: ["Vintage", "Pre-loved", "Formal"],
  },
  {
    name: "Chic Collection",
    slug: "chic-collection",
    logo: "https://images.unsplash.com/photo-1589642380614-4a8c2147b857?q=80&w=200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
    description: "Modern styles for the fashion-forward woman.",
    productsCount: 112,
    tags: ["Modern", "Trendy", "Casual"],
  },
  {
    name: "Glamour",
    slug: "glamour",
    logo: "https://images.unsplash.com/photo-1589642380614-4a8c2147b857?q=80&w=200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=800&auto=format&fit=crop",
    description: "High-end designer rentals for red carpet events.",
    productsCount: 64,
    tags: ["Rental", "Designer", "Evening"],
  },
  {
    name: "Runway Ready",
    slug: "runway-ready",
    logo: "https://images.unsplash.com/photo-1589642380614-4a8c2147b857?q=80&w=200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?q=80&w=800&auto=format&fit=crop",
    description: "Trendy styles straight from fashion week to your closet.",
    productsCount: 87,
    tags: ["Trendy", "Fashion Week", "Modern"],
  },
  {
    name: "Couture Corner",
    slug: "couture-corner",
    logo: "https://images.unsplash.com/photo-1589642380614-4a8c2147b857?q=80&w=200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=800&auto=format&fit=crop",
    description: "Custom and made-to-measure formal dresses.",
    productsCount: 45,
    tags: ["Custom", "Formal", "Luxury"],
  },
  {
    name: "Fashion Forward",
    slug: "fashion-forward",
    logo: "https://images.unsplash.com/photo-1589642380614-4a8c2147b857?q=80&w=200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
    description: "Avant-garde designs for the bold and daring.",
    productsCount: 56,
    tags: ["Avant-garde", "Bold", "Unique"],
  },
  {
    name: "Dress Dreams",
    slug: "dress-dreams",
    logo: "https://images.unsplash.com/photo-1589642380614-4a8c2147b857?q=80&w=200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop",
    description: "Affordable luxury for every special occasion.",
    productsCount: 103,
    tags: ["Affordable", "Luxury", "Occasion"],
  },
  {
    name: "Style Studio",
    slug: "style-studio",
    logo: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=800&auto=format&fit=crop",
    description: "Bohemian and free-spirited designs for the modern woman.",
    productsCount: 78,
    tags: ["Bohemian", "Casual", "Modern"],
  },
  {
    name: "Elegant Edge",
    slug: "elegant-edge",
    logo: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
    description: "Contemporary designs with a classic twist.",
    productsCount: 92,
    tags: ["Contemporary", "Classic", "Formal"],
  },
  {
    name: "Dress Delight",
    slug: "dress-delight",
    logo: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop",
    description: "Colorful and playful dresses for all occasions.",
    productsCount: 115,
    tags: ["Colorful", "Playful", "Casual"],
  },
]
