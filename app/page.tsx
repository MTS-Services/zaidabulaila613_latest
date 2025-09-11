import CartPage from '@/interfaces/cart/cart';
import Home from '@/interfaces/home/page';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// const CartPage = dynamic(() => import('@/interfaces/cart/cart'), { ssr: t });

export default function Page() {
  return (
    <Suspense fallback={<div>Loading ...</div>}>
      <Home />
    </Suspense>
  );
}