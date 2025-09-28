'use client';

import { config } from '@/constants/app';
import { carouselSettings } from '@/constants/vendors/vendor-section';
import { GET_SHOPS } from '@/graphql/query';
import { useTranslation } from '@/hooks/use-translation';
import { ShopItem, ShopsResponse } from '@/types/shop';
import { useQuery } from '@apollo/client';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { AnimatedButton } from './animated-button';
import Loader from './loader';

export default function VendorSelection() {
  const { language } = useTranslation();

  const { data, loading, error } = useQuery<ShopsResponse>(GET_SHOPS, {
    variables: {
      language: language, // or 'AR'
      search: '',
      page: 1,
      limit: 10,
    },
  });

  const vendors = data?.shops?.data || [];

  const [mobileViewportRef, mobileEmblaApi] = useEmblaCarousel({
    ...{
      ...carouselSettings.desktop,
      containScroll: carouselSettings.desktop.containScroll as 'trimSnaps',
    },
    align: 'start' as const,
  });
  const [mobileRow2Ref, mobileRow2Api] = useEmblaCarousel({
    ...carouselSettings.desktop,
    containScroll: carouselSettings.desktop.containScroll as 'trimSnaps',
    align: 'start' as const,
  });
  const [desktopRow1Ref, desktopRow1Api] = useEmblaCarousel({
    ...carouselSettings.desktop,
    containScroll: carouselSettings.desktop.containScroll as 'trimSnaps',
    align: 'start' as const,
  });

  // State for tracking current slide
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Handle desktop carousel selection
  const onSelect = useCallback(() => {
    if (!desktopRow1Api) return;
    // setSelectedIndex(desktopEmblaApi.selectedScrollSnap()) // Removed desktopEmblaApi
  }, [desktopRow1Api]); // Updated dependency

  // Initialize desktop carousel
  useEffect(() => {
    if (!desktopRow1Api) return;

    // setScrollSnaps(desktopEmblaApi.scrollSnapList()) // Removed desktopEmblaApi
    onSelect();

    // desktopEmblaApi.on("select", onSelect) // Removed desktopEmblaApi
    // desktopEmblaApi.on("reInit", onSelect) // Removed desktopEmblaApi

    return () => {
      // desktopEmblaApi.off("select", onSelect) // Removed desktopEmblaApi
    };
  }, [desktopRow1Api, onSelect]);

  // Scroll to specific slide
  const scrollTo = useCallback(
    (index: number) => desktopRow1Api && desktopRow1Api.scrollTo(index),
    [desktopRow1Api]
  ); // Updated desktopEmblaApi

  useEffect(() => {
    // Set up separate autoplay for each carousel with different timings
    let row1AutoplayInterval: NodeJS.Timeout;
    let mobileAutoplayInterval: NodeJS.Timeout;
    let mobileRow2AutoplayInterval: NodeJS.Timeout;

    const startMobileRow2Autoplay = () => {
      if (mobileRow2AutoplayInterval) clearInterval(mobileRow2AutoplayInterval);

      mobileRow2AutoplayInterval = setInterval(() => {
        if (mobileRow2Api) {
          mobileRow2Api.scrollNext();
        }
      }, carouselSettings.autoplay.mobile.secondRow.interval);
    };

    const startRow1Autoplay = () => {
      if (row1AutoplayInterval) clearInterval(row1AutoplayInterval);

      row1AutoplayInterval = setInterval(() => {
        if (desktopRow1Api) {
          desktopRow1Api.scrollNext();
        }
      }, carouselSettings.autoplay.desktop.interval);
    };

    const startMobileAutoplay = () => {
      if (mobileAutoplayInterval) clearInterval(mobileAutoplayInterval);

      mobileAutoplayInterval = setInterval(() => {
        if (mobileEmblaApi) {
          mobileEmblaApi.scrollNext();
        }
      }, carouselSettings.autoplay.mobile.firstRow.interval);
    };

    const stopAllAutoplay = () => {
      if (row1AutoplayInterval) clearInterval(row1AutoplayInterval);
      if (mobileAutoplayInterval) clearInterval(mobileAutoplayInterval);
      if (mobileRow2AutoplayInterval) clearInterval(mobileRow2AutoplayInterval);
    };

    // Start autoplay when components are mounted and APIs are available
    if (desktopRow1Api) startRow1Autoplay();
    if (mobileEmblaApi) startMobileAutoplay();
    if (mobileRow2Api) startMobileRow2Autoplay();

    // Pause autoplay on user interaction and restart after
    const handleRow1PointerDown = () => {
      if (row1AutoplayInterval) clearInterval(row1AutoplayInterval);
    };

    const handleRow1PointerUp = () => {
      startRow1Autoplay();
    };

    const handleMobilePointerDown = () => {
      if (mobileAutoplayInterval) clearInterval(mobileAutoplayInterval);
    };

    const handleMobilePointerUp = () => {
      startMobileAutoplay();
    };

    const handleMobileRow2PointerDown = () => {
      if (mobileRow2AutoplayInterval) clearInterval(mobileRow2AutoplayInterval);
    };

    const handleMobileRow2PointerUp = () => {
      startMobileRow2Autoplay();
    };

    if (desktopRow1Api) {
      desktopRow1Api.on('pointerDown', handleRow1PointerDown);
      desktopRow1Api.on('pointerUp', handleRow1PointerUp);
    }

    if (mobileEmblaApi) {
      mobileEmblaApi.on('pointerDown', handleMobilePointerDown);
      mobileEmblaApi.on('pointerUp', handleMobilePointerUp);
    }

    if (mobileRow2Api) {
      mobileRow2Api.on('pointerDown', handleMobileRow2PointerDown);
      mobileRow2Api.on('pointerUp', handleMobileRow2PointerUp);
    }

    // Clean up on unmount
    return () => {
      stopAllAutoplay();

      if (desktopRow1Api) {
        desktopRow1Api.off('pointerDown', handleRow1PointerDown);
        desktopRow1Api.off('pointerUp', handleRow1PointerUp);
      }

      if (mobileEmblaApi) {
        mobileEmblaApi.off('pointerDown', handleMobilePointerDown);
        mobileEmblaApi.off('pointerUp', handleMobilePointerUp);
      }

      if (mobileRow2Api) {
        mobileRow2Api.off('pointerDown', handleMobileRow2PointerDown);
        mobileRow2Api.off('pointerUp', handleMobileRow2PointerUp);
      }
    };
  }, [desktopRow1Api, mobileEmblaApi, mobileRow2Api]);

  const { t } = useTranslation();

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };
  return (
    <section className='py-12 md:py-8 bg-white'>
      <div className='container px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center mb-6'>
          {/* <div className='space-y-2'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-playfair'>
              {t('vendorSelection.title')}
            </h2>
            <p className='max-w-[700px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              {t('vendorSelection.description')}
            </p>
          </div> */}

          <div className='flex items-center justify-center antialias'>
            <h1
              className='text-center italic text-2xl font-bold uppercase tracking-wider md:text-5xl 
               text-black animate-bounce text-shadow-lg'
            >
              Vendors Coming
              <span className='text-[#CC9765] text-xl lg:text-4xl'>
                {' '}
                Soon...
              </span>
            </h1>
          </div>
        </div>

        {loading && <Loader />}

        {/* Desktop View - Single Row with Larger Cards */}
        {/* <div className="hidden lg:block mt-8">
          <div className="overflow-hidden" ref={desktopRow1Ref}>
            <div className="flex">
              {vendors.map((vendor, index) => (
                <div key={`desktop-${index}`} className="flex-[0_0_16.666%] min-w-0 px-2 max-w-[175px]">
                  <VendorCard vendor={vendor} />
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* Mobile View - Two Row Carousel (matching desktop layout) */}
        {/* <div className='lg:hidden mt-8'> */}
        {/* First Mobile Row */}
        {/* <div className='overflow-hidden mb-4' ref={mobileViewportRef}>
            <div className='flex'>
              {vendors.map((vendor, index) => (
                <div
                  key={`mobile-row1-${index}`}
                  className='flex-[0_0_42%] sm:flex-[0_0_25%] md:flex-[0_0_25%] min-w-0 px-2'
                >
                  <CompactVendorCard vendor={vendor} />
                </div>
              ))}
            </div>
          </div> */}

        {/* Second Mobile Row */}
        {/* <div className='overflow-hidden' ref={mobileRow2Ref}>
            <div className='flex'>
              {[...vendors.slice(4), ...vendors.slice(0, 4)].map(
                (vendor, index) => (
                  <div
                    key={`mobile-row2-${index}`}
                    className='flex-[0_0_42%] sm:flex-[0_0_25%] md:flex-[0_0_25%] min-w-0 px-2'
                  >
                    <CompactVendorCard vendor={vendor} />
                  </div>
                )
              )}
            </div>
          </div>
        </div> */}

        {/* <div className='flex justify-center mt-10'>
          <NeumorphicButton
            href={sectionContent.viewAllButton.href}
            text={t('vendorSelection.button')}
            className='uppercase w-[200px]'
          />
        </div> */}
      </div>
    </section>
  );
}

