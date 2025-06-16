'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';

// Constants
const PLACEHOLDER_IMAGE = '/images/placeholder/product-placeholder.svg';
const STORAGE_KEY = 'cart';

/**
 * Item interface for cart items
 */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  options?: string[];
  version?: string;
  uniqueKey?: string; // Key duy nhất để phân biệt các variant
}

/**
 * CartContext interface defining all available operations
 */
export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (uniqueKey: string) => void;
  updateQuantity: (uniqueKey: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalAmount: number;
  isLoading: boolean;
  syncWithServer: () => Promise<void>;
}

// Create cart context with default values
const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  totalAmount: 0,
  isLoading: false,
  syncWithServer: async () => {},
});

/**
 * Generate unique key for cart items based on product attributes
 */
const generateUniqueKey = (item: CartItem): string => {
  const version = item.version || 'default';
  const options = (item.options || []).sort().join('|');
  return `${item.id}_${version}_${options}`;
};

/**
 * Hook to access cart context
 */
export const useCart = () => {
  return useContext(CartContext);
};

/**
 * Normalize image URL to use proper placeholder if invalid
 */
const normalizeImageUrl = (imageUrl?: string): string => {
  if (!imageUrl) return PLACEHOLDER_IMAGE;
  
  const isPlaceholder = 
    imageUrl.includes('/images/product-placeholder.svg') || 
    imageUrl.includes('/images/placeholder/product-placeholder');
    
  return isPlaceholder ? PLACEHOLDER_IMAGE : imageUrl;
};

/**
 * Cart provider component that manages cart state
 */
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  
  const isAuthenticated = !!session?.user?.email;

  /**
   * Load cart from server for authenticated users
   */
  const loadCartFromServer = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/cart');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.cart) {
          console.log('🛒 Cart loaded from server:', result.cart);
          setItems(result.cart);
          // Backup to localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(result.cart));
        }
      } else {
        console.error('Failed to load cart from server:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading cart from server:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Save cart to server for authenticated users
   */
  const saveCartToServer = useCallback(async (cartItems: CartItem[]) => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart: cartItems }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('🛒 Cart saved to server:', result.message);
      } else {
        console.error('Failed to save cart to server:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving cart to server:', error);
    }
  }, [isAuthenticated]);

  /**
   * Public method to sync cart with server
   */
  const syncWithServer = useCallback(async () => {
    await loadCartFromServer();
  }, [loadCartFromServer]);

  /**
   * Initialize cart from localStorage or server
   */
  useEffect(() => {
    const initializeCart = async () => {
      if (status === 'loading') return; // Wait for session

      if (isAuthenticated) {
        // User is logged in - load from server
        await loadCartFromServer();
      } else {
        // User is not logged in - load from localStorage
        const savedCart = localStorage.getItem(STORAGE_KEY);
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            const cartWithUniqueKeys = parsedCart.map((item: CartItem) => ({
              ...item,
              uniqueKey: item.uniqueKey || generateUniqueKey(item),
            }));
            setItems(cartWithUniqueKeys);
            console.log('🛒 Cart loaded from localStorage:', cartWithUniqueKeys);
          } catch (error) {
            console.error('Failed to parse cart from localStorage:', error);
          }
        }
      }
      setLoaded(true);
    };

    initializeCart();
  }, [isAuthenticated, loadCartFromServer, status]);

  /**
   * Save cart when items change
   */
  useEffect(() => {
    if (!loaded) return;

    // Always save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

    // If user is logged in, also save to server
    if (isAuthenticated) {
      saveCartToServer(items);
    }
  }, [items, loaded, isAuthenticated, saveCartToServer]);

  /**
   * Merge local cart with server when user logs in
   */
  useEffect(() => {
    if (isAuthenticated && loaded) {
      // Merge cart from localStorage with server
      const localCart = localStorage.getItem(STORAGE_KEY);
      if (localCart) {
        try {
          const parsedLocalCart = JSON.parse(localCart);
          if (parsedLocalCart.length > 0) {
            // Have cart in localStorage, merge with server
            loadCartFromServer().then(() => {
              // After loading server cart, merge with local cart if needed
              const mergedCart = [...items];
              parsedLocalCart.forEach((localItem: CartItem) => {
                const existingIndex = mergedCart.findIndex(
                  (serverItem) => generateUniqueKey(serverItem) === generateUniqueKey(localItem)
                );
                if (existingIndex === -1) {
                  // Ensure the local item has all required properties
                  const safeLocalItem: CartItem = {
                    id: localItem.id || '',
                    name: localItem.name || '',
                    price: localItem.price || 0,
                    quantity: localItem.quantity || 1,
                    image: localItem.image,
                    options: localItem.options,
                    version: localItem.version,
                    uniqueKey: localItem.uniqueKey || generateUniqueKey(localItem)
                  };
                  mergedCart.push(safeLocalItem);
                }
              });

              if (mergedCart.length !== items.length) {
                setItems(mergedCart);
              }
            });
          }
        } catch (error) {
          console.error('Error merging local cart:', error);
        }
      }
    }
  }, [isAuthenticated, loaded, items, loadCartFromServer]);

  /**
   * Add item to cart
   */
  const addItem = useCallback((newItem: CartItem) => {
    setItems((prevItems) => {
      // Find product with the same attributes
      const existingItemIndex = prevItems.findIndex((item) => 
        generateUniqueKey(item) === generateUniqueKey(newItem)
      );

      if (existingItemIndex > -1) {
        // If item already exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity || 1;

        // Ensure item has uniqueKey
        if (!updatedItems[existingItemIndex].uniqueKey) {
          updatedItems[existingItemIndex].uniqueKey = generateUniqueKey(updatedItems[existingItemIndex]);
        }

        // Keep best image URL
        if (newItem.image && (!updatedItems[existingItemIndex].image || 
            normalizeImageUrl(updatedItems[existingItemIndex].image) === PLACEHOLDER_IMAGE)) {
          updatedItems[existingItemIndex].image = normalizeImageUrl(newItem.image);
        }

        return updatedItems;
      } else {
        // If new item, add to array
        const itemWithUniqueKey = {
          ...newItem,
          image: normalizeImageUrl(newItem.image),
          quantity: newItem.quantity || 1,
          uniqueKey: generateUniqueKey(newItem),
        };

        return [...prevItems, itemWithUniqueKey];
      }
    });

    console.log('🛒 Item added to cart:', newItem.name);
  }, []);

  /**
   * Remove item from cart
   */
  const removeItem = useCallback((uniqueKey: string) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.uniqueKey !== uniqueKey);
      console.log('🛒 Item removed from cart, uniqueKey:', uniqueKey);
      return newItems;
    });
  }, []);

  /**
   * Update item quantity
   */
  const updateQuantity = useCallback((uniqueKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(uniqueKey);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => (item.uniqueKey === uniqueKey ? { ...item, quantity } : item)),
    );

    console.log('🛒 Cart quantity updated, uniqueKey:', uniqueKey, 'quantity:', quantity);
  }, [removeItem]);

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback(() => {
    setItems([]);
    console.log('🛒 Cart cleared');
  }, []);

  // Calculate cart stats with memoization to prevent unnecessary recalculations
  const { itemCount, totalAmount } = useMemo(() => {
    return {
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      totalAmount: items.reduce((total, item) => total + item.price * item.quantity, 0),
    };
  }, [items]);

  // Create context value with memoization
  const contextValue = useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    totalAmount,
    isLoading,
    syncWithServer,
  }), [
    items, 
    addItem, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    itemCount, 
    totalAmount, 
    isLoading, 
    syncWithServer
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
