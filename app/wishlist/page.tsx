import CartPage from '@/interfaces/cart/cart';
import WishlistPage from '@/interfaces/whishlist/whishList';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// const CartPage = dynamic(() => import('@/interfaces/cart/cart'), { ssr: t });

export default function Page() {
  return (
    <Suspense fallback={<div>Loading cart...</div>}>
      <WishlistPage />
    </Suspense>
  );
}