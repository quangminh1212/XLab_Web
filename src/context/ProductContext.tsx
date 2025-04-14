'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category } from '@/types';
import { products as mockProducts, categories as mockCategories } from '@/data/mockData';

// Định nghĩa interface cho context
interface ProductContextType {
  products: Product[];
  categories: Category[];
  updateProducts: (newProducts: Product[]) => Promise<boolean>;
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (product: Product) => Promise<Product>;
  deleteProduct: (id: string | number) => Promise<boolean>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

// Tạo giá trị mặc định cho context để tránh lỗi undefined
const defaultContextValue: ProductContextType = {
  products: [],
  categories: [],
  updateProducts: async () => { console.warn("updateProducts called on default context"); return false; },
  addProduct: async () => { console.warn("addProduct called on default context"); throw new Error('Context not ready'); },
  updateProduct: async () => { console.warn("updateProduct called on default context"); throw new Error('Context not ready'); },
  deleteProduct: async () => { console.warn("deleteProduct called on default context"); return false; },
  setProducts: () => { console.warn("setProducts called on default context"); },
};

// Tạo context với giá trị mặc định
export const ProductContext = createContext<ProductContextType>(defaultContextValue);

// Hook để sử dụng context
export function useProducts() {
  const context = useContext(ProductContext);
  
  if (!context) {
    console.error("[useProducts] Context used outside of provider");
    throw new Error("useProducts must be used within a ProductProvider");
  }
  
  return context;
}

// Provider component
export function ProductProvider({ children }: { children: React.ReactNode }) {
  // Khởi tạo state từ dữ liệu mẫu hoặc từ localStorage nếu có
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isInitialized, setIsInitialized] = useState(false);

  // Tải dữ liệu từ API khi component được mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Trước tiên, thử lấy từ localStorage nếu có
        let initialProducts = [];
        if (typeof window !== 'undefined') {
          try {
            const savedProducts = localStorage.getItem('xlab_products');
            if (savedProducts) {
              initialProducts = JSON.parse(savedProducts);
              console.log("[ProductContext] Loaded products from localStorage:", initialProducts.length);
            }
          } catch (storageError) {
            console.error('[ProductContext] Error loading from localStorage:', storageError);
          }
        }

        // Nếu không có dữ liệu trong localStorage, lấy từ API
        if (initialProducts.length === 0) {
          console.log("[ProductContext] Fetching products from API");
          const response = await fetch('/api/products');
          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }
          initialProducts = await response.json();
          console.log("[ProductContext] Loaded products from API:", initialProducts.length);
          
