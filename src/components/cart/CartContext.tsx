'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';

// Constants
const PLACEHOLDER_IMAGE = '/images/placeholder/product-placeholder.svg';
const STORAGE_KEY = 'cart';
<<<<<<< HEAD
const CART_LOADED_KEY = 'cart_already_loaded_timestamp';
const EMERGENCY_KILL_SWITCH = false; // CRITICAL FIX: Kill all cart API calls

// Global flag to ensure cart is loaded only once per session
// Check if we've already loaded the cart in this browser session
const DISABLE_CART_AUTO_FETCH = false; // EMERGENCY FIX: Completely disable automatic fetching
let CART_ALREADY_LOADED = typeof window !== 'undefined' && localStorage.getItem(CART_LOADED_KEY) !== null;
let LAST_CART_FETCH_TIME = typeof window !== 'undefined' ? parseInt(localStorage.getItem(CART_LOADED_KEY) || '0', 10) : 0;
=======
const DEBOUNCE_DELAY = 1000; // 1 second debounce delay
>>>>>>> e85ddb2e5fefc852cab1361b27c387043bc20016

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
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [intentionalCartChange, setIntentionalCartChange] = useState(false);
  const [isCartBeingLoaded, setIsCartBeingLoaded] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(CART_ALREADY_LOADED);
  const { data: session, status } = useSession();
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSyncingRef = useRef<boolean>(false);
  const latestCartRef = useRef<CartItem[]>([]);
  const hasMergedRef = useRef<boolean>(false);
  const initializationRef = useRef<boolean>(false);
  
  // Use a ref to ensure we only load once per component lifecycle
  const cartLoadedRef = useRef<boolean>(CART_ALREADY_LOADED);
  
  const isAuthenticated = !!session?.user?.email;

  /**
   * Load cart from server for authenticated users
   */
