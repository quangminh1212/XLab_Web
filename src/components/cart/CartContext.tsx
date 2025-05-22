'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  options?: string[]
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
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
        setItems(JSON.parse(savedCart))
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

  const addItem = (newItem: CartItem) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === newItem.id)
      
      if (existingItemIndex > -1) {
        // Nếu item đã tồn tại, tăng số lượng nhưng giữ nguyên hình ảnh cũ nếu có
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += newItem.quantity || 1
        
        // Đảm bảo giữ lại đường dẫn hình ảnh nếu đã tồn tại
        if (newItem.image && (!updatedItems[existingItemIndex].image || updatedItems[existingItemIndex].image === '/images/product-placeholder.svg')) {
          updatedItems[existingItemIndex].image = newItem.image
        }
        
        return updatedItems
      } else {
        // Nếu là item mới, thêm vào mảng và đảm bảo có đường dẫn hình ảnh
        const itemImage = newItem.image || '/images/placeholder/product-placeholder.jpg'
        return [...prevItems, { ...newItem, image: itemImage, quantity: newItem.quantity || 1 }]
      }
    })
  }

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
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