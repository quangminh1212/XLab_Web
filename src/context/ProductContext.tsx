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
}

// Tạo giá trị mặc định cho context để tránh lỗi undefined
const defaultContextValue: ProductContextType = {
  products: [],
  categories: [],
  updateProducts: async () => { console.warn("updateProducts called on default context"); return false; },
  addProduct: async () => { console.warn("addProduct called on default context"); throw new Error('Context not ready'); },
  updateProduct: async () => { console.warn("updateProduct called on default context"); throw new Error('Context not ready'); },
  deleteProduct: async () => { console.warn("deleteProduct called on default context"); return false; },
};

// Tạo context với giá trị mặc định
export const ProductContext = createContext<ProductContextType>(defaultContextValue);

// Hook để sử dụng context
export function useProducts() {
  const context = useContext(ProductContext);
  return context;
}

// Provider component
export function ProductProvider({ children }: { children: React.ReactNode }) {
  // Khởi tạo state từ dữ liệu mẫu
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories] = useState<Category[]>(mockCategories);

  // Debug function để kiểm tra state
  const logState = (action: string, data?: any) => {
    console.log(`[ProductContext] ${action}:`, data || products);
  };

  // Lưu trữ danh sách sản phẩm vào localStorage khi có thay đổi
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        console.log("Saving products to localStorage:", products);
        localStorage.setItem('xlab_products', JSON.stringify(products));
      } catch (error) {
        console.error('Lỗi khi lưu vào localStorage:', error);
      }
    }
  }, [products]);

  // Khôi phục danh sách sản phẩm từ localStorage khi component được mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedProducts = localStorage.getItem('xlab_products');
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts);
          console.log("Loaded products from localStorage:", parsedProducts);
          setProducts(parsedProducts);
        }
      } catch (error) {
        console.error('Lỗi khi phân tích dữ liệu sản phẩm từ localStorage:', error);
      }
    }
  }, []);

  // Cập nhật toàn bộ danh sách sản phẩm
  const updateProducts = async (newProducts: Product[]) => {
    console.log("[ProductContext] Updating all products:", newProducts);
    
    try {
      // Cập nhật state
      setProducts(newProducts);
      
      // Lưu vào localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('xlab_products', JSON.stringify(newProducts));
      }
      
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
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // Gửi dữ liệu không bao gồm id, createdAt, updatedAt
        body: JSON.stringify(productData) 
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("[ProductContext] API Error adding product:", errorData);
        throw new Error(errorData.error || "Không thể thêm sản phẩm");
      }
      
      // Lấy sản phẩm đã được thêm từ response (bao gồm id và timestamps được tạo bởi server)
      const addedProduct = await response.json();
      console.log("[ProductContext] Product added via API:", addedProduct);
      
      // Cập nhật state với sản phẩm đầy đủ
      setProducts(prevProducts => {
        const newProducts = [...prevProducts, addedProduct];
        console.log("[ProductContext] Products state after adding:", newProducts);
        
        // Lưu vào localStorage
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('xlab_products', JSON.stringify(newProducts));
          } catch (storageError) {
            console.error("[ProductContext] Error saving to localStorage after add:", storageError);
          }
        }
        
        return newProducts;
      });
      
      return addedProduct;
    } catch (error) {
      console.error("[ProductContext] Error in addProduct function:", error);
      // Ném lỗi ra ngoài để component có thể bắt và hiển thị
      throw error instanceof Error ? error : new Error("Lỗi không xác định khi thêm sản phẩm"); 
    }
  };

  // Cập nhật sản phẩm
  const updateProduct = async (product: Product) => {
    console.log("[ProductContext] Updating product:", product);
    
    try {
      // Normalize ID to string for comparison
      const productId = String(product.id);
      
      // Gọi API cập nhật sản phẩm
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Không thể cập nhật sản phẩm với ID ${productId}`);
      }
      
      // Lấy sản phẩm đã được cập nhật từ response
      const updatedProduct = await response.json();
      
      // Cập nhật state
      setProducts(prevProducts => {
        // Tìm sản phẩm trong danh sách
        const existingProductIndex = prevProducts.findIndex(p => String(p.id) === productId);
        
        // Nếu không tìm thấy sản phẩm
        if (existingProductIndex === -1) {
          console.error(`[ProductContext] Product with ID ${productId} not found`);
          throw new Error(`Không tìm thấy sản phẩm với ID ${productId}`);
        }
        
        // Cập nhật sản phẩm
        const updated = [...prevProducts];
        updated[existingProductIndex] = updatedProduct;
        
        console.log("[ProductContext] Products after update:", updated);
        
        // Lưu vào localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('xlab_products', JSON.stringify(updated));
        }
        
        return updated;
      });
      
      return updatedProduct;
    } catch (error) {
      console.error("[ProductContext] Error updating product:", error);
      throw error;
    }
  };

  // Xóa sản phẩm
  const deleteProduct = async (id: string | number) => {
    console.log("[ProductContext] Deleting product with ID:", id);
    
    try {
      // Normalize ID to string for comparison
      const productId = String(id);
      
      // Kiểm tra xem sản phẩm có tồn tại
      const existingProduct = products.find(p => String(p.id) === productId);
      
      if (!existingProduct) {
        console.error(`[ProductContext] Product with ID ${productId} not found for deletion`);
        throw new Error(`Không tìm thấy sản phẩm với ID ${productId} để xóa`);
      }
      
      // Gọi API xóa sản phẩm
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Không thể xóa sản phẩm với ID ${productId}`);
      }
      
      // Cập nhật state
      setProducts(prevProducts => {
        // Xóa sản phẩm
        const filtered = prevProducts.filter(p => String(p.id) !== productId);
        console.log("[ProductContext] Products after deletion:", filtered);
        
        // Lưu vào localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('xlab_products', JSON.stringify(filtered));
        }
        
        return filtered;
      });
      
      return true;
    } catch (error) {
      console.error("[ProductContext] Error deleting product:", error);
      throw error;
    }
  };

  // Tạo giá trị context
  const contextValue: ProductContextType = {
    products,
    categories,
    updateProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}

// Export cả context để tương thích với code khác (nếu có)
export default ProductContext; 