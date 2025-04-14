'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category } from '@/types';
import { products as initialProducts } from '@/data/mockData';

interface ProductContextType {
  products: Product[];
  getProduct: (id: string | number) => Product | undefined;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'downloadCount' | 'viewCount' | 'rating'>) => Product;
  updateProduct: (id: string | number, product: Partial<Product>) => Product | undefined;
  deleteProduct: (id: string | number) => boolean;
  loading: boolean;
  error: string | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with mock data for now
    // In a real app, this would fetch from an API
    try {
      setProducts(initialProducts);
      setLoading(false);
    } catch (err) {
      setError('Không thể tải dữ liệu sản phẩm');
      setLoading(false);
    }
  }, []);

  const getProduct = (id: string | number) => {
    return products.find(product => product.id === id);
  };

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'downloadCount' | 'viewCount' | 'rating'>) => {
    const newProduct = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      downloadCount: 0,
      viewCount: 0,
      rating: 0,
    } as Product;
    
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id: string | number, updates: Partial<Product>) => {
    let updatedProduct: Product | undefined;
    
    setProducts(prev => {
      const newProducts = prev.map(product => {
        if (product.id === id) {
          updatedProduct = {
            ...product,
            ...updates,
            updatedAt: new Date().toISOString()
          };
          return updatedProduct;
        }
        return product;
      });
      
      return newProducts;
    });
    
    return updatedProduct;
  };

  const deleteProduct = (id: string | number) => {
    let deleted = false;
    
    setProducts(prev => {
      const index = prev.findIndex(product => product.id === id);
      if (index !== -1) {
        deleted = true;
        const newProducts = [...prev];
        newProducts.splice(index, 1);
        return newProducts;
      }
      return prev;
    });
    
    return deleted;
  };

  const value = {
    products,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    loading,
    error
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}; 