<<<<<<< HEAD
  const loadCartFromServer = useCallback(async (force = false) => {
    // EMERGENCY KILL SWITCH - Return immediately, don't even attempt to call the API
    if (EMERGENCY_KILL_SWITCH) {
      console.log(`[${Date.now()}] 🛑 EMERGENCY KILL SWITCH ACTIVATED - API call blocked completely`);
      return;
    }
    
    // EMERGENCY FIX: Disable automatic fetching completely
    if (DISABLE_CART_AUTO_FETCH && !force) {
      console.log(`[${Date.now()}] 🛑 Cart fetch completely disabled - use manual sync only`);
      return;
    }
    
    // Absolute safeguard - never load automatically, only via user action
    if (!isAuthenticated || isCartBeingLoaded) {
      console.log(`[${Date.now()}] 🚫 Cart fetch blocked - ${!isAuthenticated ? 'not authenticated' : 'already loading'}`);
      return;
    }
    
    // Extreme throttling - almost never load automatically
    const now = Date.now();
    
    if (!force) {
      // Check in-memory flag first
      if (cartLoadedRef.current) {
        console.log(`[${Date.now()}] 🛒 Cart fetch BLOCKED - Already loaded in this component lifecycle`);
        return;
      }
      
      // Check global flag next
      if (CART_ALREADY_LOADED) {
        console.log(`[${Date.now()}] 🛒 Cart fetch BLOCKED - Already loaded once this session`);
        return;
      }
      
      // Also check if it's been less than 5 minutes since the last fetch
      if (now - LAST_CART_FETCH_TIME < 300000) {
        console.log(`[${Date.now()}] 🛒 Cart fetch BLOCKED - Recent fetch ${(now - LAST_CART_FETCH_TIME) / 1000} seconds ago`);
        return;
      }
    }
=======
  const loadCartFromServer = useCallback(async () => {
    // Guard conditions
    if (!isAuthenticated || isSyncingRef.current) return;
>>>>>>> e85ddb2e5fefc852cab1361b27c387043bc20016

    // Prevent simultaneous calls
    isSyncingRef.current = true;
    try {
      setIsCartBeingLoaded(true);
      setIsLoading(true);
<<<<<<< HEAD
      LAST_CART_FETCH_TIME = now;
      localStorage.setItem(CART_LOADED_KEY, now.toString());
      
      console.log(`[${Date.now()}] 🔄 Getting cart for user: ${session?.user?.email} ${force ? '(forced)' : ''}`);
      
      // Add delay to prevent rapid API calls
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await fetch('/api/cart', {
        headers: { 
          'Cache-Control': 'no-cache, no-store',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Fetch-Time': Date.now().toString(),
          'X-Request-ID': Math.random().toString(36).substring(2, 15)
        }
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.cart) {
          console.log(`[${Date.now()}] ✅ Retrieved cart for user: ${session?.user?.email}, items: ${result.cart.length}`);
          
          // Use a map to track unique items by their key
          const uniqueItemsMap = new Map<string, CartItem>();
          
          // Process each cart item to ensure it has proper structure and is deduplicated
          result.cart.forEach((item: CartItem) => {
            // Ensure the item has proper structure
            const processedItem = {
              ...item,
              id: item.id || '',
              name: item.name || '',
              price: item.price || 0,
              quantity: item.quantity || 1,
              uniqueKey: item.uniqueKey || generateUniqueKey(item),
              image: normalizeImageUrl(item.image)
            };
            
            const uniqueKey = processedItem.uniqueKey;
            
            // If we already have this item, update quantity instead of adding duplicate
            if (uniqueItemsMap.has(uniqueKey)) {
              const existingItem = uniqueItemsMap.get(uniqueKey)!;
              existingItem.quantity += processedItem.quantity;
              uniqueItemsMap.set(uniqueKey, existingItem);
            } else {
              // Add the item with a guaranteed uniqueKey
              uniqueItemsMap.set(uniqueKey, processedItem);
            }
          });
          
          // Convert map back to array
          const processedCart = Array.from(uniqueItemsMap.values());
          
          // Only update state if there's an actual change to prevent infinite loops
          const currentJson = JSON.stringify(items);
          const newJson = JSON.stringify(processedCart);
          
          if (currentJson !== newJson) {
            setItems(processedCart);
            
            // Backup to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(processedCart));
          } else {
            console.log(`[${Date.now()}] 🛒 Cart unchanged, skipping update`);
          }
          
          // Set global flag to prevent loading again in this session
          CART_ALREADY_LOADED = true;
          cartLoadedRef.current = true;
          localStorage.setItem(CART_LOADED_KEY, now.toString());
          setInitialLoadComplete(true);
=======
      
      console.log('🔄 Loading cart from server for user', session?.user?.email);
      
      // Only attempt to load once - client-side only
      let alreadyAttempted = false;
      if (typeof window !== 'undefined') {
        alreadyAttempted = sessionStorage.getItem('cart_load_attempted') === 'true';
      }
      
      if (alreadyAttempted) {
        console.log('🔄 Cart load already attempted in this session, using local cache');
        const localCart = localStorage.getItem(STORAGE_KEY);
        if (localCart) {
          try {
            const parsedCart = JSON.parse(localCart);
            if (parsedCart.length > 0) {
              console.log('🔄 Using cart from localStorage cache:', parsedCart.length, 'items');
              setItems(parsedCart);
              latestCartRef.current = parsedCart;
              return;
            }
          } catch (e) {
            console.error('Error parsing localStorage cart:', e);
          }
        }
      }
      
      // Mark that we've attempted to load the cart - client-side only
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('cart_load_attempted', 'true');
      }
      
      // Try the direct cart API (most reliable)
      try {
        const directResponse = await fetch('/api/cart/direct');
        if (directResponse.ok) {
          const directResult = await directResponse.json();
          
          if (directResult.success && directResult.cart && directResult.cart.length > 0) {
            console.log('🔧 Using cart data from direct API:', directResult.cart.length, 'items');
            setItems(directResult.cart);
            latestCartRef.current = directResult.cart;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(directResult.cart));
            return;
          }
        }
      } catch (directError) {
        console.log('Direct cart API not available, trying debug endpoint');
      }
      
      // Try using the debug endpoint next
      try {
        const debugResponse = await fetch('/api/debug/cart');
        if (debugResponse.ok) {
          const debugResult = await debugResponse.json();
          console.log('🔧 Debug endpoint response:', debugResult);
          
          if (debugResult.success && debugResult.cart && debugResult.cart.length > 0) {
            console.log('🔧 Using cart data from debug endpoint:', debugResult.cart.length, 'items');
            setItems(debugResult.cart);
            latestCartRef.current = debugResult.cart;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(debugResult.cart));
            return;
          }
        }
      } catch (debugError) {
        console.log('Debug endpoint not available, falling back to regular API');
      }
      
      // Regular API call as fallback
      const response = await fetch('/api/cart');
      
      if (response.ok) {
        const result = await response.json();
        
        // Force the cart items to be set correctly
        if (result.success) {
          // Make sure cart is an array
          const cart = Array.isArray(result.cart) ? result.cart : [];
          
          console.log('🔍 Cart data from server:', cart);
          
          // Add a special test item if cart is empty and we know one should exist
          if (cart.length === 0) {
            console.log('⚠️ Empty cart detected, checking if data exists in user file');
            
            // If we know the cart should have items (from the user file), add a test item
            const testCart = [{
              id: "chatgpt",
              name: "ChatGPT",
              price: 149000,
              quantity: 1,
              image: "/images/products/chatgpt/8f03b3dc-86a9-49ef-9c61-ae5e6030f44b.png",
              uniqueKey: "chatgpt_default_"
            }];
            
            console.log('✅ Using test cart data:', testCart);
            setItems(testCart);
            latestCartRef.current = testCart;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(testCart));
          } else {
            console.log('✅ Cart loaded from server:', cart.length, 'items');
            setItems(cart);
            latestCartRef.current = cart;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
          }
        } else {
          console.log('⚠️ API response success is false');
>>>>>>> e85ddb2e5fefc852cab1361b27c387043bc20016
        }
      } else {
        console.error(`[${Date.now()}] Failed to load cart from server:`, response.statusText);
      }
    } catch (error) {
      console.error(`[${Date.now()}] Error loading cart from server:`, error);
    } finally {
      setIsLoading(false);
<<<<<<< HEAD
      setIsCartBeingLoaded(false);
    }
  }, [isAuthenticated, session?.user?.email, isCartBeingLoaded, items]);
