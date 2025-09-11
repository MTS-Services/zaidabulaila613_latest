'use client';

import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

export default function NotFound() {
  const router = useRouter();

  return (
     <Suspense fallback={<div>Loading ...</div>}>

    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <button
        onClick={() => router.push('/')}
        className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
      >
        Go Home
      </button>
    </div>
    </Suspense>
  );
}