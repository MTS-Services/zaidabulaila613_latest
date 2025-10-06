'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Check, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';

import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from '@/hooks/use-translation';
import { useCurrency } from '@/contexts/currency-context';
import { config } from '@/constants/app';
import ProductActionButton from './productActionButton';
import { Product, LanguageField } from '@/types/product';
import { capitalizeFirstLetter } from '@/lib/utils';
import { arColors, enColors } from '@/constants/colors';

interface SizeOption {
  label: string;
  value: string;
}

interface SelectedOption {
  productId: string;
  color: string;
  size?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { t, language } = useTranslation();
  const { addToCart, cart } = useCart();
  const { selectedCurrency } = useCurrency();
  const { user } = useAuth();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<any | null>(null);
  const [selectedColor, setSelectedColor] = useState<any | null>(null);

  // Helper function to extract language-specific text
  const getLocalizedText = (field: string | LanguageField): string => {
    if (typeof field === 'string') return field;
    return language === 'AR' ? field.ar : field.en;
  };

  // Helper function to get first color
  const getFirstColor = (): string => {
    if (Array.isArray(product.color) && product.color.length > 0) {
      const firstColor = product.color[0];
      return typeof firstColor === 'string'
        ? firstColor
        : getLocalizedText(firstColor);
    }
    return '';
  };

  // Initialize selections like in product page
  useState(() => {
    const firstColor = getFirstColor();
    setSelectedColor(firstColor);

    // Find available sizes for first color
    const getAvailableSizesForColor = (colorName: string) => {
      const colorObj = product.availableColors?.find((color: any) => {
        if (!color.color) return false;
        const colorValue = language === 'AR' ? color.color.ar : color.color.en;
        return colorValue?.toLowerCase() === colorName.toLowerCase();
      });
      return colorObj?.sizes || [];
    };

    const availableSizes = getAvailableSizesForColor(firstColor);
    setSelectedSize(availableSizes[0] || null);
  });

  const [selectedOptions, setSelectedOptions] = useState<SelectedOption>({
    productId: product.id,
    color: getFirstColor(),
    size: product.size?.[0]?.value,
  });

  // Get available sizes for selected color (like in product page)
  const getAvailableSizesForColor = (colorName: string) => {
    const colorObj = product.availableColors?.find((color: any) => {
      if (!color.color) return false;
      const colorValue = language === 'AR' ? color.color.ar : color.color.en;
      return colorValue?.toLowerCase() === colorName.toLowerCase();
    });
    return colorObj?.sizes || [];
  };

  // Handle color selection (like in product page)
  const handleColorChange = (colorValue: string) => {
    setSelectedColor(colorValue);
    setSelectedOptions((prev) => ({ ...prev, color: colorValue }));

    // Get available sizes for this color
    const availableSizes = getAvailableSizesForColor(colorValue);

    // If current selected size is not available in this color, select the first available size
    const isCurrentSizeAvailable = availableSizes.some(
      (size: any) => size._id === selectedSize?._id
    );

    if (!isCurrentSizeAvailable && availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
      setSelectedOptions((prev) => ({
        ...prev,
        size: availableSizes[0]?.value,
      }));
      setSelectedQuantity(1);
    } else if (availableSizes.length === 0) {
      setSelectedSize(null);
      setSelectedOptions((prev) => ({ ...prev, size: undefined }));
      setSelectedQuantity(1);
    }
  };

  // Handle size selection (like in product page)
  const handleSizeChange = (size: any) => {
    setSelectedSize(size);
    setSelectedOptions((prev) => ({ ...prev, size: size?.value }));
    setSelectedQuantity(Math.min(selectedQuantity, size?.quantity || 1));
  };

  const handleOptionChange = (key: 'color' | 'size', value: string) => {
    if (key === 'color') {
      handleColorChange(value);
    } else {
      const sizeObj = product.size?.find((s: any) => s.value === value);
      handleSizeChange(sizeObj);
    }
  };

  // Quantity controls
  const incrementQuantity = () => {
    const maxQty = selectedSize?.quantity || product.qty || 1;
    setSelectedQuantity((prev) => Math.min(prev + 1, maxQty));
  };

  const decrementQuantity = () => {
    setSelectedQuantity((prev) => Math.max(prev - 1, 1));
  };

  const getProductTypeBadgeColor = (type: string) => {
    const typeMap: Record<string, string> = {
      new: 'bg-green-500',
      جديد: 'bg-green-500',
      used: 'bg-amber-500',
      مستعمل: 'bg-amber-500',
      rental: 'bg-purple-500',
      الإيجار: 'bg-purple-500',
    };

    return typeMap[type] || 'bg-gray-500';
  };

  const productType = getLocalizedText(product.type);
  const productName = getLocalizedText(product.name);
  const isRentalProduct = productType === 'rental' || productType === 'الإيجار';
  const cartItem = cart.find((item) => item.id === product.id);
  const colorOptions = language === 'AR' ? arColors : enColors;

  const matchedColors = colorOptions.filter((color) => {
    if (!Array.isArray(product.color)) return false;
    return product.color.some((c) => {
      const colorStr = typeof c === 'string' ? c : getLocalizedText(c);
      return colorStr.toLowerCase() === color.value.toLowerCase();
    });
  });