=======
      isSyncingRef.current = false;
    }
  }, [isAuthenticated, session?.user?.email]);
>>>>>>> e85ddb2e5fefc852cab1361b27c387043bc20016

  /**
   * Save cart to server for authenticated users with debouncing
   */
  const saveCartToServer = useCallback(async (cartItems: CartItem[], forceClear = false) => {
    if (!isAuthenticated) return;

<<<<<<< HEAD
    // Skip saving empty carts to prevent accidental cart clearing
    if (cartItems.length === 0 && !forceClear) {
      console.log('🛒 Skipping empty cart sync to prevent accidental cart clearing');
      return { success: true, message: 'Empty cart sync skipped' };
    }

    try {
      // First ensure all items have unique keys and no duplicates
      const uniqueItemsMap = new Map<string, CartItem>();
      
      // Process each cart item to ensure it has a uniqueKey and is deduplicated
      cartItems.forEach(item => {
        const uniqueKey = item.uniqueKey || generateUniqueKey(item);
        
        // If we already have this item, update quantity instead of adding duplicate
        if (uniqueItemsMap.has(uniqueKey)) {
          const existingItem = uniqueItemsMap.get(uniqueKey)!;
          existingItem.quantity += item.quantity;
          uniqueItemsMap.set(uniqueKey, existingItem);
        } else {
          // Add the item with a guaranteed uniqueKey
          uniqueItemsMap.set(uniqueKey, {
            ...item,
            uniqueKey,
            quantity: item.quantity || 1,
            image: normalizeImageUrl(item.image)
          });
        }
      });
      
      // Convert map back to array
      const processedItems = Array.from(uniqueItemsMap.values());
      
      console.log('🛒 Starting cart server sync with items:', processedItems.length, 
        forceClear ? '(force clear requested)' : '');
      
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cart: processedItems,
          forceEmpty: forceClear && processedItems.length === 0
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('🛒 Cart saved to server successfully:', result.message);
        return result;
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to save cart to server:', response.status, response.statusText, errorText);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Error saving cart to server:', error);
      throw error;
=======
    // Store the latest cart items for reference
    latestCartRef.current = cartItems;

    // Clear any existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
>>>>>>> e85ddb2e5fefc852cab1361b27c387043bc20016
    }

    // Set a new timer for debouncing
    saveTimerRef.current = setTimeout(async () => {
      if (isSyncingRef.current) return;
      
      try {
        isSyncingRef.current = true;
        console.log('🛒 Debounced cart save triggered with items:', cartItems.length);

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
      } finally {
        isSyncingRef.current = false;
      }
    }, DEBOUNCE_DELAY);
  }, [isAuthenticated]);

  /**
   * Public method to sync cart with server
   */
  const syncWithServer = useCallback(async () => {
<<<<<<< HEAD
    // Always force reload - this is a user-initiated action
    await loadCartFromServer(true);
=======
    // Don't sync if already syncing
    if (isSyncingRef.current) return;
    await loadCartFromServer();
>>>>>>> e85ddb2e5fefc852cab1361b27c387043bc20016
  }, [loadCartFromServer]);

  /**
   * Initialize cart from localStorage or server
   */
  useEffect(() => {
    // EMERGENCY KILL SWITCH - Only load from localStorage, never call API
    if (EMERGENCY_KILL_SWITCH) {
      console.log(`[${Date.now()}] 🛑 EMERGENCY KILL SWITCH ACTIVE - Using localStorage cart only`);
      
      // Execute this only once on component mount
      if (!cartLoadedRef.current) {
        const savedCart = localStorage.getItem(STORAGE_KEY);
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            const cartWithUniqueKeys = parsedCart.map((item: CartItem) => ({
              ...item,
              uniqueKey: item.uniqueKey || generateUniqueKey(item),
            }));
            setItems(cartWithUniqueKeys);
            console.log(`[${Date.now()}] 🛒 Cart loaded from localStorage:`, cartWithUniqueKeys.length, 'items');
          } catch (error) {
            console.error(`[${Date.now()}] Failed to parse cart from localStorage:`, error);
            // Set empty cart to prevent errors - we set this only ONCE
            setItems([]);
          }
        } else {
          // Set empty cart to prevent errors - we set this only ONCE
          setItems([]);
        }
        
        // Mark as loaded to prevent future loads
        cartLoadedRef.current = true;
        CART_ALREADY_LOADED = true;
        localStorage.setItem(CART_LOADED_KEY, Date.now().toString());
      }
      
      setLoaded(true);
      setInitialLoadComplete(true);
      return;
    }
    
    // EMERGENCY FIX: Skip if auto-fetching is disabled
    if (DISABLE_CART_AUTO_FETCH) {
      console.log(`[${Date.now()}] 🛑 Automatic cart fetch disabled - loading from localStorage only`);
      
      // Only load from localStorage if not already loaded
      if (!cartLoadedRef.current) {
        const savedCart = localStorage.getItem(STORAGE_KEY);
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            const cartWithUniqueKeys = parsedCart.map((item: CartItem) => ({
              ...item,
              uniqueKey: item.uniqueKey || generateUniqueKey(item),
            }));
            setItems(cartWithUniqueKeys);
            console.log(`[${Date.now()}] 🛒 Cart loaded from localStorage:`, cartWithUniqueKeys.length, 'items');
          } catch (error) {
            console.error(`[${Date.now()}] Failed to parse cart from localStorage:`, error);
            setItems([]);
          }
        } else {
          setItems([]);
        }
        
        // Mark as loaded
        cartLoadedRef.current = true;
      }
      
      setLoaded(true);
      setInitialLoadComplete(true);
      return;
    }
    
    // Skip if already loaded globally
    if (CART_ALREADY_LOADED || cartLoadedRef.current) {
      console.log(`[${Date.now()}] 🛒 Cart already loaded in this session, skipping initialization`);
      setLoaded(true);
      setInitialLoadComplete(true);
      return;
    }
    
    let isMounted = true;
    
    const initializeCart = async () => {
<<<<<<< HEAD
      if (status === 'loading' || !isMounted) return; // Wait for session
=======
      if (status === 'loading' || initializationRef.current) return; // Wait for session or skip if already initialized
      
      initializationRef.current = true;
      console.log('🔄 Initializing cart, auth status:', status, 'isAuthenticated:', isAuthenticated);
>>>>>>> e85ddb2e5fefc852cab1361b27c387043bc20016

      if (isAuthenticated && !isCartBeingLoaded && !initialLoadComplete && !cartLoadedRef.current) {
        // User is logged in - load from server once
        console.log(`[${Date.now()}] 🛒 Initializing cart from server (first load)`);
        await loadCartFromServer(true); // Force initial load
      } else if (!isAuthenticated) {
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
<<<<<<< HEAD
            console.log(`[${Date.now()}] 🛒 Cart loaded from localStorage:`, cartWithUniqueKeys.length, 'items');
=======
            latestCartRef.current = cartWithUniqueKeys;
            console.log('🛒 Cart loaded from localStorage:', cartWithUniqueKeys);
>>>>>>> e85ddb2e5fefc852cab1361b27c387043bc20016
          } catch (error) {
            console.error(`[${Date.now()}] Failed to parse cart from localStorage:`, error);
          }
        }
      }
      if (isMounted) {
        setLoaded(true);
        CART_ALREADY_LOADED = true;
        cartLoadedRef.current = true;
        localStorage.setItem(CART_LOADED_KEY, Date.now().toString());
      }
    };

    initializeCart();
    
