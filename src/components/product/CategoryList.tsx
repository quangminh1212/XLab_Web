'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  count?: number;
}

interface CategoryListProps {
  categories: Category[];
  title?: string;
  subtitle?: string;
  layout?: 'grid' | 'carousel';
  onCategoryClick?: (slug: string) => void;
}

const CategoryList = ({
  categories,
  title = 'Danh mục sản phẩm',
  subtitle,
  layout = 'grid',
  onCategoryClick,
}: CategoryListProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselItems, setCarouselItems] = useState<Category[]>([]);

  useEffect(() => {
    // Set up initial carousel items with clones for looping
    if (layout === 'carousel' && categories.length > 0) {
      setCarouselItems([...categories]);
    }
  }, [categories, layout]);

  const handleCategoryClick = (slug: string) => {
    if (onCategoryClick) {
      onCategoryClick(slug);
    }
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
          </div>
        )}

        {layout === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                onClick={() => handleCategoryClick(category.slug)}
                className="group block"
              >
                <div className="relative w-full pt-[100%] bg-gray-100 rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-md">
                  <Image
                    src={category.image || '/images/placeholder/category-placeholder.jpg'}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">
                        {category.name}
                      </h3>
                      {category.count !== undefined && (
                        <span className="text-white/80 text-xs">
                          {category.count} sản phẩm
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${activeIndex * 100}%)`,
                }}
              >
                {carouselItems.map((category, index) => (
                  <div
                    key={`${category.id}-${index}`}
                    className="w-full flex-shrink-0 px-2"
                  >
                    <Link
                      href={`/categories/${category.slug}`}
                      onClick={() => handleCategoryClick(category.slug)}
                      className="block"
                    >
                      <div className="relative aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={category.image || '/images/placeholder/category-placeholder.jpg'}
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                          <div>
                            <h3 className="text-white font-semibold text-xl">
                              {category.name}
                            </h3>
                            {category.description && (
                              <p className="text-white/80 text-sm mt-1 line-clamp-2">
                                {category.description}
                              </p>
                            )}
                            {category.count !== undefined && (
                              <span className="inline-block mt-2 px-3 py-1 bg-white/20 text-white text-sm rounded">
                                {category.count} sản phẩm
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md z-10"
              aria-label="Previous"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md z-10"
              aria-label="Next"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="flex justify-center mt-4">
              {categories.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full mx-1 ${
                    index === activeIndex ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryList; 