          // Lưu vào localStorage
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('xlab_products', JSON.stringify(initialProducts));
            } catch (storageError) {
              console.error('[ProductContext] Error saving to localStorage:', storageError);
            }
          }
        }
        
        setProducts(initialProducts);
        setIsInitialized(true);
      } catch (error) {
        console.error("[ProductContext] Error initializing products:", error);
        // Fallback to mockData
        setProducts(mockProducts);
        setIsInitialized(true);
      }
    };
    
    initializeData();
  }, []);

  // Debug function để kiểm tra state
  const logState = (action: string, data?: any) => {
    console.log(`[ProductContext] ${action}:`, data || products);
  };

  // Cập nhật localStorage mỗi khi products thay đổi 
  useEffect(() => {
    if (!isInitialized) return; // Skip initial render
    
    if (typeof window !== 'undefined') {
      try {
        console.log("[ProductContext] Saving products to localStorage:", products.length);
        localStorage.setItem('xlab_products', JSON.stringify(products));
      } catch (error) {
        console.error('[ProductContext] Error saving to localStorage:', error);
      }
    }
  }, [products, isInitialized]);

  // Cập nhật toàn bộ danh sách sản phẩm - hữu ích khi cần reset hoặc bulk update
  const updateProducts = async (newProducts: Product[]): Promise<boolean> => {
    console.log("[ProductContext] Updating all products:", newProducts.length);
    
    try {
      // Direct state update without API call
      setProducts(newProducts);
      return true;
    } catch (error) {
      console.error("[ProductContext] Error updating all products:", error);
      throw new Error("Không thể cập nhật danh sách sản phẩm");
    }
  };

  // Thêm sản phẩm mới
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    console.log("[ProductContext] Adding product data:", productData);
    
    try {
      // Gọi API thêm sản phẩm
      console.log("[ProductContext] Sending POST request to API...");
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      
      console.log("[ProductContext] API response status:", response.status);
      
      // Lấy response body
      let responseData;
      try {
        responseData = await response.json();
        console.log("[ProductContext] API response data:", responseData);
      } catch (parseError) {
        console.error("[ProductContext] Error parsing response:", parseError);
        throw new Error("Không thể đọc phản hồi từ server");
      }
      
      // Kiểm tra response status
      if (!response.ok) {
        console.error("[ProductContext] API Error:", responseData);
        throw new Error(responseData.error || `Lỗi khi thêm sản phẩm: ${response.status}`);
      }
      
      // Bảo đảm responseData có đủ trường cần thiết của Product
      if (!responseData.id || !responseData.name) {
        console.error("[ProductContext] Invalid product data returned:", responseData);
        throw new Error("Dữ liệu sản phẩm trả về không hợp lệ");
      }
      
      // Lấy sản phẩm đã được thêm từ response
      const addedProduct = responseData as Product;
      console.log("[ProductContext] Product added via API:", addedProduct);
      
      // Cập nhật state
      setProducts(prevProducts => {
        const newProducts = [...prevProducts, addedProduct];
        console.log("[ProductContext] Products state after adding:", newProducts.length);
        return newProducts;
      });
      
      return addedProduct;
    } catch (error) {
      console.error("[ProductContext] Error in addProduct function:", error);
      throw error instanceof Error ? error : new Error("Lỗi không xác định khi thêm sản phẩm"); 
    }
  };

  // Cập nhật sản phẩm
  const updateProduct = async (product: Product): Promise<Product> => {
    console.log("[ProductContext] Updating product data:", product);
    
    try {
      // Normalize ID to string for comparison
      const productId = String(product.id);
      console.log("[ProductContext] Calling PATCH API for ID:", productId);
      
      // Gọi API cập nhật sản phẩm
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error(`[ProductContext] API Error updating product ${productId}:`, data);
        throw new Error(data.error || `Không thể cập nhật sản phẩm với ID ${productId}`);
      }
      
      // Lấy sản phẩm đã được cập nhật từ response
      const updatedProduct = data;
      console.log("[ProductContext] Product updated via API:", updatedProduct);
      
      // Cập nhật state
      setProducts(prevProducts => {
        const existingProductIndex = prevProducts.findIndex(p => String(p.id) === productId);
        
        if (existingProductIndex === -1) {
          console.error(`[ProductContext] Product with ID ${productId} not found in state after successful API update`);
          return prevProducts;
        }
        
        const updatedState = [...prevProducts];
        updatedState[existingProductIndex] = updatedProduct;
        console.log("[ProductContext] Products state after update:", updatedState.length);
        
        return updatedState;
      });
      
      return product;
    } catch (error) {
      console.error("[ProductContext] Error in updateProduct function:", error);
      throw error instanceof Error ? error : new Error("Lỗi không xác định khi cập nhật sản phẩm"); 
    }
  };

  // Xóa sản phẩm
  const deleteProduct = async (id: string | number): Promise<boolean> => {
    console.log("[ProductContext] Deleting product with ID:", id);
    
    try {
      // Normalize ID to string for comparison
      const productId = String(id);
      
      console.log("[ProductContext] Calling DELETE API for ID:", productId);
      // Gọi API xóa sản phẩm
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`[ProductContext] API Error deleting product ${productId}:`, errorData, response.status, response.statusText);
        throw new Error(errorData.error || `Không thể xóa sản phẩm với ID ${productId}`);
      }
      
      console.log("[ProductContext] Product deleted via API successfully for ID:", productId);
      
      // Cập nhật state - PHẢI ĐẢM BẢO STATE ĐƯỢC CẬP NHẬT
      setProducts(prevProducts => {
        const filtered = prevProducts.filter(p => String(p.id) !== productId);
        console.log("[ProductContext] Products state after deletion:", filtered.length);
        return filtered;
      });
      
      return true;
    } catch (error) {
      console.error("[ProductContext] Error in deleteProduct function:", error);
      throw error instanceof Error ? error : new Error("Lỗi không xác định khi xóa sản phẩm");
    }
  };

  // Tạo giá trị context
  const contextValue: ProductContextType = {
    products,
    categories,
    updateProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setProducts
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}

// Export cả context để tương thích với code khác (nếu có)
export default ProductContext; 