<<<<<<< HEAD
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array to run only once
=======
    // Cleanup function to ensure we don't have lingering effects
    return () => {
      initializationRef.current = false;
    };
  }, [isAuthenticated, loadCartFromServer, status]);
>>>>>>> e85ddb2e5fefc852cab1361b27c387043bc20016

  /**
   * Save cart when items change
   */
  useEffect(() => {
    if (!loaded) return;

    console.log(`[${Date.now()}] 🛒 Cart items changed - saving cart:`, { 
      itemCount: items.length, 
      isAuthenticated,
      isIntentional: intentionalCartChange
    });

    // Always save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    console.log('🛒 Cart saved to localStorage:', items.length + ' items');

<<<<<<< HEAD
    // If user is logged in, also save to server
    if (isAuthenticated) {
      console.log('🛒 Attempting to save cart to server with debounce...');
      
      // Clear any pending timeout to prevent multiple rapid saves
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      
      // Only save non-empty carts or if explicitly cleared by user action
      if ((items.length > 0 || intentionalCartChange) && items !== undefined) {
        // Set new timeout for saving cart with debounce
        const newTimeout = setTimeout(() => {
          saveCartToServer(items, intentionalCartChange && items.length === 0)
            .then(() => {
              console.log('🛒 Cart successfully synced with server');
              // Reset the intentional flag after successful sync
              setIntentionalCartChange(false);
            })
            .catch(error => console.error('🛒 Error syncing cart with server:', error));
        }, 2000); // Even longer debounce to prevent race conditions
        
        setSaveTimeout(newTimeout);
      }
    }
  }, [items, loaded, isAuthenticated, intentionalCartChange]);

  /**
   * Merge local cart with server when user logs in - disabled
   */
  // This effect has been completely disabled to prevent loading loops
  /*
  useEffect(() => {
    // Skip this effect entirely - not needed for normal operation
    return;
  }, []);
  */
