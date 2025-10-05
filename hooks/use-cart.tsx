'use client';

import type React from 'react';

import { createContext, useContext, useState, useEffect } from 'react';
import { useCurrency } from '@/contexts/currency-context';
import { convertCurrency } from '@/lib/currency-converter';

type CartItem = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  originalCurrency?: string; // Store the currency this item was added in
  quantity: number;
  images?: string[];
  selectedSize?: string;
  selectedColor?: string;
  type?: string;
  vendor: {
    name: string;
    slug: string;
  };
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { selectedCurrency } = useCurrency();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      // Add current currency to the item and ensure we use the displayed price
      const itemWithCurrency = {
        ...item,
        originalCurrency:
          item.originalCurrency || selectedCurrency?.code || 'USD',
        // Ensure price is stored as displayed (no additional conversion)
        price: Number(item.price),
        originalPrice: item.originalPrice
          ? Number(item.originalPrice)
          : undefined,
      };

      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.selectedSize === item.selectedSize &&
          cartItem.selectedColor === item.selectedColor
      );

      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += item.quantity;
        return updatedCart;
      } else {
        // Add new item if it doesn't exist
        return [...prevCart, itemWithCurrency];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate cart total
  const cartTotal = () => {
    return cart.reduce((total, item) => {
      const itemPrice =
        item.originalCurrency &&
        item.originalCurrency !== selectedCurrency?.code
          ? convertCurrency(
              item.price,
              item.originalCurrency,
              selectedCurrency?.code || 'USD'
            )
          : item.price;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  // Calculate cart item count
  const cartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
