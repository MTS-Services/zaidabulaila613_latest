'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Star, Percent } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import HeartButton from '@/components/heart-button';
import NeumorphicButton from '@/components/neumorphic-button';
import { featuredContent } from '@/constants/products/featured';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/graphql/query';
import { config } from '@/constants/app';
import { Checkbox } from './ui/checkbox';
import { RadioGroup } from './ui/radio-group';
import { useAuth } from '@/contexts/auth-context';
import ProductActionButton from './productActionButton';
import { useTranslation } from '@/hooks/use-translation';
import { useCurrency } from '@/contexts/currency-context';
import { ProductsResponse } from '@/types/product';
import { arProductTypes, enProductTypes } from '@/constants/product';
import ProductCard from './productCard';
import AnimatedLoader from './animated-loader';
import Loader from './loader';

interface SizeOption {
  label: string;
  value: string;
}

interface Product {
  id: number;
  name: string;
  colors: string[];
  sizes: SizeOption[];
}

interface SelectedOption {
  productId: number;
  color: string;
  size: string;
}

export default function FeaturedProducts() {
  const {
    // products: featuredProducts,
    discount,
    badgeColors,
  } = featuredContent;
  const { addToCart, cart } = useCart();
  const { language } = useTranslation();
  const { selectedCurrency } = useCurrency();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const { loading, error, data, refetch } = useQuery<ProductsResponse>(
    GET_PRODUCTS,
    {
      variables: {
        language: language,
        currency: selectedCurrency.code.toLowerCase(),
        page: 1,
        limit: 8,
        search: '',
        sortField: 'createdAt',
        sortOrder: 'desc',
      },
      fetchPolicy: 'network-only',
    }
  );
  const { user } = useAuth();
  // At the beginning of the component:
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeTag, setActiveTag] = useState('All');
  const [discountVisible, setDiscountVisible] = useState([
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ]);
  const [discountIntervals, setDiscountIntervals] = useState<NodeJS.Timeout[]>(
    []
  );
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  // const [products, setProducts] = useState(featuredProducts)

  const products = data?.products?.data || [];

  const handleChange = (
    productId: number,
    key: 'color' | 'size',
    value: string
  ) => {
    setSelectedOptions((prev: any) =>
      prev.map((option: any) =>
        option.productId === productId ? { ...option, [key]: value } : option
      )
    );
  };

  useEffect(() => {
    if (data) {
      const defaultSelections = data?.products?.data.map((product: any) => ({
        productId: product.id,
        color: product.color[0],
        size: product.size[0].value,
      }));
      setSelectedOptions(defaultSelections);
    }
  }, [data]);

  // Add this useEffect for mouse drag scrolling
  useEffect(() => {
    const slider = scrollContainerRef.current;
    if (!slider) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      slider.style.cursor = 'grabbing';
    };

    const handleMouseLeave = () => {
      isDown = false;
      slider.classList.remove('active');
      slider.style.cursor = 'grab';
    };

    const handleMouseUp = () => {
      isDown = false;
      slider.classList.remove('active');
      slider.style.cursor = 'grab';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5; // Scroll speed multiplier
      slider.scrollLeft = scrollLeft - walk;
    };

    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      isDown = true;
      slider.classList.add('active');
      startX = e.touches[0].pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener('mousedown', handleMouseDown);
    slider.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseup', handleMouseUp);
    slider.addEventListener('mousemove', handleMouseMove);

    // Add touch events
    slider.addEventListener('touchstart', handleTouchStart);
    slider.addEventListener('touchend', handleMouseUp);
    slider.addEventListener('touchcancel', handleMouseLeave);
    slider.addEventListener('touchmove', handleTouchMove);

    return () => {
      slider.removeEventListener('mousedown', handleMouseDown);
      slider.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseup', handleMouseUp);
      slider.removeEventListener('mousemove', handleMouseMove);

      slider.removeEventListener('touchstart', handleTouchStart);
      slider.removeEventListener('touchend', handleMouseUp);
      slider.removeEventListener('touchcancel', handleMouseLeave);
      slider.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);
  const filterTags =
    language === 'AR'
      ? ['الكل', ...arProductTypes]
      : ['All', ...enProductTypes];

  useEffect(() => {
    if (language === 'AR') {
      setActiveTag('الكل');
    }
  }, [language]);

  // Filter products based on active tag
  const filteredProducts =
    activeTag === 'All' || activeTag === 'الكل'
      ? products
      : products.filter(
          (product: any) => product.type === activeTag.toLowerCase()
        );

  // Get discount tag with animated text
  const getDiscountTag = (index: number, discount = '40% OFF') => {
    // Animation variants for text
    const textVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.3,
        },
      },
      exit: {
        opacity: 0,
        y: -10,
        transition: {
          duration: 0.2,
        },
      },
    };

    // Animation variants for individual characters
    const charVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * 0.05,
          duration: 0.3,
        },
      }),
    };

    // Split the discount text into individual characters for animation
    const discountChars = discount.split('');

    return (
      <div className='bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md flex items-center justify-center gap-1 overflow-hidden'>
        <Percent className='h-3 w-3' />
        <motion.div
          key={`discount-${index}`}
          initial='hidden'
          animate='visible'
          className='flex overflow-hidden'
        >
          {discountChars.map((char, i) => (
            <motion.span
              key={`char-${i}`}
              custom={i}
              variants={charVariants}
              initial='hidden'
              animate='visible'
              style={{
                display: 'inline-block',
                transformOrigin: 'bottom',
              }}
              className='inline-block'
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      </div>
    );
  };

  const getAnimatedDiscountTag = useCallback(
    (index: number, discount = '40% OFF') => {
      const isVisible = discountVisible[index];

      return (
        <div className='bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md flex items-center justify-center gap-1'>
          <Percent className='h-3 w-3' />
          <div className='w-[55px] h-[16px] flex items-center justify-center'>
            <AnimatePresence mode='wait'>
              {isVisible && (
                <motion.div
                  key={`text-${index}-${isVisible}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: 'spring',
                      stiffness: 300,
                      damping: 15,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                    transition: {
                      duration: 0.2,
                    },
                  }}
                >
                  {discount}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      );
    },
    [discountVisible]
  );

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    for (let index = 0; index < products.length; index++) {
      const intervalId = setInterval(() => {
        setDiscountVisible((prev) => {
          const newDiscountVisible = [...prev];
          newDiscountVisible[index] = false;
          return newDiscountVisible;
        });
        setTimeout(() => {
          setDiscountVisible((prev) => {
            const newDiscountVisible = [...prev];
            newDiscountVisible[index] = true;
            return newDiscountVisible;
          });
        }, 500); // Wait before showing again
      }, 3000); // Change every 3 seconds

      intervals.push(intervalId);
    }

    setDiscountIntervals(intervals);

    return () => {
      intervals.forEach(clearInterval);
    };
  }, []);

  const { t } = useTranslation();
  return (
    <section className='py-12 md:py-16'>
      <div className='container px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-playfair'>
              {t('shopByType.title')}
            </h2>
            <p className='max-w-[700px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              {t('shopByType.description')}
            </p>
          </div>
        </div>

        {/* Filter Tags */}
        <div className='mt-8 relative'>
          <div
            ref={scrollContainerRef}
            className='flex gap-5 overflow-x-auto scrollbar-hide pb-4 space-x-4 -mx-4 px-4 relative touch-pan-x cursor-grab'
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth',
            }}
          >
            {filterTags.map((tag) => (
              <Button
                key={tag}
                variant={activeTag === tag ? 'default' : 'outline'}
                className={`flex-shrink-0 rounded-md ${
                  activeTag === tag ? 'bg-gold hover:bg-gold/90' : ''
                } mx-0`}
                onClick={() => setActiveTag(tag)}
                style={{ marginLeft: 0 }}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mt-8'>
            {filteredProducts.map((product: any, index: number) => {
              return <ProductCard product={product} key={index} />;
            })}
          </div>
        )}

        <div className='flex justify-center mt-10'>
          <NeumorphicButton
            href={featuredContent.viewAllButton.href}
            text={t('shopByType.button')}
          />
        </div>
      </div>
    </section>
  );
}
