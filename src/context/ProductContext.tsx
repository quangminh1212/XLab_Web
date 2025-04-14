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
  return context;
}

// Provider component
export function ProductProvider({ children }: { children: React.ReactNode }) {
  // Khởi tạo state từ dữ liệu mẫu
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories] = useState<Category[]>(mockCategories);

  // Lưu trữ danh sách sản phẩm vào localStorage khi có thay đổi
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
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
          setProducts(parsedProducts);
        }
      } catch (error) {
        console.error('Lỗi khi phân tích dữ liệu sản phẩm từ localStorage:', error);
      }
    }
  }, []);

  // Cập nhật toàn bộ danh sách sản phẩm
  const updateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  // Thêm sản phẩm mới
  const addProduct = (product: Product) => {
    setProducts(prevProducts => [...prevProducts, product]);
  };

  // Cập nhật sản phẩm
  const updateProduct = (product: Product) => {
    setProducts(prevProducts => 
      prevProducts.map(p => p.id === product.id ? product : p)
    );
  };

  // Xóa sản phẩm
  const deleteProduct = (id: string | number) => {
    setProducts(prevProducts => 
      prevProducts.filter(p => p.id !== id)
    );
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