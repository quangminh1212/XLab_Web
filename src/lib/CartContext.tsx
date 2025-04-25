'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

// Định nghĩa interface cho CartItem
export interface CartItem {
  id: string;
  name: string;
  version?: string;
  price: number;
  quantity: number;
  image: string;
}

// Định nghĩa interface cho CartContext
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartItem) => Promise<void>;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}

// Tạo context với giá trị mặc định
const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: async () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  isLoading: false,
  subtotal: 0,
  tax: 0,
  total: 0,
  itemCount: 0,
});

// Hook để sử dụng CartContext
export const useCart = () => useContext(CartContext);

// Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  // State để lưu trữ các mục trong giỏ hàng
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm lưu giỏ hàng vào localStorage
  const saveCartToLocalStorage = useCallback((items: CartItem[]) => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Lỗi khi lưu giỏ hàng vào localStorage:', error);
    }
  }, []);

  // Tính toán giá trị giỏ hàng
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = useCallback(async (product: CartItem) => {
    if (!product.id) return;
    
    setIsLoading(true);
    
    try {
      setCartItems(prevItems => {
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
        let updatedItems: CartItem[];
        
        if (existingItemIndex !== -1) {
          // Nếu sản phẩm đã tồn tại, cập nhật số lượng
          updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + product.quantity
          };
        } else {
          // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
          updatedItems = [...prevItems, product];
        }
        
        // Lưu vào localStorage
        saveCartToLocalStorage(updatedItems);
        
        return updatedItems;
      });
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
    } finally {
      setIsLoading(false);
    }
  }, [saveCartToLocalStorage]);

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = useCallback((id: string) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== id);
      saveCartToLocalStorage(updatedItems);
      return updatedItems;
    });
  }, [saveCartToLocalStorage]);

  // Hàm cập nhật số lượng sản phẩm trong giỏ hàng
  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      
      saveCartToLocalStorage(updatedItems);
      return updatedItems;
    });
  }, [saveCartToLocalStorage]);

  // Hàm xóa toàn bộ giỏ hàng
  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cart');
  }, []);

  // Load giỏ hàng từ localStorage khi component được mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Lỗi khi tải giỏ hàng từ localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCart();
  }, []);

  // Giá trị context
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isLoading,
    subtotal,
    tax,
    total,
    itemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 