// Vendor Card Component
function VendorCard({ vendor }: { vendor: ShopItem }) {
  const handleNavigate = () => {
    window.location.href = `/vendors/${vendor.id}`;
  };

  return (
    <div
      className='block h-[280px] rounded-lg overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all group cursor-pointer'
      onClick={handleNavigate}
    >
      <div className='relative h-full'>
        {/* Background image instead of gradient */}
        <div className='absolute inset-0 w-full h-full'>
          <Image
            src={
              vendor.profileImage?.path
                ? config.API_URL + vendor.profileImage?.path
                : '/placeholder.svg?height=280&width=175'
            }
            alt={vendor.shopName}
            fill
            className='object-cover brightness-[0.85] group-hover:brightness-[0.75] transition-all'
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.src = '/placeholder.svg?height=280&width=175';
            }}
          />
          {/* Overlay gradient for better text visibility */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent'></div>
        </div>

        <div className='p-4 md:p-5 flex flex-col items-start text-left h-full relative z-10'>
          <div className='flex-1 flex flex-col justify-between h-full'>
            <div>
              <h3 className='font-medium text-base text-white group-hover:text-gold transition-colors'>
                {vendor.shopName}
              </h3>
              <div className='bg-gold/80 text-white text-xs font-medium px-2 py-0.5 rounded-lg mt-1 mb-2 inline-block'>
                40% OFF
              </div>
            </div>

            <div className='mt-auto'>
              <div className='text-xs text-white/90 line-clamp-3 mb-2'>
                {vendor.description}
              </div>
              <AnimatedButton
                text='View Collection'
                href={`/vendors/${vendor.id}`}
                size='sm'
                asDiv={true}
                onClick={() => {
                  window.location.href = `/vendors/${vendor.id}`;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact Vendor Card Component
function CompactVendorCard({ vendor }: { vendor: ShopItem }) {
  const handleNavigate = () => {
    window.location.href = `/vendors/${vendor.id}`;
  };

  return (
    <div
      className='block h-[240px] rounded-lg overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all group cursor-pointer'
      onClick={handleNavigate}
    >
      <div className='relative h-full'>
        {/* Background image instead of gradient */}
        <div className='absolute inset-0 w-full h-full'>
          <Image
            src={
              vendor.profileImage?.path
                ? config.API_URL + vendor.profileImage?.path
                : '/placeholder.svg?height=240&width=150'
            }
            alt={vendor.shopName}
            fill
            className='object-cover brightness-[0.85] group-hover:brightness-[0.75] transition-all'
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.src = '/placeholder.svg?height=240&width=150';
            }}
          />
          {/* Overlay gradient for better text visibility */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent'></div>
        </div>

        <div className='p-3 flex flex-col items-start text-left h-full relative z-10'>
          <h3 className='font-medium text-sm text-white group-hover:text-gold transition-colors'>
            {vendor.shopName}
          </h3>
          <div className='bg-gold/80 text-white text-[10px] font-medium px-2 py-0.5 rounded-lg mt-1 mb-1 inline-block'>
            40% OFF
          </div>
          <div className='text-[10px] text-white/90 line-clamp-3 mb-1'>
            {vendor.description}
          </div>
          <div className='mt-auto'>
            <AnimatedButton
              text='View Collection'
              href={`/vendors/${vendor.id}`}
              size='sm'
              className='h-[25px] max-w-[120px] w-full text-[9px] px-2'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
