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
  maxQuantity?: number; // Available stock for this item
  sizeQuantity?: number; // Available stock for selected size
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

  // Sanitize cart item to ensure correct structure
  const sanitizeCartItem = (item: any): CartItem => {
    return {
      id: item.id || item._id,
      name: item.name,
      price: Number(item.price) || 0,
      originalPrice: item.originalPrice
        ? Number(item.originalPrice)
        : undefined,
      originalCurrency: item.originalCurrency,
      quantity: Number(item.quantity) || 1,
      images: item.images || [],
      selectedSize:
        typeof item.selectedSize === 'string'
          ? item.selectedSize
          : item.selectedSize?.size || '',
      selectedColor:
        typeof item.selectedColor === 'string'
          ? item.selectedColor
          : item.selectedColor?.value || '',
      type: item.type,
      maxQuantity: Number(item.maxQuantity) || Number(item.qty) || 1,
      sizeQuantity:
        Number(item.sizeQuantity) ||
        Number(item.selectedSizeQuantity) ||
        Number(item.maxQuantity) ||
        Number(item.qty) ||
        1,
      vendor: item.vendor || { name: 'Unknown', slug: 'unknown' },
    };
  };

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Check if cart items have proper stock information
        const hasOldItems = parsedCart.some(
          (item: any) =>
            !item.sizeQuantity ||
            !item.maxQuantity ||
            item.sizeQuantity === 999 ||
            item.maxQuantity === 999
        );

        if (hasOldItems) {
          console.log('Clearing old cart items without proper stock info');
          localStorage.removeItem('cart');
          setCart([]);
          return;
        }

        // Sanitize all cart items to ensure correct structure
        const sanitizedCart = parsedCart.map(sanitizeCartItem);
        setCart(sanitizedCart);
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
        // Clear corrupted cart data
        localStorage.removeItem('cart');
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
      // Sanitize the item first to ensure correct structure
      const sanitizedItem = sanitizeCartItem(item);

      // Add current currency to the item and ensure we use the displayed price
      const itemWithCurrency = {
        ...sanitizedItem,
        originalCurrency:
          sanitizedItem.originalCurrency || selectedCurrency?.code || 'USD',
        // Ensure price is stored as displayed (no additional conversion)
        price: Number(sanitizedItem.price),
        originalPrice: sanitizedItem.originalPrice
          ? Number(sanitizedItem.originalPrice)
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

  // Update item quantity with stock validation
  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          // Get the maximum allowed quantity (prioritize size-specific quantity)
          const maxAllowed = item.sizeQuantity || item.maxQuantity || 999;
          // Ensure quantity is within valid range
          const validQuantity = Math.max(1, Math.min(quantity, maxAllowed));
          return { ...item, quantity: validQuantity };
        }
        return item;
      })
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
