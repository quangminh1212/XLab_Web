import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

const CART_STORAGE_KEY = 'xlab_cart';

/**
 * Hook quản lý giỏ hàng, hỗ trợ cả chế độ offline và online
 * @returns {Object} Các hàm và state để quản lý giỏ hàng
 */
export function useCart() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  
  // Lấy giỏ hàng từ localStorage khi component mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCart();
  }, []);
  
  // Lấy giỏ hàng từ server khi người dùng đăng nhập
  useEffect(() => {
    const fetchUserCart = async () => {
      if (isLoggedIn) {
        setIsLoading(true);
        try {
          const response = await fetch('/api/cart');
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.cart) {
              setCart(data.cart);
              // Cập nhật localStorage
              localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data.cart));
            }
          }
        } catch (error) {
          console.error('Error fetching user cart:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    if (isLoggedIn) {
      fetchUserCart();
    }
  }, [isLoggedIn]);
  
  // Lưu giỏ hàng vào localStorage khi có thay đổi
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoading]);
  
  /**
   * Đồng bộ giỏ hàng local với server
   */
  const syncWithServer = useCallback(async () => {
    if (isLoggedIn && cart.length > 0) {
      try {
        const localCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
        
        await fetch('/api/cart/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cart: localCart }),
        });
        
        // Lấy giỏ hàng mới nhất từ server
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.cart) {
            setCart(data.cart);
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data.cart));
          }
        }
      } catch (error) {
        console.error('Error syncing cart with server:', error);
      }
    }
  }, [isLoggedIn, cart.length]);
  
  /**
   * Thêm sản phẩm vào giỏ hàng
   * @param {Object} product - Thông tin sản phẩm
   */
  const addToCart = useCallback(async (product) => {
    // Tạo uniqueKey nếu chưa có
    if (!product.uniqueKey) {
      product.uniqueKey = `${product.id}_${product.version || 'default'}_${product.options ? product.options.join('_') : ''}`;
    }
    
    // Đảm bảo số lượng hợp lệ
    const quantity = product.quantity || 1;
    
    if (isLoggedIn) {
      try {
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...product, quantity }),
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.cart) {
            setCart(data.cart);
          }
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      // Xử lý offline: thêm vào localStorage
      setCart((prevCart) => {
        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const existingProductIndex = prevCart.findIndex(
          (item) => item.uniqueKey === product.uniqueKey
        );
        
        if (existingProductIndex >= 0) {
          // Nếu sản phẩm đã tồn tại, tăng số lượng
          const newCart = [...prevCart];
          newCart[existingProductIndex].quantity += quantity;
          return newCart;
        } else {
          // Nếu sản phẩm chưa tồn tại, thêm mới
          return [...prevCart, { ...product, quantity }];
        }
      });
    }
  }, [isLoggedIn]);
  
  /**
   * Cập nhật số lượng sản phẩm trong giỏ hàng
   * @param {string} uniqueKey - Khóa định danh sản phẩm
   * @param {number} quantity - Số lượng mới
   */
  const updateQuantity = useCallback(async (uniqueKey, quantity) => {
    if (isLoggedIn) {
      try {
        const response = await fetch('/api/cart', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uniqueKey, quantity }),
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.cart) {
            setCart(data.cart);
          }
        }
      } catch (error) {
        console.error('Error updating cart item quantity:', error);
      }
    } else {
      // Xử lý offline
      setCart((prevCart) => {
        if (quantity <= 0) {
          // Nếu số lượng <= 0, xóa sản phẩm
          return prevCart.filter((item) => item.uniqueKey !== uniqueKey);
        } else {
          // Cập nhật số lượng
          return prevCart.map((item) =>
            item.uniqueKey === uniqueKey ? { ...item, quantity } : item
          );
        }
      });
    }
  }, [isLoggedIn]);
  
  /**
   * Xóa sản phẩm khỏi giỏ hàng
   * @param {string} uniqueKey - Khóa định danh sản phẩm
   */
  const removeFromCart = useCallback(async (uniqueKey) => {
    if (isLoggedIn) {
      try {
        const response = await fetch(`/api/cart?uniqueKey=${encodeURIComponent(uniqueKey)}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.cart) {
            setCart(data.cart);
          }
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    } else {
      // Xử lý offline
      setCart((prevCart) => prevCart.filter((item) => item.uniqueKey !== uniqueKey));
    }
  }, [isLoggedIn]);
  
  /**
   * Xóa toàn bộ giỏ hàng
   */
  const clearCart = useCallback(async () => {
    if (isLoggedIn) {
      try {
        const response = await fetch('/api/cart/clear', {
          method: 'POST',
        });
        
        if (response.ok) {
          setCart([]);
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    } else {
      // Xử lý offline
      setCart([]);
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [isLoggedIn]);
  
  // Tính tổng số lượng và tổng tiền
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);
  
  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    syncWithServer,
    isLoading,
    cartTotal,
    cartItemsCount,
    isLoggedIn,
  };
} 