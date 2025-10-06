'use client';

import {
  ChevronLeft,
  ChevronRight,
  Facebook,
  Instagram,
  Minus,
  PinIcon as Pinterest,
  Plus,
  RefreshCw,
  ShieldCheck,
  Truck,
  Twitter,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import HeartButton from '@/components/heart-button';
import ProductActionButton from '@/components/productActionButton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { config } from '@/constants/app';
import { arColors, enColors } from '@/constants/colors';
import { useAuth } from '@/contexts/auth-context';
import { useCurrency } from '@/contexts/currency-context';
import { GET_PRODUCT_BY_ID } from '@/graphql/query';
import { useCart } from '@/hooks/use-cart';
import { useTranslation } from '@/hooks/use-translation';
import { useWishlist } from '@/hooks/use-wishlist';
import { capitalizeFirstLetter } from '@/lib/utils';
import { ProductByIdResponse, ProductPicture } from '@/types/product';
import { useQuery } from '@apollo/client';

export default function Product({ id }: { id: string }) {
  // Find the product based on the id

  // State for selected options
  const [selectedSize, setSelectedSize] = useState<any | null>(null);
  const [selectedColor, setSelectedColor] = useState<any | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [mainImage, setMainImage] = useState<ProductPicture | null>(null);
  const [activeTab, setActiveTab] = useState('description');
  // State for image modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModalImage, setCurrentModalImage] = useState(0);
  // Cart and wishlist hooks
  const { addToCart } = useCart();

  const { language } = useTranslation();
  const { selectedCurrency } = useCurrency();

  const { cart } = useCart();
  const { user } = useAuth();

  // Helper function to get text from multilingual fields
  const getText = (
    field: string | { en?: string; ar?: string } | undefined
  ): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return language === 'AR'
      ? field.ar || field.en || ''
      : field.en || field.ar || '';
  };

  const { data, loading, error } = useQuery<ProductByIdResponse>(
    GET_PRODUCT_BY_ID,
    {
      variables: {
        id: id,
        language: language,
        currency: selectedCurrency.code.toLowerCase(),
      },
      skip: !id,
      fetchPolicy: 'network-only',
    }
  );

  useEffect(() => {
    if (data?.productById) {
      // Initialize with first color
      const firstColor = data?.productById.color[0] || '';
      setSelectedColor(firstColor);

      // Find the first available size for the first color
      const firstAvailableColor = data?.productById.availableColors?.find(
        (colorObj) => {
          if (!colorObj.color) return false;
          const colorValue =
            language === 'AR' ? colorObj.color.ar : colorObj.color.en;
          return (
            colorValue?.toLowerCase() === getText(firstColor).toLowerCase()
          );
        }
      );
      const firstSize = firstAvailableColor?.sizes?.[0] || null;
      setSelectedSize(firstSize);

      setMainImage(data?.productById.pictures[0] || null);
    }
  }, [data, language]);
  const { t } = useTranslation();

  const product = data?.productById;
  if (loading) {
    return <ProductSkeleton />;
  }
  if (!product) {
    return <div>Product not found</div>;
  }
  const cartItem = cart.find((el) => el.id === product.id);

  // Open modal with specific image
  const openImageModal = (imageIndex: number) => {
    setCurrentModalImage(imageIndex);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = ''; // Restore scrolling
  };

  // Navigate to next image in modal
  const nextImage = () => {
    setCurrentModalImage((prev) => (prev + 1) % product.pictures.length);
  };

  // Navigate to previous image in modal
  const prevImage = () => {
    setCurrentModalImage(
      (prev) => (prev - 1 + product.pictures.length) % product.pictures.length
    );
  };

  // Increment quantity
  const incrementQuantity = () => {
    setSelectedQuantity((prev) => Math.min(prev + 1, product.qty));
  };

  // Decrement quantity
  const decrementQuantity = () => {
    setSelectedQuantity((prev) => Math.max(prev - 1, 1));
  };

  const matchedColors = (language === 'AR' ? arColors : enColors).filter(
    (color) =>
      product.color.some(
        (c: string) => c.toLowerCase() === color.value.toLowerCase()
      )
  );

  // Get available sizes for the selected color
  const getAvailableSizesForColor = (colorName: string) => {
    const colorObj = product.availableColors?.find((color) => {
      if (!color.color) return false;
      const colorValue = language === 'AR' ? color.color.ar : color.color.en;
      return colorValue?.toLowerCase() === colorName.toLowerCase();
    });
    return colorObj?.sizes || [];
  };

  // Handle color selection
  const handleColorChange = (colorValue: string) => {
    setSelectedColor(colorValue);

    // Get available sizes for this color
    const availableSizes = getAvailableSizesForColor(colorValue);

    // If current selected size is not available in this color, select the first available size
    const isCurrentSizeAvailable = availableSizes.some(
      (size: any) => size._id === selectedSize?._id
    );

    if (!isCurrentSizeAvailable && availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
      // Reset quantity when size changes
      setSelectedQuantity(1);
    } else if (availableSizes.length === 0) {
      setSelectedSize(null);
      setSelectedQuantity(1);
    }
  };

  // Handle size selection
  const handleSizeChange = (size: any) => {
    setSelectedSize(size);
    // Reset quantity when size changes and ensure it doesn't exceed available quantity
    setSelectedQuantity(Math.min(selectedQuantity, size.quantity));
  };

  // Get available sizes for currently selected color
  const availableSizes = selectedColor
    ? getAvailableSizesForColor(selectedColor)
    : [];

  return (
    <div className='min-h-screen bg-white'>
      {/* Breadcrumbs */}
      <div className='bg-slate-50 py-3 border-b'>
        <div className='container px-4 md:px-6'>
          {/* Breadcrumbs */}
          <div className='flex items-center text-sm text-slate-600'>
            <Link href='/' className='hover:text-slate-900'>
              Home
            </Link>
            <ChevronRight className='h-4 w-4 mx-1' />
            <Link href='/vendors' className='hover:text-slate-900'>
              Vendors
            </Link>
            <ChevronRight className='h-4 w-4 mx-1' />
            {/* {product.vendor && typeof product.vendor === "object" ? (
              <Link href={`/vendors/${product.vendor.slug}`} className="hover:text-slate-900">
                {product.vendor.name}
              </Link>
            ) : (
              <span className="hover:text-slate-900">
                {typeof product.vendor === "string" ? product.vendor : "Unknown Vendor"}
              </span>
            )} */}
            <ChevronRight className='h-4 w-4 mx-1' />
            <span className='text-slate-900 font-medium'>
              {getText(product.name)}
            </span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className='container px-4 md:px-6 py-8'>
        <div className='grid md:grid-cols-2 gap-8 lg:gap-12'>
          {/* Product Images */}
          <div className=''>
            <div className='md:flex md:gap-4'>
              {/* Thumbnails - Left side on desktop, hidden on mobile */}
              <div className='hidden md:flex md:flex-col md:gap-3 md:w-20'>
                {product.pictures.map((image, index) => (
                  <button
                    key={index}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${
                      mainImage === image ? 'ring-2 ring-gold' : ''
                    }`}
                    onClick={() => setMainImage(image)}
                  >
                    <Image
                      src={config.API_URL + image.path || '/placeholder.svg'}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className='object-contain p-1'
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className='flex-1'>
                <div
                  className='relative aspect-square overflow-hidden rounded-lg border cursor-pointer'
                  onClick={() =>
                    mainImage &&
                    openImageModal(product.pictures.indexOf(mainImage))
                  }
                >
                  <Image
                    src={
                      mainImage
                        ? config.API_URL + mainImage.path
                        : '/placeholder.svg'
                    }
                    alt={getText(product.name)}
                    fill
                    className='object-contain'
                    sizes='(max-width: 768px) 100vw, 50vw'
                  />
                  <Badge
                    className={`
                      absolute top-3 left-3 z-10
                      ${
                        product.type === 'new' || product.type === 'جديد'
                          ? 'bg-green-500'
                          : ''
                      }
                      ${
                        product.type === 'used' || product.type === 'مستعمل'
                          ? 'bg-amber-500'
                          : ''
                      }
                      ${
                        product.type === 'rental' || product.type === 'الإيجار'
                          ? 'bg-purple-500'
                          : ''
                      }
                    `}
                  >
                    {capitalizeFirstLetter(getText(product.type))}
                  </Badge>
                  <div className='absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center'>
                    <span className='bg-white/80 text-slate-800 px-3 py-1 rounded-md text-sm font-medium'>
                      {t('productpageid.zoom')}
                    </span>
                  </div>
                </div>

                {/* Thumbnails - Bottom on mobile only */}
                <div className='flex md:hidden gap-3 overflow-auto pb-2 mt-4'>
                  {product.pictures.map((image, index) => (
                    <button
                      key={index}
                      className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${
                        mainImage === image ? 'ring-2 ring-gold' : ''
                      }`}
                      onClick={() => setMainImage(image)}
                    >
                      <Image
                        src={config.API_URL + image.path || '/placeholder.svg'}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        fill
                        className='object-contain p-1'
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className='space-y-6'>
            <div>
              <h1 className='text-2xl md:text-3xl font-bold'>
                {getText(product.name)}
              </h1>
              <div className='mt-2 flex items-center gap-4'>
                <div className='text-2xl font-bold'>
                  {product?.price && (
                    <>
                      {' '}
                      <span>{selectedCurrency.symbol} </span>
                      {product.price}
                    </>
                  )}{' '}
                </div>
                {product.oldPrice && (
                  <div className='text-lg text-slate-500 line-through'>
                    {product?.oldPrice && (
                      <>
                        {' '}
                        <span>{selectedCurrency.symbol} </span>
                        {product.oldPrice}
                      </>
                    )}
                  </div>
                )}
              </div>

              <p className='mt-4 text-slate-600'>
                {getText(product.description)}
              </p>
            </div>

            {/* Color Selection */}
            <div className='space-y-2'>
              <div className='font-medium'>
                {t('productpageid.color')}:{' '}
                <span className='uppercase'>{selectedColor}</span>
              </div>

              <div className='flex flex-wrap gap-2'>
                {matchedColors.map((color) => {
                  const colorSizes = getAvailableSizesForColor(color.value);
                  const hasAvailableSizes = colorSizes.some(
                    (size: any) => size.quantity > 0
                  );
                  const totalQuantity = colorSizes.reduce(
                    (sum: number, size: any) => sum + size.quantity,
                    0
                  );

                  return (
                    <div key={color.value} className='relative'>
                      <button
                        className={`w-8 h-8 rounded-full border transition-all duration-200 ${
                          selectedColor === color.value
                            ? 'ring-2 ring-gold ring-offset-2 scale-110'
                            : 'border-slate-300 hover:border-slate-400'
                        } ${
                          !hasAvailableSizes
                            ? 'opacity-30 cursor-not-allowed grayscale'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() =>
                          hasAvailableSizes && handleColorChange(color.value)
                        }
                        disabled={!hasAvailableSizes}
                        aria-label={`Select ${color.name} color`}
                        title={
                          !hasAvailableSizes
                            ? `${color.name} - Out of stock`
                            : `${
                                color.name
                              } - ${totalQuantity} items available in ${
                                colorSizes.filter((s: any) => s.quantity > 0)
                                  .length
                              } sizes`
                        }
                      />
                      {!hasAvailableSizes && (
                        <div className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white text-xs flex items-center justify-center'>
                          <span className='text-white text-[8px]'>✕</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Size Selection */}
            <div className='space-y-4'>
              <div className='font-medium'>
                {t('productpageid.size')}:{' '}
                <span className='uppercase'>{selectedSize?.size}</span>
              </div>
              <div className='flex flex-wrap gap-2 '>
                {availableSizes.map((s: any) => (
                  <button
                    key={s._id}
                    className={`min-w-8 h-8 px-2 flex items-center justify-center border rounded-md ${
                      selectedSize?._id === s._id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : s.quantity > 0
                        ? 'border-slate-300 text-slate-900 hover:border-slate-400'
                        : 'border-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                    onClick={() => s.quantity > 0 && handleSizeChange(s)}
                    disabled={s.quantity === 0}
                    title={
                      s.quantity === 0
                        ? 'Out of stock'
                        : `${s.quantity} available`
                    }
                  >
                    {s.size}
                  </button>
                ))}
              </div>

              {/* Selection Summary */}
              <div className='bg-slate-50 rounded-lg p-4 space-y-2'>
                {selectedColor ? (
                  <div className='space-y-1'>
                    <p className='text-sm text-slate-600 flex items-center gap-2'>
                      <span className='font-medium'>
                        {t('productpageid.color')}:
                      </span>
                      <span className='capitalize bg-white px-2 py-1 rounded border text-xs font-medium'>
                        {selectedColor}
                      </span>
                      {availableSizes.length > 0 && (
                        <span className='text-green-600 text-xs'>
                          (
                          {
                            availableSizes.filter((s: any) => s.quantity > 0)
                              .length
                          }{' '}
                          sizes available)
                        </span>
                      )}
                    </p>

                    {selectedSize ? (
                      <p className='text-sm text-slate-600 flex items-center gap-2'>
                        <span className='font-medium'>
                          {t('productpageid.size')}:
                        </span>
                        <span className='bg-white px-2 py-1 rounded border text-xs font-medium'>
                          {selectedSize.size}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            selectedSize.quantity > 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          ({selectedSize.quantity} available)
                        </span>
                      </p>
                    ) : (
                      <p className='text-sm text-amber-600'>
                        Please select a size
                      </p>
                    )}

                    {availableSizes.length === 0 && (
                      <p className='text-sm text-amber-600'>
                        ⚠️ No sizes available for this color
                      </p>
                    )}
                  </div>
                ) : (
                  <p className='text-sm text-slate-500'>
                    Please select a color to see available sizes
                  </p>
                )}
              </div>

              <Link href='#' className='text-sm text-gold hover:underline'>
                {t('productpageid.sizeguide')}
              </Link>
            </div>

            {/* Quantity and Add to Cart */}
            <div className='flex items-end gap-6'>
              <div className='flex items-center gap-1'>
                <div className='flex items-center border rounded-md'>
                  <button
                    className='px-3 py-3 text-slate-500 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={decrementQuantity}
                    disabled={selectedQuantity <= 1}
                    aria-label='Decrease quantity'
                  >
                    <Minus className='h-4 w-4' />
                  </button>

                  <div className='w-12 text-center text-sm font-medium'>
                    {selectedQuantity}
                  </div>

                  <button
                    className='px-3 py-3 text-slate-500 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={incrementQuantity}
                    disabled={
                      !selectedSize || selectedQuantity >= selectedSize.quantity
                    }
                    aria-label='Increase quantity'
                  >
                    <Plus className='h-4 w-4' />
                  </button>
                </div>
                {selectedSize && (
                  <p className='text-xs text-slate-500 text-center'>
                    Max: {selectedSize.quantity}
                  </p>
                )}
              </div>

              <div className='flex gap-2 flex-1 items-center'>
                <ProductActionButton
                  user={user}
                  product={{
                    ...product,
                    selectedSize,
                    selectedColor,
                    quantity: selectedQuantity,
                  }}
                  cartItem={cartItem}
                  addToCart={addToCart}
                />
                <div className='pt-2'>
                  <HeartButton
                    productId={product.id}
                    size='md'
                    product={{
                      id: product.id,
                      name: getText(product.name),
                      price: product.price || 0,
                      vendor: {
                        name: '',
                        slug: '',
                      },
                      images: product.pictures.map((el) => el.path),
                      originalPrice: product.oldPrice || 0,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Payment Methods */}

            {/* Additional Info */}
            <div className='grid grid-cols-2 gap-4 text-sm pt-4 border-t'>
              <div>
                <div className='font-medium'>
                  {t('productpageid.ref')}: {product.ref}
                </div>
                <div className='text-slate-500 mt-1'>
                  {t('productpageid.categories')}:{' '}
                  <Link href='#' className='text-gold hover:underline'>
                    {product.category?.name}
                  </Link>
                </div>
              </div>
              {/* <div>
                <Link href="#" className="text-gold hover:underline">
                  Ask a Question
                </Link>
                <div className="text-slate-500 mt-1">Delivery and Return</div>
              </div> */}
            </div>

            {/* Social Share */}
            <div className='flex items-center gap-4 pt-4 border-t'>
              <div className='text-sm font-medium'>
                {t('productpageid.share')}:
              </div>
              <div className='flex gap-2'>
                <Link href='#' className='text-slate-500 hover:text-gold'>
                  <Facebook className='h-4 w-4' />
                </Link>
                <Link href='#' className='text-slate-500 hover:text-gold'>
                  <Twitter className='h-4 w-4' />
                </Link>
                <Link href='#' className='text-slate-500 hover:text-gold'>
                  <Instagram className='h-4 w-4' />
                </Link>
                <Link href='#' className='text-slate-500 hover:text-gold'>
                  <Pinterest className='h-4 w-4' />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className='mt-12'>
          <Tabs
            defaultValue='description'
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className='w-full justify-start border-b rounded-none bg-transparent h-auto p-0'>
              <TabsTrigger
                value='description'
                className='rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent text-slate-600 data-[state=active]:text-slate-900 font-medium'
              >
                {t('productpageid.description')}
              </TabsTrigger>
              <TabsTrigger
                value='additional'
                className='rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent text-slate-600 data-[state=active]:text-slate-900 font-medium'
              >
                {t('productpageid.additionalinformation')}
              </TabsTrigger>
              {/* <TabsTrigger
                value="warranty"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent text-slate-600 data-[state=active]:text-slate-900 font-medium"
              >
                Warranty & Shipping
              </TabsTrigger> */}
            </TabsList>

            <TabsContent value='description' className='pt-6'>
              <div className='prose max-w-none'>
                <p>{getText(product?.description)}</p>

                <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-12'>
                  <div className='flex flex-col items-center text-center'>
                    <div className='bg-slate-100 rounded-full p-4 mb-3'>
                      <ShieldCheck className='h-6 w-6 text-gold' />
                    </div>
                    <div className='text-sm font-medium'>
                      {t('productpageid.safe')}
                    </div>
                    <div className='text-xs text-slate-500'>
                      {t('productpageid.guarant')}
                    </div>
                  </div>

                  <div className='flex flex-col items-center text-center'>
                    <div className='bg-slate-100 rounded-full p-4 mb-3'>
                      <Truck className='h-6 w-6 text-gold' />
                    </div>
                    <div className='text-sm font-medium'>
                      {t('productpageid.free')}
                    </div>
                    <div className='text-xs text-slate-500'>
                      {t('productpageid.overon')}
                    </div>
                  </div>

                  <div className='flex flex-col items-center text-center'>
                    <div className='bg-slate-100 rounded-full p-4 mb-3'>
                      <RefreshCw className='h-6 w-6 text-gold' />
                    </div>
                    <div className='text-sm font-medium'>
                      {t('productpageid.hassle')}
                    </div>
                    <div className='text-xs text-slate-500'>
                      {t('productpageid.moneyback')}
                    </div>
                  </div>

                  <div className='flex flex-col items-center text-center'>
                    <div className='bg-slate-100 rounded-full p-4 mb-3'>
                      <ShieldCheck className='h-6 w-6 text-gold' />
                    </div>
                    <div className='text-sm font-medium'>
                      {t('productpageid.authentic')}
                    </div>
                    <div className='text-xs text-slate-500'>
                      {t('productpageid.guarantproduct')}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value='additional' className='pt-6'>
              <div className='prose max-w-none'>
                <h3 className='mb-4'>{t('productpageid.productdetail')}</h3>
                <ul>
                  <li
                    className={`flex gap-1 ${
                      language === 'AR' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <strong>{t('productpageid.material')}</strong>
                    {getText(product?.material)}
                  </li>
                  <li
                    className={`flex gap-1 ${
                      language === 'AR' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <strong>{t('productpageid.care')}</strong>
                    {getText(product?.careInstructions)}
                  </li>
                  <li
                    className={`flex gap-1 ${
                      language === 'AR' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <strong>{t('productpageid.chest')}</strong>
                    {product?.chest}
                  </li>
                  <li
                    className={`flex gap-1 ${
                      language === 'AR' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <strong>{t('productpageid.waist')}</strong>
                    {product?.waist}
                  </li>
                  <li
                    className={`flex gap-1 ${
                      language === 'AR' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <strong>{t('productpageid.length')}</strong>
                    {product?.length}
                  </li>
                  <li
                    className={`flex gap-1 ${
                      language === 'AR' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <strong>{t('productpageid.height')}</strong>
                    {product?.high}
                  </li>
                  <li
                    className={`flex gap-1 ${
                      language === 'AR' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <strong>{t('productpageid.hip')}</strong>
                    {product?.hip}
                  </li>
                </ul>

                {/* <h3>Size & Fit</h3>
                <p>The model is 5'9" and wears size S.</p>
                <ul>
                  <li>Regular fit</li>
                  <li>True to size</li>
                  <li>Designed for a comfortable wear</li>
                </ul>

                <h3>Care Instructions</h3>
                <ul>
                  <li>Machine wash cold</li>
                  <li>Do not bleach</li>
                  <li>Tumble dry low</li>
                  <li>Iron on low heat if needed</li>
                </ul> */}
              </div>
            </TabsContent>

            {/* <TabsContent value="warranty" className="pt-6">
              <div className="prose max-w-none">
                <h3>Shipping Information</h3>
                <p>
                  We offer free standard shipping on all orders over $100. For orders under $100, standard shipping is
                  $5.99.
                </p>
                <ul>
                  <li>Standard Shipping: 3-5 business days</li>
                  <li>Express Shipping: 1-2 business days ($12.99)</li>
                  <li>Next Day Shipping: Next business day ($19.99)</li>
                </ul>

                <h3>Return Policy</h3>
                <p>
                  We accept returns within 30 days of purchase. Items must be unworn, unwashed, and with all original
                  tags attached.
                </p>
                <p>For rental items, returns must be made within 3 days of the rental period ending.</p>

                <h3>Warranty</h3>
                <p>
                  All new items come with a 90-day warranty against manufacturing defects. Used and rental items are
                  covered for 30 days.
                </p>
              </div>
            </TabsContent> */}
          </Tabs>
        </div>

        {/* You May Also Like */}
        {/* <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((product, index) => (
              <Link href={`/products/${product.id}`} key={index} className="group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={getText(product.name)}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {product.type && (
                    <Badge
                      className={`
                      absolute top-2 left-2 z-10
                      ${product.type === "New" ? "bg-green-500" : ""}
                      ${product.type === "Used" ? "bg-amber-500" : ""}
                      ${product.type === "Rental" ? "bg-purple-500" : ""}
                    `}
                    >
                      {product.type}
                    </Badge>
                  )}
                  {product.discount && (
                    <Badge className="absolute top-2 right-2 z-10 bg-red-500">{product.discount}</Badge>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="font-medium group-hover:text-gold transition-colors">{product.name}</h3>
                  <p className="text-sm text-slate-500">{product.vendor.name}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="font-bold">${product.price}</p>
                    {product.originalPrice && (
                      <p className="text-sm text-slate-500 line-through">${product.originalPrice}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div> */}

        {/* Recently Viewed Products */}
        {/* <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Recently Viewed Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentlyViewed.map((product, index) => (
              <Link href={`/products/${product.id}`} key={index} className="group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={getText(product.name)}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {product.discount && (
                    <Badge className="absolute top-2 right-2 z-10 bg-red-500">{product.discount}</Badge>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="font-medium group-hover:text-gold transition-colors">{product.name}</h3>
                  <p className="text-sm text-slate-500">{product.vendor.name}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="font-bold">${product.price}</p>
                    {product.originalPrice && (
                      <p className="text-sm text-slate-500 line-through">${product.originalPrice}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div> */}
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div
          className='fixed inset-0 z-50 bg-black/90 flex items-center justify-center'
          onClick={closeModal}
        >
          <div
            className='relative w-full h-full flex items-center justify-center'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className='absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white'
              onClick={closeModal}
              aria-label='Close modal'
            >
              <X className='h-6 w-6' />
            </button>

            {/* Image */}
            <div className='relative w-full h-full max-w-4xl max-h-[80vh] mx-auto'>
              <Image
                src={
                  config.API_URL + product.pictures[currentModalImage].path ||
                  '/placeholder.svg'
                }
                alt={`${product.name} - image ${currentModalImage + 1} of ${
                  product.pictures.length
                }`}
                fill
                className='object-contain'
                sizes='100vw'
                priority
              />
            </div>

            {/* Navigation buttons */}
            <button
              className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white'
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label='Previous image'
            >
              <ChevronLeft className='h-6 w-6' />
            </button>

            <button
              className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white'
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label='Next image'
            >
              <ChevronRight className='h-6 w-6' />
            </button>

            {/* Image counter */}
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm'>
              {currentModalImage + 1} / {product.pictures.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ProductSkeleton = () => {
  return (
    <section className='lg:py-20 lg:px-20'>
      <div className='animate-pulse flex flex-col md:flex-row gap-6 container mx-auto px-4'>
        {/* Left Side - Thumbnail Gallery */}
        <div className='flex flex-col gap-2 w-full md:w-[120px]'>
          {/* Thumbnail 1 */}
          <div className='w-full h-[100px] bg-gray-200 rounded-md border border-gray-300' />
          {/* Thumbnail 2 */}
          <div className='w-full h-[100px] bg-gray-200 rounded-md border border-gray-300' />
          {/* Thumbnail 3 (with label) */}
          <div className='w-full h-[100px] bg-gray-200 rounded-md border border-gray-300 relative'>
            <div className='absolute top-1 left-1 text-xs bg-orange-400 text-white px-2 py-1 rounded'>
              Used
            </div>
          </div>
        </div>

        {/* Main Product Image */}
        <div className='w-full md:w-[500px] h-[600px] bg-gray-200 rounded-lg' />

        {/* Right Side - Product Details */}
        <div className='flex-1 space-y-4'>
          {/* Title */}
          <div className='h-8 w-3/4 bg-gray-300 rounded' />
          {/* Code / SKU */}
          <div className='h-6 w-1/3 bg-gray-200 rounded' />
          {/* Description */}
          <div className='h-4 w-1/2 bg-gray-200 rounded' />
          {/* Color Label + Circle */}
          <div className='space-y-2'>
            <div className='h-4 w-20 bg-gray-200 rounded' />
            <div className='w-8 h-8 rounded-full bg-gray-300' />
          </div>
          {/* Size Label + Button */}
          <div className='space-y-2'>
            <div className='h-4 w-16 bg-gray-200 rounded' />
            <div className='w-12 h-10 bg-gray-300 rounded-md flex items-center justify-center'>
              <div className='h-4 w-6 bg-gray-400 rounded' />
            </div>
            <div className='text-xs text-gray-400 h-4 w-20 bg-gray-200 rounded' />
          </div>
          {/* Quantity + Contact Seller */}
          <div className='flex items-center gap-4 mt-4'>
            <div className='flex items-center gap-2 bg-gray-200 rounded-md px-2 py-1'>
              <div className='w-6 h-6 bg-gray-300 rounded' />
              <div className='w-8 h-4 bg-gray-300 rounded' />
              <div className='w-6 h-6 bg-gray-300 rounded' />
            </div>
            <div className='h-12 w-full bg-gray-300 rounded' />
            <div className='w-8 h-8 bg-gray-300 rounded-full' />
          </div>
          {/* REF & Categories */}
          <div className='space-y-2 mt-6'>
            <div className='h-4 w-16 bg-gray-200 rounded' />
            <div className='h-4 w-24 bg-gray-200 rounded' />
          </div>
          {/* Share Icons */}
          <div className='flex items-center gap-3 mt-6 pt-4 border-t border-gray-200'>
            <div className='h-6 w-6 bg-gray-300 rounded-full' />
            <div className='h-6 w-6 bg-gray-300 rounded-full' />
            <div className='h-6 w-6 bg-gray-300 rounded-full' />
            <div className='h-6 w-6 bg-gray-300 rounded-full' />
          </div>
        </div>
      </div>
    </section>
  );
};