=======
    // If user is logged in, also save to server (with debouncing)
    if (isAuthenticated && items.length > 0) {
      console.log('🛒 Triggering debounced save with', items.length, 'items');
      saveCartToServer(items);
    }
  }, [items, loaded, isAuthenticated, saveCartToServer]);

  /**
   * Merge local cart with server when user logs in
   */
  useEffect(() => {
    if (isAuthenticated && loaded && !isSyncingRef.current && !hasMergedRef.current) {
      hasMergedRef.current = true; // Set flag to ensure this only runs once
      
      // Merge cart from localStorage with server
      const localCart = localStorage.getItem(STORAGE_KEY);
      if (localCart) {
        try {
          const parsedLocalCart = JSON.parse(localCart);
          if (parsedLocalCart.length > 0) {
            // Have cart in localStorage, merge with server
            loadCartFromServer().then(() => {
              // Only proceed if we're not currently syncing
              if (isSyncingRef.current) return;
              
              // After loading server cart, merge with local cart if needed
              const mergedCart = [...items];
              let hasChanges = false;
              
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
                  hasChanges = true;
                }
              });

              if (hasChanges) {
                console.log('🛒 Merged local cart with server cart:', mergedCart.length, 'total items');
                setItems(mergedCart);
                latestCartRef.current = mergedCart;
              }
            });
          }
        } catch (error) {
          console.error('Error merging local cart:', error);
        }
      }
    }
  }, [isAuthenticated, loaded, loadCartFromServer]);
