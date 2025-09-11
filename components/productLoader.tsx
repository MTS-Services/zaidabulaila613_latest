'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProductLoaderProps {
  productsLength: number;
  redirectTo: string; // e.g., "/dashboard/products"
}

export default function ProductLoader({ productsLength, redirectTo }: ProductLoaderProps) {
  const router = useRouter();
  const secondsPerProduct = 10;
  const totalSeconds = productsLength * secondsPerProduct;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (productsLength === 0) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (100 / totalSeconds);
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 1000); // every second

    return () => clearInterval(interval);
  }, [productsLength]);

  // Redirect after progress reaches 100
  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        router.push(redirectTo);
      }, 1000); // 1s delay before redirect
    }
  }, [progress, router, redirectTo]);

  return (
    <div className="w-full max-w-xl mx-auto mt-10 px-4">
      <div className="mb-2 text-center font-semibold text-gray-700">
        Uploading Products... {Math.round(progress)}%
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-gold h-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
