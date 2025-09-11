import CartPage from '@/interfaces/cart/cart';
import CategoryPage from '@/interfaces/category/category';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// const CartPage = dynamic(() => import('@/interfaces/cart/cart'), { ssr: t });

export default function Page() {
  return (
    <Suspense fallback={<div>Loading category...</div>}>
      <CategoryPage />
    </Suspense>
  );
}