  return (
    <div className='product-card-container group relative h-full flex flex-col bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200'>
      {/* Image Section with Fixed Aspect Ratio */}
      <div className='relative overflow-hidden rounded-t-lg flex-shrink-0'>
        {/* Product Type Badge */}
        {productType && (
          <div className='absolute top-4 left-2 z-10'>
            <Badge
              className={`rounded-md ${getProductTypeBadgeColor(productType)}`}
            >
              {capitalizeFirstLetter(productType)}
            </Badge>
          </div>
        )}

        {/* Product Image */}
        <Link href={`/products/${product.id}`} className='block'>
          <div className='aspect-[3/4] relative overflow-hidden'>
            <Image
              src={
                config.API_URL && product.pictures[0]?.path
                  ? `${config.API_URL}${product.pictures[0].path}`
                  : '/placeholder.svg'
              }
              alt={productName}
              fill
              className='object-cover transition-transform group-hover:scale-105'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </div>
        </Link>
      </div>

      {/* Content Section - Grows to fill remaining space */}
      <div className='flex flex-col flex-grow p-3'>
        {/* Product Details */}
        <Link href={`/products/${product.id}`} className='block flex-grow'>
          <div className='space-y-2 mb-3'>
            <h3
              className='font-medium group-hover:text-gold transition-colors line-clamp-2 min-h-[2.5rem]'
              title={productName}
            >
              {productName}
            </h3>

            {/* Price */}
            <div className='flex justify-between items-center'>
              <p className='font-bold text-lg'>
                {selectedCurrency.symbol}{' '}
                {isRentalProduct
                  ? `${product.price} / ${t('createProduct.perDay')}`
                  : product.price}
              </p>
              {product.oldPrice && (
                <p className='text-sm text-slate-500 line-through'>
                  {selectedCurrency.symbol} {product.oldPrice}
                </p>
              )}
            </div>

            {/* Sales Info */}
            <p className='text-xs text-slate-500'>10+ {t('product.sold')}</p>
          </div>
        </Link>

        {/* Options Section - Consistent Height Container */}
        <div className='space-y-3 mb-4 min-h-[4rem] flex flex-col justify-start'>
          {/* Color Options */}
          {matchedColors.length > 0 && (
            <div className='flex-shrink-0'>
              <div className='flex gap-2 flex-wrap'>
                {matchedColors.slice(0, 6).map((color) => (
                  <label
                    key={color.value}
                    style={{ backgroundColor: color.hex }}
                    className={`cursor-pointer h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200
                      ${
                        selectedOptions?.color.toLowerCase() ===
                        color.value.toLowerCase()
                          ? 'border-gold-dark border-3 scale-110'
                          : 'border-gray-400 hover:border-gray-600'
                      }`}
                  >
                    <input
                      type='radio'
                      name={`color-${product.id}`}
                      value={color.value.toLowerCase()}
                      checked={
                        selectedColor?.toLowerCase() ===
                        color.value.toLowerCase()
                      }
                      onChange={() =>
                        handleColorChange(color.value.toLowerCase())
                      }
                      className='hidden'
                    />
                    {selectedColor?.toLowerCase() ===
                      color.value.toLowerCase() && (
                      <Check color='#fff' size={12} />
                    )}
                  </label>
                ))}
                {matchedColors.length > 6 && (
                  <span className='text-xs text-gray-500 self-center'>
                    +{matchedColors.length - 6}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Size Options */}
          {product.size && product.size.length > 0 && (
            <div className='flex-shrink-0'>
              <div className='flex gap-2 flex-wrap'>
                {product.size
                  .slice(0, 4)
                  .map(({ label, value }: SizeOption) => (
                    <label
                      key={value}
                      className={`cursor-pointer px-2 py-1 rounded border text-xs font-medium transition-colors flex-shrink-0
                      ${
                        selectedSize?.value === value
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-gray-400 hover:border-black'
                      }`}
                    >
                      <input
                        type='radio'
                        name={`size-${product.id}`}
                        value={value}
                        checked={selectedSize?.value === value}
                        onChange={() => {
                          const sizeObj = product.size?.find(
                            (s: any) => s.value === value
                          );
                          handleSizeChange(sizeObj);
                        }}
                        className='hidden'
                      />
                      {label}
                    </label>
                  ))}
                {product.size.length > 4 && (
                  <span className='text-xs text-gray-500 self-center'>
                    +{product.size.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quantity Selector */}
        <div className='mb-3'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium text-gray-700'>Qty:</span>
            <div className='flex items-center border rounded-md bg-white'>
              <button
                className='px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50'
                onClick={decrementQuantity}
                disabled={selectedQuantity <= 1}
                type='button'
              >
                -
              </button>
              <div className='px-3 py-1 text-sm font-medium min-w-[2rem] text-center'>
                {selectedQuantity}
              </div>
              <button
                className='px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50'
                onClick={incrementQuantity}
                disabled={
                  selectedQuantity >=
                  (selectedSize?.quantity || product.qty || 1)
                }
                type='button'
              >
                +
              </button>
            </div>
            <span className='text-xs text-gray-500'>
              Max: {selectedSize?.quantity || product.qty || 1}
            </span>
          </div>
        </div>

        {/* Button Section - Always at Bottom */}
        <div className='mt-auto'>
          <ProductActionButton
            user={user}
            product={{
              ...product,
              quantity: selectedQuantity,
              selectedSize: selectedSize?.value || selectedOptions?.size,
              selectedColor: selectedColor || selectedOptions?.color,
              currentCurrency: selectedCurrency?.code, // Pass current currency
              selectedSizeQuantity: selectedSize?.quantity || 1, // Pass selected size stock
            }}
            cartItem={cartItem}
            addToCart={addToCart}
            className='mt-3'
          />
        </div>
      </div>
    </div>
  );
}
