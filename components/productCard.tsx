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
import { Product } from '@/types/product';
import { capitalizeFirstLetter } from '@/lib/utils';
import { arColors, enColors } from '@/constants/colors';

interface SizeOption {
  label: string;
  value: string;
}

interface SelectedOption {
  productId: string;
  color: string;
  size: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { t, language } = useTranslation();
  const { addToCart, cart } = useCart();
  const { selectedCurrency } = useCurrency();
  const { user } = useAuth();

  const [selectedOptions, setSelectedOptions] = useState<SelectedOption>({
    productId: product.id,
    color: product.color[0],
    size: product.size[0].value,
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

  const isRentalProduct =
    product.type === 'rental' || product.type === 'الإيجار';
  const cartItem = cart.find((item) => item.id === product.id);
  const colorOptions = language === 'AR' ? arColors : enColors;

  const matchedColors = colorOptions.filter((color) =>
    product.color.some(
      (c: string) => c.toLowerCase() === color.value.toLowerCase()
    )
  );

  return (
    <div className='group relative'>
      <div className='relative overflow-hidden rounded-lg'>
        {/* Product Type Badge */}
        {product.type && (
          <div className='absolute top-4 left-2 z-10'>
            <Badge
              className={`rounded-md ${getProductTypeBadgeColor(product.type)}`}
            >
              {capitalizeFirstLetter(product.type)}
            </Badge>
          </div>
        )}

        {/* Wishlist Button */}
        {/* <div className='absolute top-2 right-2 z-20'>
          <div className='h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center'>
            <span className='sr-only'>{t('product.addToWishlist')}</span>
          </div>
        </div> */}

        {/* Product Image */}
        <Link href={`/products/${product.id}`} className='block'>
          <div className='aspect-[3/4] relative overflow-hidden rounded-lg'>
            <Image
              src={
                `${config.API_URL}${product.pictures[0]?.path}` ||
                '/placeholder.svg'
              }
              alt={product.name}
              fill
              className='object-cover transition-transform group-hover:scale-105'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </div>
        </Link>
      </div>

      {/* Product Details */}
      <Link href={`/products/${product.id}`} className='block'>
        <div className='mt-3 space-y-1'>
          <h3
            className='font-medium group-hover:text-gold transition-colors truncate'
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Price */}
          <div className='flex justify-between items-center'>
            <p className='font-bold'>
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

      {/* Color Options */}
      <div className='mt-2'>
        <div className='flex gap-2 mt-1'>
          {matchedColors.map((color) => (
            <label
              key={color.value}
              style={{ backgroundColor: color.hex }}
              className={`cursor-pointer h-6 w-6 rounded-full border-2 flex items-center justify-center
                ${
                  selectedOptions?.color.toLowerCase() ===
                  color.value.toLowerCase()
                    ? 'border-gold-dark border-3'
                    : 'border-gray-400'
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
                color.value.toLowerCase() && <Check color='#fff' size={12} />}
            </label>
          ))}
        </div>
      </div>

      {/* Size Options */}
      <div className='mt-2'>
        <div className='flex gap-2 mt-1 flex-wrap'>
          {product.size.map(({ label, value }: SizeOption) => (
            <label
              key={value}
              className={`cursor-pointer px-2 py-1 rounded border text-sm font-medium transition-colors
                ${
                  selectedOptions?.size === value
                    ? 'bg-black text-white'
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
        </div>
      </div>

      {/* Action Button */}
      <ProductActionButton
        user={user}
        product={{
          ...product,
          selectedSize: selectedOptions?.size,
          selectedColor: selectedOptions?.color,
        }}
        cartItem={cartItem}
        addToCart={addToCart}
      />
    </div>
  );
}
