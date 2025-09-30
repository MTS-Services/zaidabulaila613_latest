'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  Filter,
  Heart,
  X,
  Percent,
  Star,
  ShoppingBag,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Add the import for the CSS file at the top of the file
import './styles.css';
import { useQuery } from '@apollo/client';
import { ShopById, ShopItem } from '@/types/shop';
import { GET_PRODUCTS_BY_USER_ID, GET_SHOP_BY_ID } from '@/graphql/query';
import { useLanguage } from '@/contexts/language-context';
import { useTranslation } from '@/hooks/use-translation';
import { config } from '@/constants/app';
import {
  UserProductsByIdResponse,
  UserProductsResponse,
} from '@/types/product';
import Loader from '@/components/loader';
import ProductCard from '@/components/productCard';
import { useCurrency } from '@/contexts/currency-context';

export default function VendorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Find the vendor based on the slug
  const { slug } = use(params);
  const { language } = useTranslation();
  const { selectedCurrency } = useCurrency();

  const [userId, setUserId] = useState<string | null>(null);

  // First query: Get Shop by ID
  const { loading, error, data } = useQuery<ShopById>(GET_SHOP_BY_ID, {
    variables: {
      id: slug,
      language,
    },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.findShopById?.user?.id) {
        setUserId(data.findShopById.user.id);
      }
    },
  });

  // Second query: Get Products by userId (only when userId is ready)
  const {
    loading: productLoading,
    error: productError,
    data: products,
  } = useQuery<UserProductsByIdResponse>(GET_PRODUCTS_BY_USER_ID, {
    variables: {
      id: userId,
      language,
      currency: selectedCurrency.code.toLowerCase(),
    },
    skip: !userId, // Skip until userId is set
  });
  const vendor = data?.findShopById;

  const handleClick = (phone: string) => {
    // const phoneNumber = '923001234567'; // Replace with your number (e.g., 92 for Pakistan)
    const phoneNumber = `${phone}`; // Replace with your number (e.g., 92 for Pakistan)
    const message = `Hello, I am reaching out to your shop`;
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank'); // Opens WhatsApp in new tab
  };

  // State for filters
  const [productType, setProductType] = useState<string[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');

  // Add the state for the filter modal after the other state declarations
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Dummy wishlist and cart functions
  const isInWishlist = (productId: number) => {
    // Replace with actual wishlist logic
    return false;
  };

  const addToCart = (product: any) => {
    // Replace with actual cart logic
    console.log('Added to cart:', product);
  };

  // Toggle product type filter
  // const toggleProductType = (value: string) => {
  //   setProductType((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  // }

  // // Toggle category filter
  // const toggleCategory = (value: string) => {
  //   setCategory((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  // }

  // // Filter products based on selected filters
  // const filteredProducts = vendor.products
  //   .filter((product) => {
  //     // If no product type is selected, show all
  //     if (productType.length === 0) return true
  //     return productType.includes(product.type)
  //   })
  //   .filter((product) => {
  //     // If no category is selected, show all
  //     if (category.length === 0) return true
  //     return category.includes(product.category)
  //   })

  // // Sort products
  // const sortedProducts = [...filteredProducts].sort((a, b) => {
  //   if (sortBy === "newest") return b.id - a.id
  //   if (sortBy === "price-low") return a.price - b.price
  //   if (sortBy === "price-high") return b.price - a.price
  //   return 0
  // })

  // Get unique categories from products
  // const categories = Array.from(new Set(vendor.products.map((p) => p.category)))

  // Update the handleAddToCart function to include better error handling
  // const handleAddToCart = (product: any) => {
  //   try {
  //     addToCart({
  //       id: product.id,
  //       name: product.name,
  //       price: product.price,
  //       originalPrice: product.originalPrice,
  //       quantity: 1,
  //       images: [product.image],
  //       selectedSize: "m", // Default size
  //       selectedColor: "black", // Default color
  //       type: product.type,
  //       vendor: product.vendor || { name: vendor.name, slug: vendor.slug },
  //     })
  //     // You could add a toast notification here
  //   } catch (error) {
  //     console.error("Failed to add product to cart:", error)
  //     // Handle error appropriately
  //   }
  // }
  const { t } = useTranslation();

  return (
    <div className='min-h-screen bg-slate-50'>
      {loading && <VendorSkeleton />}
      {vendor && (
        <>
          {/* Vendor Header */}
          <div className='relative h-64 md:h-80'>
            <Image
              src={
                vendor.coverImage?.path
                  ? config.API_URL + vendor.coverImage?.path
                  : '/placeholder.svg'
              }
              alt={vendor.shopName}
              fill
              className='object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-black/30' />
            <div className='absolute bottom-0 left-0 right-0 p-6 md:p-8'>
              <div className='flex items-center gap-4'>
                <div className='relative h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden border-2 border-white shadow-sm'>
                  <Image
                    src={
                      vendor.profileImage?.path
                        ? config.API_URL + vendor.profileImage?.path
                        : '/placeholder.svg'
                    }
                    alt={vendor.shopName}
                    fill
                    className='object-cover'
                  />
                </div>
                <div>
                  <h1 className='text-2xl md:text-3xl font-bold text-white'>
                    {vendor.shopName}
                  </h1>
                  <div className='flex items-center text-white/80 text-sm mt-1'>
                    <Link href='/vendors' className='hover:text-white'>
                      {t('navbar.vendors')}
                    </Link>
                    <ChevronRight className='h-3 w-3 mx-1' />
                    <span>{vendor.shopName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vendor Description */}
          <div className='bg-white border-b'>
            <div className='container mx-auto py-6 px-4 md:px-6'>
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div>
                  <p className='text-slate-600 max-w-2xl'>
                    {vendor.description}
                  </p>
                  <div className='flex flex-wrap gap-2 mt-3'>
                    {vendor.tags.map((tag, index) => (
                      <Badge key={index} variant='secondary'>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  {/* <Button variant="outline" size="sm">
                    Follow
                  </Button> */}
                  {vendor?.shopPhoneNumber ? (
                    <Button
                      size='sm'
                      onClick={() => {
                        vendor?.shopPhoneNumber
                          ? handleClick(vendor?.shopPhoneNumber)
                          : console.log('No phone number');
                      }}
                    >
                      {t('vendorpage.contact')}
                    </Button>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className='container mx-auto py-8 px-4 md:px-6'>
            {productLoading && <Loader />}
            <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 items-stretch'>
              {products?.getProductsByUserId.data.map((el) => {
                return <ProductCard product={el} key={el.id} />;
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function VendorSkeleton() {
  return (
    <div className='animate-pulse'>
      {/* Cover Image Placeholder */}
      <div className='h-52 bg-gray-200 w-full' />

      {/* Profile, Name and Breadcrumb */}
      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-4'>
            {/* Profile Image */}
            <div className='w-24 h-24 rounded-full bg-gray-300 border-4 border-white' />

            {/* Name and Breadcrumb */}
            <div className='space-y-2'>
              <div className='w-40 h-5 bg-gray-300 rounded' />
              <div className='w-24 h-4 bg-gray-200 rounded' />
            </div>
          </div>

          {/* Button */}
          <div className='mt-4 sm:mt-0'>
            <div className='w-36 h-10 bg-gray-300 rounded' />
          </div>
        </div>
      </div>

      {/* Content Placeholder */}
      <div className='mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='h-5 w-1/2 bg-gray-200 rounded mb-2' />
        <div className='h-5 w-1/3 bg-gray-100 rounded' />
      </div>
    </div>
  );
}

// interface FilterModalProps {
//   isOpen: boolean
//   onClose: () => void
//   onApplyFilters: (filters: { types: string[]; categories: string[] }) => void
//   initialFilters: { types: string[]; categories: string[] }
// }

// const FilterModal = ({ isOpen, onClose, onApplyFilters, initialFilters }: FilterModalProps) => {
//   const [productType, setProductType] = useState<string[]>(initialFilters.types)
//   const [category, setCategory] = useState<string[]>(initialFilters.categories)

//   const vendor = vendors.find((v) => v.slug === "elegance") || vendors[0]
//   const categories = Array.from(new Set(vendor.products.map((p) => p.category)))

//   const toggleProductType = (value: string) => {
//     setProductType((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
//   }

//   const toggleCategory = (value: string) => {
//     setCategory((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
//   }

//   const handleApplyFilters = () => {
//     onApplyFilters({ types: productType, categories: category })
//     onClose()
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Filter Products</DialogTitle>
//           <DialogDescription>Narrow down your search with these filters.</DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="space-y-2">
//             <h3 className="font-medium mb-3">Product Type</h3>
//             <div className="space-y-2">
//               {["New", "Used", "Rental"].map((type) => (
//                 <div key={type} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={`type-${type}`}
//                     checked={productType.includes(type)}
//                     onCheckedChange={() => toggleProductType(type)}
//                   />
//                   <label
//                     htmlFor={`type-${type}`}
//                     className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                   >
//                     {type}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <Separator />

//           <div className="space-y-2">
//             <h3 className="font-medium mb-3">Category</h3>
//             <div className="space-y-2">
//               {categories.map((cat) => (
//                 <div key={cat} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={`cat-${cat}`}
//                     checked={category.includes(cat)}
//                     onCheckedChange={() => toggleCategory(cat)}
//                   />
//                   <label
//                     htmlFor={`cat-${cat}`}
//                     className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                   >
//                     {cat}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//         <div className="flex justify-end space-x-2">
//           <Button
//             type="button"
//             variant="secondary"
//             onClick={() => {
//               setProductType([])
//               setCategory([])
//               onApplyFilters({ types: [], categories: [] })
//             }}
//           >
//             Reset
//           </Button>
//           <Button type="button" onClick={handleApplyFilters}>
//             Apply Filters
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

// Sample data with real dress images
// const vendors = [
//   {
//     name: "Elegance",
//     slug: "elegance",
//     logo: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=200&auto=format&fit=crop",
//     coverImage: "https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?q=80&w=1200&auto=format&fit=crop",
//     description:
//       "Luxury wedding and evening gowns for the most special occasions. Our collection features handcrafted designs with premium fabrics and exquisite detailing.",
//     tags: ["Wedding", "Luxury", "Evening", "Formal"],
//     products: [
//       {
//         id: 1,
//         name: "Silk Wedding Gown",
//         category: "Wedding",
//         type: "New",
//         price: 1299,
//         originalPrice: 1499,
//         image: "https://images.unsplash.com/photo-1594612076394-2a31c2e4c726?q=80&w=1000&auto=format&fit=crop",
//       },
//       {
//         id: 2,
//         name: "Beaded Evening Dress",
//         category: "Evening",
//         type: "New",
//         price: 899,
//         image: "https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=1000&auto=format&fit=crop",
//       },
//       {
//         id: 3,
//         name: "Lace Bridal Gown",
//         category: "Wedding",
//         type: "Used",
//         price: 599,
//         originalPrice: 1299,
//         image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=1000&auto=format&fit=crop",
//       },
//       {
//         id: 4,
//         name: "Satin Ball Gown",
//         category: "Formal",
//         type: "Rental",
//         price: 199,
//         image: "https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=1000&auto=format&fit=crop",
//       },
//       {
//         id: 5,
//         name: "Sequin Cocktail Dress",
//         category: "Cocktail",
//         type: "New",
//         price: 499,
//         image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop",
//       },
//       {
//         id: 6,
//         name: "Chiffon Bridesmaid Dress",
//         category: "Wedding",
//         type: "New",
//         price: 299,
//         image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop",
//       },
//       {
//         id: 7,
//         name: "Vintage Lace Gown",
//         category: "Wedding",
//         type: "Used",
//         price: 499,
//         originalPrice: 1099,
//         image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=1000&auto=format&fit=crop",
//       },
//       {
//         id: 8,
//         name: "Designer Evening Gown",
//         category: "Evening",
//         type: "Rental",
//         price: 249,
//         image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop",
//       },
//       {
//         id: 9,
//         name: "Mermaid Wedding Dress",
//         category: "Wedding",
//         type: "New",
//         price: 1099,
//         image: "https://images.unsplash.com/photo-1585241920473-b472eb9ffbae?q=80&w=1000&auto=format&fit=crop",
//       },
//     ],
//   },
//   {
//     name: "Bella Boutique",
//     slug: "bella-boutique",
//     logo: "https://images.unsplash.com/photo-1551645120-d70bfe84c826?q=80&w=200&auto=format&fit=crop",
//     coverImage: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop",
//     description:
//       "Curated collection of designer dresses at affordable prices. We believe everyone deserves to feel beautiful without breaking the bank.",
//     tags: ["Designer", "Affordable", "Formal", "Casual"],
//     products: [
//       {
//         id: 1,
//         name: "Designer Midi Dress",
//         category: "Casual",
//         type: "New",
//         price: 299,
//         image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000&auto=format&fit=crop",
//       },
//       {
//         id: 2,
//         name: "Floral Summer Dress",
//         category: "Casual",
//         type: "New",
//         price: 159,
//         image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
//       },
//       {
//         id: 3,
//         name: "Formal Black Gown",
//         category: "Formal",
//         type: "Used",
//         price: 199,
//         originalPrice: 399,
//         image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop",
//       },
//       {
//         id: 4,
//         name: "Cocktail Party Dress",
//         category: "Cocktail",
//         type: "Rental",
//         price: 89,
//         image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop",
//       },
//       {
//         id: 5,
//         name: "Prom Night Special",
//         category: "Prom",
//         type: "New",
//         price: 249,
//         image: "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?q=80&w=1000&auto=format&fit=crop",
//       },
//       {
//         id: 6,
//         name: "Casual Maxi Dress",
//         category: "Casual",
//         type: "Used",
//         price: 79,
//         originalPrice: 149,
//         image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1000&auto=format&fit=crop",
//       },
//     ],
//   },
// ]

// <div className="container mx-auto py-8 px-4 md:px-6">
//       <div className="flex flex-col gap-6">
//         {/* Mobile Filter Button */}
//         <div className="w-full mb-4">
//           <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//             <Button
//               variant="outline"
//               className="w-full md:w-auto flex items-center justify-center gap-2"
//               onClick={() => setIsFilterModalOpen(true)}
//             >
//               <Filter className="h-4 w-4" />
//               Filter Products
//             </Button>

//             <div className="w-full md:w-auto flex items-center gap-2">
//               <Select value={sortBy} onValueChange={setSortBy}>
//                 <SelectTrigger className="w-full md:w-[180px]">
//                   <SelectValue placeholder="Sort by" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="newest">Newest</SelectItem>
//                   <SelectItem value="price-low">Price: Low to High</SelectItem>
//                   <SelectItem value="price-high">Price: High to Low</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Active Filters */}
//           {(productType.length > 0 || category.length > 0) && (
//             <div className="mt-4 flex flex-wrap gap-2">
//               {productType.map((type) => (
//                 <Badge key={type} variant="secondary" className="flex items-center gap-1">
//                   {type}
//                   <button onClick={() => toggleProductType(type)}>
//                     <X className="h-3 w-3" />
//                   </button>
//                 </Badge>
//               ))}
//               {category.map((cat) => (
//                 <Badge key={cat} variant="secondary" className="flex items-center gap-1">
//                   {cat}
//                   <button onClick={() => toggleCategory(cat)}>
//                     <X className="h-3 w-3" />
//                   </button>
//                 </Badge>
//               ))}
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => {
//                   setProductType([])
//                   setCategory([])
//                 }}
//                 className="text-sm text-slate-500 h-7"
//               >
//                 Clear All
//               </Button>
//             </div>
//           )}

//           {/* Filter Modal */}
//           <FilterModal
//             isOpen={isFilterModalOpen}
//             onClose={() => setIsFilterModalOpen(false)}
//             onApplyFilters={(filters) => {
//               if (filters.types) setProductType(filters.types)
//               if (filters.categories) setCategory(filters.categories)
//             }}
//             initialFilters={{
//               types: productType,
//               categories: category,
//             }}
//           />
//         </div>

//         {/* Products Grid */}
//         <div className="w-full">
//           {/* Results Count */}
//           <div className="mb-4">
//             <p className="text-sm text-slate-500">
//               Showing {sortedProducts.length} of {vendor.products.length} products
//             </p>
//           </div>

//           {/* Products */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {sortedProducts.map((product) => (
//               <div
//                 key={product.id}
//                 className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
//               >
//                 <div className="relative">
//                   <Link href={`/products/${product.id}`} className="block">
//                     <div className="aspect-[3/4] relative overflow-hidden">
//                       <Image
//                         src={product.image || "/placeholder.svg?height=400&width=300"}
//                         alt={product.name}
//                         fill
//                         sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
//                         className="object-cover transition-transform group-hover:scale-105"
//                         priority={product.id <= 6} // Prioritize loading for first 6 products
//                       />
//                     </div>
//                   </Link>

//                   {/* Discount Badge */}
//                   {product.originalPrice && (
//                     <div className="absolute top-2 left-2 z-30">
//                       <div className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md flex items-center justify-center gap-1">
//                         <Percent className="h-3 w-3" />
//                         <span>
//                           {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
//                         </span>
//                       </div>
//                     </div>
//                   )}

//                   <div className="absolute top-12 left-2 z-10">
//                     <Badge
//                       className={`rounded-md
//                         ${product.type === "New" ? "bg-green-500" : ""}
//                         ${product.type === "Used" ? "bg-amber-500" : ""}
//                         ${product.type === "Rental" ? "bg-purple-500" : ""}
//                       `}
//                     >
//                       {product.type}
//                     </Badge>
//                   </div>

//                   <div className="absolute top-2 right-2">
//                     <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm">
//                       <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-gold text-gold" : ""}`} />
//                       <span className="sr-only">Add to wishlist</span>
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="p-4">
//                   <Link href={`/products/${product.id}`}>
//                     <h3 className="font-medium group-hover:text-gold transition-colors line-clamp-1">
//                       {product.name}
//                     </h3>
//                   </Link>
//                   <p className="text-sm text-slate-500 mt-1">{product.category}</p>

//                   {/* Ratings */}
//                   <div className="flex items-center gap-1 mt-1">
//                     <div className="flex">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`h-3.5 w-3.5 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-slate-200"}`}
//                         />
//                       ))}
//                     </div>
//                     <span className="text-xs text-slate-500">(24)</span>
//                   </div>

//                   <div className="flex justify-between items-center mt-2">
//                     <p className="font-bold">${product.price.toFixed(2)}</p>
//                     {product.originalPrice && (
//                       <p className="text-sm text-slate-500 line-through">${product.originalPrice.toFixed(2)}</p>
//                     )}
//                   </div>

//                   {/* Total Sales */}
//                   <p className="text-xs text-slate-500 mt-1">128 sold</p>

//                   {/* Cart Button */}
//                   <button
//                     className="cart-button noselect w-full mt-3 relative overflow-hidden"
//                     onClick={() => handleAddToCart(product)}
//                   >
//                     <span className="text">Add to Cart</span>
//                     <span className="icon">
//                       <ShoppingBag className="h-5 w-5" />
//                     </span>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Empty State */}
//           {sortedProducts.length === 0 && (
//             <div className="bg-white rounded-lg p-8 text-center">
//               <h3 className="font-bold text-lg">No products found</h3>
//               <p className="text-slate-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
//               <Button
//                 variant="outline"
//                 className="mt-4"
//                 onClick={() => {
//                   setProductType([])
//                   setCategory([])
//                 }}
//               >
//                 Reset Filters
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