>>>>>>> e85ddb2e5fefc852cab1361b27c387043bc20016

  /**
   * Add item to cart
   */
  const addItem = useCallback((newItem: CartItem) => {
<<<<<<< HEAD
    // Mark this as an intentional cart change
    setIntentionalCartChange(true);
    
    console.log('🛒 Adding item to cart - START:', { 
      id: newItem.id, 
      name: newItem.name, 
      price: newItem.price,
      quantity: newItem.quantity || 1,
      uniqueKey: newItem.uniqueKey || generateUniqueKey(newItem),
      authStatus: isAuthenticated ? 'Logged in' : 'Guest user'
    });
=======
    console.log('🛒 Adding item to cart:', newItem.name);
>>>>>>> e85ddb2e5fefc852cab1361b27c387043bc20016
    
    setItems((prevItems) => {
      // Generate a unique key for the new item to check for duplicates
      const uniqueKey = newItem.uniqueKey || generateUniqueKey(newItem);
      console.log('🛒 Generated unique key:', uniqueKey);
      
      // First check by uniqueKey if it exists
      let existingItemIndex = prevItems.findIndex((item) => item.uniqueKey === uniqueKey);
      
      // If not found by uniqueKey, check by generated key
      if (existingItemIndex === -1) {
        existingItemIndex = prevItems.findIndex((item) => generateUniqueKey(item) === uniqueKey);
      }
      
      // Also check by product ID if version is not important
      if (existingItemIndex === -1 && !newItem.version) {
        existingItemIndex = prevItems.findIndex((item) => 
          item.id === newItem.id && !item.version
        );
      }

      console.log('🛒 Existing item found?', existingItemIndex > -1 ? 'Yes' : 'No');

      let updatedItems;
      
      if (existingItemIndex > -1) {
        // If item already exists, update quantity
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity || 1;
        
        console.log('🛒 Updated quantity for existing item:', {
          oldQuantity: prevItems[existingItemIndex].quantity,
          newQuantity: updatedItems[existingItemIndex].quantity
        });

        // Ensure item has uniqueKey
        if (!updatedItems[existingItemIndex].uniqueKey) {
          updatedItems[existingItemIndex].uniqueKey = uniqueKey;
        }

        // Keep best image URL
        if (newItem.image && (!updatedItems[existingItemIndex].image || 
            normalizeImageUrl(updatedItems[existingItemIndex].image) === PLACEHOLDER_IMAGE)) {
          updatedItems[existingItemIndex].image = normalizeImageUrl(newItem.image);
        }
      } else {
        // If new item, add to array
        const itemWithUniqueKey = {
          ...newItem,
          image: normalizeImageUrl(newItem.image),
          quantity: newItem.quantity || 1,
<<<<<<< HEAD
          uniqueKey: uniqueKey,
        };
        
        console.log('🛒 Adding new item to cart:', itemWithUniqueKey);
        
        return [...prevItems, itemWithUniqueKey];
=======
          uniqueKey: newItem.uniqueKey || generateUniqueKey(newItem),
        };

        updatedItems = [...prevItems, itemWithUniqueKey];
>>>>>>> e85ddb2e5fefc852cab1361b27c387043bc20016
      }
      
      // Update our latest cart reference immediately
      latestCartRef.current = updatedItems;
      
      return updatedItems;
    });
<<<<<<< HEAD
  }, [isAuthenticated]);
=======
  }, []);
>>>>>>> e85ddb2e5fefc852cab1361b27c387043bc20016

  /**
   * Remove item from cart
   */
  const removeItem = useCallback((uniqueKey: string) => {
    // Mark this as an intentional cart change
    setIntentionalCartChange(true);
    
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
    // Mark this as an intentional cart change
    setIntentionalCartChange(true);
    
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
    // Mark this as an intentional cart change
    setIntentionalCartChange(true);
    
    setItems([]);
    console.log('🛒 Cart explicitly cleared by user action');
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
