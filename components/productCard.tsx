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

  const [selectedOptions, setSelectedOptions] = useState<SelectedOption>({
    productId: product.id,
    color: getFirstColor(),
    size: product.size?.[0]?.value,
  });

  const handleOptionChange = (key: 'color' | 'size', value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
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
                        selectedOptions?.color?.toLowerCase() ===
                        color.value.toLowerCase()
                      }
                      onChange={() =>
                        handleOptionChange('color', color.value.toLowerCase())
                      }
                      className='hidden'
                    />
                    {selectedOptions?.color.toLowerCase() ===
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
                        selectedOptions?.size === value
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-gray-400 hover:border-black'
                      }`}
                    >
                      <input
                        type='radio'
                        name={`size-${product.id}`}
                        value={value}
                        checked={selectedOptions?.size === value}
                        onChange={() => handleOptionChange('size', value)}
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

        {/* Button Section - Always at Bottom */}
        <div className='mt-auto'>
          <ProductActionButton
            user={user}
            product={{
              ...product,
              quantity: selectedQuantity,
              selectedSize: selectedOptions?.size,
              selectedColor: selectedOptions?.color,
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
