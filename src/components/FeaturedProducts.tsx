'use client';

import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  showMoreLink?: string;
  initialCount?: number;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ 
  products,
  title = "Sản phẩm nổi bật",
  showMoreLink = "/products",
  initialCount = 6
}) => {
  const [visibleProducts, setVisibleProducts] = useState(initialCount);
  
  const showMore = () => {
    setVisibleProducts(prev => Math.min(prev + 6, products.length));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {showMoreLink && visibleProducts >= products.length && (
            <a 
              href={showMoreLink}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Xem tất cả
            </a>
          )}
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <AnimatePresence>
            {products.slice(0, visibleProducts).map((product, index) => (
              <motion.div 
                key={product.id} 
                variants={item}
                className="h-full"
              >
                <ProductCard 
                  product={product} 
                  className="h-full"
                  priority={index < 3} // Prioritize loading for first 3 products
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {visibleProducts < products.length && (
          <div className="mt-10 text-center">
            <Button
              onClick={showMore}
              variant="outline"
              className="px-6"
            >
              Xem thêm sản phẩm
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts; 