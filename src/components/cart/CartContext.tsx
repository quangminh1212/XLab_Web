'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  options?: string[]
  version?: string
  uniqueKey?: string // Key duy nhất để phân biệt các variant
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (uniqueKey: string) => void
  updateQuantity: (uniqueKey: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  totalAmount: number
  isLoading: boolean
  syncWithServer: () => Promise<void>
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  totalAmount: 0,
  isLoading: false,
  syncWithServer: async () => {}
})

// Tạo key duy nhất cho sản phẩm dựa trên id, version và options
const generateUniqueKey = (item: CartItem): string => {
  const version = item.version || 'default'
  const options = (item.options || []).sort().join('|')
  return `${item.id}_${version}_${options}`
}

export const useCart = () => {
  return useContext(CartContext)
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession()

  // Load cart từ server khi user đăng nhập
  const loadCartFromServer = async () => {
    if (!session?.user?.email) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/cart')
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.cart) {
          console.log('🛒 Cart loaded from server:', result.cart)
          setItems(result.cart)
          // Cũng lưu vào localStorage để backup
          localStorage.setItem('cart', JSON.stringify(result.cart))
        }
      } else {
        console.error('Failed to load cart from server:', response.statusText)
      }
    } catch (error) {
      console.error('Error loading cart from server:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Save cart lên server
  const saveCartToServer = async (cartItems: CartItem[]) => {
    if (!session?.user?.email) return

    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cart: cartItems })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('🛒 Cart saved to server:', result.message)
      } else {
        console.error('Failed to save cart to server:', response.statusText)
      }
    } catch (error) {
      console.error('Error saving cart to server:', error)
    }
  }

  // Sync với server (public method)
  const syncWithServer = async () => {
    await loadCartFromServer()
  }

  // Load cart khi component mount
  useEffect(() => {
    const initializeCart = async () => {
      if (status === 'loading') return // Đợi session load

      if (session?.user?.email) {
        // User đã đăng nhập - load từ server
        await loadCartFromServer()
      } else {
        // User chưa đăng nhập - load từ localStorage
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart)
            const cartWithUniqueKeys = parsedCart.map((item: CartItem) => ({
              ...item,
              uniqueKey: item.uniqueKey || generateUniqueKey(item)
            }))
            setItems(cartWithUniqueKeys)
            console.log('🛒 Cart loaded from localStorage:', cartWithUniqueKeys)
          } catch (error) {
            console.error('Failed to parse cart from localStorage:', error)
          }
        }
      }
      setLoaded(true)
    }

    initializeCart()
  }, [session, status])

  // Save cart khi items thay đổi
  useEffect(() => {
    if (!loaded) return

    // Luôn lưu vào localStorage
    localStorage.setItem('cart', JSON.stringify(items))

    // Nếu user đã đăng nhập, cũng lưu lên server
    if (session?.user?.email) {
      saveCartToServer(items)
    }
  }, [items, loaded, session])

  // Khi user đăng nhập, sync cart từ localStorage lên server
  useEffect(() => {
    if (session?.user?.email && loaded) {
      // Merge cart từ localStorage với server
      const localCart = localStorage.getItem('cart')
      if (localCart) {
        try {
          const parsedLocalCart = JSON.parse(localCart)
          if (parsedLocalCart.length > 0) {
            // Có cart trong localStorage, merge với server
            loadCartFromServer().then(() => {
              // After loading server cart, merge with local cart if needed
              const mergedCart = [...items]
              parsedLocalCart.forEach((localItem: CartItem) => {
                const existingIndex = mergedCart.findIndex(serverItem => 
                  generateUniqueKey(serverItem) === generateUniqueKey(localItem)
                )
                if (existingIndex === -1) {
                  mergedCart.push({
                    ...localItem,
                    uniqueKey: localItem.uniqueKey || generateUniqueKey(localItem)
                  })
                }
              })
              
              if (mergedCart.length !== items.length) {
                setItems(mergedCart)
              }
            })
          }
        } catch (error) {
          console.error('Error merging local cart:', error)
        }
      }
    }
  }, [session?.user?.email, loaded])

  // Hàm kiểm tra xem 2 sản phẩm có giống nhau không (bao gồm tất cả thuộc tính)
  const isSameProduct = (item1: CartItem, item2: CartItem): boolean => {
    return generateUniqueKey(item1) === generateUniqueKey(item2)
  }

  const addItem = async (newItem: CartItem) => {
    setItems(prevItems => {
      // Tìm sản phẩm giống nhau hoàn toàn (bao gồm version và options)
      const existingItemIndex = prevItems.findIndex(item => isSameProduct(item, newItem))
      
      if (existingItemIndex > -1) {
        // Nếu item đã tồn tại hoàn toàn giống nhau, gộp số lượng
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += newItem.quantity || 1
        
        // Đảm bảo item đã có uniqueKey
        if (!updatedItems[existingItemIndex].uniqueKey) {
          updatedItems[existingItemIndex].uniqueKey = generateUniqueKey(updatedItems[existingItemIndex])
        }
        
        // Đảm bảo giữ lại đường dẫn hình ảnh tốt nhất
        if (newItem.image && 
            (!updatedItems[existingItemIndex].image || 
             updatedItems[existingItemIndex].image === '/images/placeholder/product-placeholder.svg' ||
             updatedItems[existingItemIndex].image === '/images/placeholder/product-placeholder.jpg' ||
             updatedItems[existingItemIndex].image === '/images/product-placeholder.svg')) {
          updatedItems[existingItemIndex].image = newItem.image
        }
        
        return updatedItems
      } else {
        // Nếu là item mới hoặc có thuộc tính khác nhau, thêm vào mảng
        const itemImage = newItem.image || '/images/placeholder/product-placeholder.svg'
        // Kiểm tra đường dẫn hình ảnh
        const finalImage = itemImage.includes('/images/product-placeholder.svg') || 
                           itemImage.includes('/images/placeholder/product-placeholder.jpg') ? 
                           '/images/placeholder/product-placeholder.svg' : itemImage
        
        const itemWithUniqueKey = { 
          ...newItem, 
          image: finalImage,
          quantity: newItem.quantity || 1,
          version: newItem.version || undefined,
          options: newItem.options || undefined,
          uniqueKey: generateUniqueKey(newItem)
        }
        
        return [...prevItems, itemWithUniqueKey]
      }
    })

    console.log('🛒 Item added to cart:', newItem.name)
  }

  const removeItem = async (uniqueKey: string) => {
    setItems(prevItems => {
      const newItems = prevItems.filter(item => item.uniqueKey !== uniqueKey)
      console.log('🛒 Item removed from cart, uniqueKey:', uniqueKey)
      return newItems
    })
  }

  const updateQuantity = async (uniqueKey: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(uniqueKey)
      return
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.uniqueKey === uniqueKey ? { ...item, quantity } : item
      )
    )

    console.log('🛒 Cart quantity updated, uniqueKey:', uniqueKey, 'quantity:', quantity)
  }

  const clearCart = async () => {
    setItems([])
    console.log('🛒 Cart cleared')
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  
  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  )

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart,
      itemCount,
      totalAmount,
      isLoading,
      syncWithServer
    }}>
      {children}
    </CartContext.Provider>
  )
} 