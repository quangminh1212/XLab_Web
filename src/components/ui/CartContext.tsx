'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  CartItem, 
  getCartFromLocalStorage, 
  saveCartToLocalStorage, 
  addItemToCart as utilsAddItemToCart, 
  removeItemFromCart as utilsRemoveItemFromCart, 
  updateItemQuantity as utilsUpdateItemQuantity, 
  clearCart as utilsClearCart
} from '@/lib/utils';

interface CartContextType {
  cart: CartItem[];
  addItemToCart: (item: CartItem) => void;
  removeItemFromCart: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = getCartFromLocalStorage();
    setCart(savedCart);
    setInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (initialized) {
      saveCartToLocalStorage(cart);
    }
  }, [cart, initialized]);

  const addItemToCart = (item: CartItem) => {
    setCart((prevCart) => utilsAddItemToCart(prevCart, item));
  };

  const removeItemFromCart = (itemId: string) => {
    setCart((prevCart) => utilsRemoveItemFromCart(prevCart, itemId));
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setCart((prevCart) => utilsUpdateItemQuantity(prevCart, itemId, quantity));
  };

  const clearCart = () => {
    setCart(utilsClearCart());
  };

  // Calculate total number of items in cart
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cart,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    clearCart,
    itemCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 