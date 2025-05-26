'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  totalAmount: 0,
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

  // Tải giỏ hàng từ localStorage khi component được mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        // Đảm bảo tất cả items có uniqueKey
        const cartWithUniqueKeys = parsedCart.map((item: CartItem) => ({
          ...item,
          uniqueKey: item.uniqueKey || generateUniqueKey(item)
        }))
        setItems(cartWithUniqueKeys)
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error)
      }
    }
    setLoaded(true)
  }, [])

  // Lưu giỏ hàng vào localStorage khi nó thay đổi
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items, loaded])

  // Hàm kiểm tra xem 2 sản phẩm có giống nhau không (bao gồm tất cả thuộc tính)
  const isSameProduct = (item1: CartItem, item2: CartItem): boolean => {
    return generateUniqueKey(item1) === generateUniqueKey(item2)
  }

  const addItem = (newItem: CartItem) => {
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
  }

  const removeItem = (uniqueKey: string) => {
    setItems(prevItems => prevItems.filter(item => item.uniqueKey !== uniqueKey))
  }

  const updateQuantity = (uniqueKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(uniqueKey)
      return
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.uniqueKey === uniqueKey ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
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
      totalAmount
    }}>
      {children}
    </CartContext.Provider>
  )
} 