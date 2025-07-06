'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ProductCategory } from '@/types/category';
import { GET_CATEGORIES } from '@/graphql/query';

interface CategoryContextProps {
  categories: ProductCategory[];
  setCategories: (categories: ProductCategory[]) => void;
  loading: boolean;
  getName: (id: string, lang: 'en' | 'ar') => string;
}

const CategoryContext = createContext<CategoryContextProps | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategoriesState] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

//   const { data } = useQuery<{ categories: ProductCategory[] }>(GET_CATEGORIES);

  // Load from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem('categories');
    if (stored) {
      setCategoriesState(JSON.parse(stored));
      setLoading(false);
    }
  }, []);

//   // Save from GraphQL to state + localStorage
//   useEffect(() => {
//     if (data?.categories) {
//       setCategories(data.categories); // custom function that updates state + storage
//       setLoading(false);
//     }
//   }, [data]);

  const setCategories = (categories: ProductCategory[]) => {
    setCategoriesState(categories);
    localStorage.setItem('categories', JSON.stringify(categories));
  };

  const getName = (id: string, lang: 'en' | 'ar') => {
    const found = categories.find((c) => c.id === id);
    return found?.name?.[lang] || '';
  };

  return (
    <CategoryContext.Provider value={{ categories, setCategories, loading, getName }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = (): CategoryContextProps => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};
