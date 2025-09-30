'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  Heart,
  ShoppingBag,
  CreditCard,
  Truck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';
import { config } from '@/constants/app';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } =
    useCart();
  const { addToWishlist } = useWishlist();
  const [promoCode, setPromoCode] = useState('');

  const router = useRouter();

  // Calculate subtotal
  const subtotal = cartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Handle move to wishlist
  const handleMoveToWishlist = (item: any) => {
    addToWishlist(item);
    removeFromCart(item.id);
  };

  // Handle quantity change
  const handleQuantityChange = (id: any, newQuantity: any) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };
  const { t } = useTranslation();

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='container px-4 md:px-6 py-8 md:py-12'>
        <div className='flex items-center justify-between mb-8'>
          <h1 className='text-2xl md:text-3xl font-bold'>
            {t('cartpage.title')}
          </h1>
          <Link
            href='/'
            className='flex items-center text-sm text-slate-600 hover:text-slate-900'
          >
            <ChevronLeft className='h-4 w-4 mr-1' />
            {t('cartpage.continue')}
          </Link>
        </div>

        {cart.length > 0 ? (
          <div className='grid md:grid-cols-3 gap-8'>
            {/* Cart Items */}
            <div className='md:col-span-2 space-y-4'>
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  className='bg-white rounded-lg shadow-sm p-4 md:p-6'
                >
                  <div className='flex gap-4'>
                    <div className='relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md'>
                      <Image
                        src={
                          (item.images?.[0] && item.images[0].startsWith('http') 
                            ? item.images[0]
                            : item.images?.[0] 
                            ? `${config.API_URL}${item.images[0]}`
                            : '/placeholder.svg?height=96&width=96')
                        }
                        alt={item.name}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='flex-1'>
                      <div className='flex flex-col sm:flex-row sm:justify-between'>
                        <div className='text-left'>
                          <h3 className='font-medium'>
                            <Link
                              href={`/products/${item.id}`}
                              className='hover:text-rose-500'
                            >
                              {item.name}
                            </Link>
                          </h3>
                          {/* <p className="text-sm text-slate-500">
                            {item.vendor.name} • {item.type}
                          </p> */}
                          <div className='flex items-center gap-2 mt-1 text-sm'>
                            <div className='flex items-center gap-1'>
                              <span>{t('cartpage.size')}:</span>
                              <span className='font-medium uppercase'>
                                {item.selectedSize}
                              </span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <span>{t('cartpage.color')}:</span>
                              <span className='font-medium capitalize'>
                                {item.selectedColor}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='text-right mt-1 sm:mt-0'>
                          <div className='font-bold'>${item.price}</div>
                          {item.originalPrice && (
                            <div className='text-sm text-slate-500 line-through'>
                              ${item.originalPrice.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='flex flex-wrap items-center justify-between mt-4 gap-3'>
                        <div className='flex items-center border rounded-md'>
                          <button
                            className='px-3 py-1 text-slate-500 hover:text-slate-900'
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                          >
                            -
                          </button>
                          <div className='w-8 text-center'>{item.quantity}</div>
                          <button
                            className='px-3 py-1 text-slate-500 hover:text-slate-900'
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <div className='flex items-center gap-2'>
                          <button
                            className='wishlist-save-button'
                            onClick={() => handleMoveToWishlist(item)}
                            aria-label='Save to wishlist'
                          >
                            <span className='wishlist-save-button-content'>
                              <Heart className='h-4 w-4' />
                              <span className='wishlist-save-button-text'>
                                {t('cartpage.save')}
                              </span>
                            </span>
                            <span className='wishlist-save-button-icon'>
                              <Heart className='h-4 w-4 fill-white' />
                            </span>
                          </button>

                          {/* Custom Delete Button */}
                          <button
                            className='delete-button noselect'
                            onClick={() => removeFromCart(item.id)}
                          >
                            <span className='text'>{t('cartpage.remove')}</span>
                            <span className='icon'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 24 24'
                              >
                                <path d='M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z' />
                              </svg>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className='flex justify-between items-center pt-4'>
                <Button variant='outline' size='sm' onClick={clearCart}>
                  {t('cartpage.clearcart')}
                </Button>
                <div className='text-sm text-slate-500'>
                  {cart.length}{' '}
                  {cart.length === 1 ? t('cartpage.item') : t('cartpage.items')}{' '}
                  {t('cartpage.incart')}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <h2 className='text-lg font-bold mb-4'>
                {t('cartpage.ordersummary')}
              </h2>

              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-slate-600'>
                    {t('cartpage.subtotal')}
                  </span>
                  <span className='font-medium'>${subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-slate-600'>
                    {t('cartpage.shipping')}
                  </span>
                  <span className='font-medium'>
                    {shipping === 0
                      ? t('cartpage.freeshipping')
                      : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-slate-600'>{t('cartpage.tax')}</span>
                  <span className='font-medium'>${tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className='flex justify-between font-bold'>
                  <span>{t('cartpage.total')}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className='mt-6 space-y-4'>
                <div className='flex flex-col sm:flex-row gap-2'>
                  <Input
                    placeholder={t('cartpage.promo')}
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className='flex-1'
                  />
                  <Button variant='outline' className='sm:w-auto w-full'>
                    {t('cartpage.apply')}
                  </Button>
                </div>

                <Button
                  className='w-full bg-gold hover:bg-gold/90 text-white'
                  onClick={() => router.push('/checkout')}
                >
                  <CreditCard className='h-4 w-4 mr-2' />
                  {t('cartpage.checkout')}
                </Button>

                <div className='text-sm text-slate-500 text-center'>
                  {t('cartpage.secure')}
                </div>
              </div>

              <div className='mt-6 space-y-3'>
                <div className='flex items-center gap-2 text-sm text-slate-600'>
                  <Truck className='h-4 w-4 text-slate-400' />
                  <span>{t('cartpage.free')}</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-slate-600'>
                  <ShoppingBag className='h-4 w-4 text-slate-400' />
                  <span>{t('cartpage.return')}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='bg-white rounded-lg shadow-sm p-8 text-center'>
            <div className='flex justify-center mb-4'>
              <ShoppingBag className='h-16 w-16 text-slate-300' />
            </div>
            <h2 className='text-xl font-bold mb-2'>{t('cartpage.empty')}</h2>
            <p className='text-slate-500 mb-6'>{t('cartpage.look')}</p>
            <Button asChild>
              <Link href='/'>{t('cartpage.startshopping')}</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
