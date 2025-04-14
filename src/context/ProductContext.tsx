'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category } from '@/types';
import { products as mockProducts, categories as mockCategories } from '@/data/mockData';

// Định nghĩa interface cho context
interface ProductContextType {
  products: Product[];
  categories: Category[];
  updateProducts: (newProducts: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string | number) => void;
}

// Tạo giá trị mặc định cho context để tránh lỗi undefined
const defaultContextValue: ProductContextType = {
  products: [],
  categories: [],
  updateProducts: () => {},
  addProduct: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
};

// Tạo context với giá trị mặc định
export const ProductContext = createContext<ProductContextType>(defaultContextValue);

// Hook để sử dụng context
export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}

// Provider component
export function ProductProvider({ children }: { children: React.ReactNode }) {
  // Khởi tạo state từ dữ liệu mẫu
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories] = useState<Category[]>(mockCategories);
  const [isInitialized, setIsInitialized] = useState(false);

  // Khôi phục danh sách sản phẩm từ localStorage khi component được mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const savedProducts = localStorage.getItem('xlab_products');
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts);
          console.log("Loaded products from localStorage:", parsedProducts);
          setProducts(parsedProducts);
        } else {
          // Nếu không có sản phẩm được lưu, sử dụng dữ liệu mẫu
          setProducts(mockProducts);
          localStorage.setItem('xlab_products', JSON.stringify(mockProducts));
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Lỗi khi phân tích dữ liệu sản phẩm từ localStorage:', error);
        // Fallback to mock data
        setProducts(mockProducts);
        setIsInitialized(true);
      }
    }
  }, [isInitialized]);

  // Cập nhật toàn bộ danh sách sản phẩm
  const updateProducts = (newProducts: Product[]) => {
    console.log("[ProductContext] Updating all products:", newProducts);
    setProducts(newProducts);
    
    // Lưu vào localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('xlab_products', JSON.stringify(newProducts));
    }
  };

  // Thêm sản phẩm mới
  const addProduct = (product: Product) => {
    console.log("[ProductContext] Adding product:", product);
    try {
      // Đảm bảo ID là duy nhất
      const productWithId = {
        ...product,
        id: product.id || `prod-${Date.now()}`,
      };
      
      // Cập nhật state và localStorage
      const newProducts = [...products, productWithId];
      setProducts(newProducts);
      
      // Lưu vào localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('xlab_products', JSON.stringify(newProducts));
      }
      
      return true;
    } catch (error) {
      console.error("[ProductContext] Error adding product:", error);
      throw new Error("Không thể thêm sản phẩm. Vui lòng thử lại.");
    }
  };

  // Cập nhật sản phẩm
  const updateProduct = (product: Product) => {
    console.log("[ProductContext] Updating product:", product);
    
    try {
      // Normalize ID to string for comparison
      const productId = String(product.id);
      
      // Kiểm tra sản phẩm tồn tại hay không
      const existingProductIndex = products.findIndex(p => String(p.id) === productId);
      
      if (existingProductIndex === -1) {
        console.error(`[ProductContext] Product with ID ${productId} not found`);
        throw new Error(`Không tìm thấy sản phẩm với ID ${productId}`);
      }
      
      // Tạo bản sao mới của mảng sản phẩm và cập nhật sản phẩm
      const updatedProducts = [...products];
      updatedProducts[existingProductIndex] = {
        ...updatedProducts[existingProductIndex],
        ...product,
        updatedAt: new Date().toISOString()
      };
      
      // Cập nhật state và localStorage
      setProducts(updatedProducts);
      
      // Lưu vào localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('xlab_products', JSON.stringify(updatedProducts));
      }
      
      return true;
    } catch (error) {
      console.error("[ProductContext] Error updating product:", error);
      throw error;
    }
  };

  // Xóa sản phẩm
  const deleteProduct = (id: string | number) => {
    console.log("[ProductContext] Deleting product with ID:", id);
    
    try {
      // Normalize ID to string for comparison
      const productId = String(id);
      
      // Kiểm tra sản phẩm tồn tại hay không
      const existingProduct = products.find(p => String(p.id) === productId);
      
      if (!existingProduct) {
        console.error(`[ProductContext] Product with ID ${productId} not found for deletion`);
        throw new Error(`Không tìm thấy sản phẩm với ID ${productId} để xóa`);
      }
      
      // Lọc sản phẩm cần xóa và cập nhật state
      const filteredProducts = products.filter(p => String(p.id) !== productId);
      setProducts(filteredProducts);
      
      // Lưu vào localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('xlab_products', JSON.stringify(filteredProducts));
      }
      
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