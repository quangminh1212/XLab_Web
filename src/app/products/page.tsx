'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { industries, categories, products } from './data';
import './products.css';

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeIndustry, setActiveIndustry] = useState('all');
  const [activePriceRange, setActivePriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Lọc sản phẩm khi các bộ lọc thay đổi
  useEffect(() => {
    let result = [...products];

    // Lọc theo ngành
    if (activeIndustry !== 'all') {
      result = result.filter(product =>
        product.industry.includes(activeIndustry)
      );
    }

    // Lọc theo danh mục
    if (activeCategory !== 'all') {
      result = result.filter(product =>
        product.category === activeCategory
      );
    }

    // Lọc theo giá
    if (activePriceRange !== 'all') {
      switch (activePriceRange) {
        case 'low':
          result = result.filter(product => product.priceNumeric < 2000000);
          break;
        case 'medium':
          result = result.filter(product =>
            product.priceNumeric >= 2000000 && product.priceNumeric <= 3000000
          );
          break;
        case 'high':
          result = result.filter(product => product.priceNumeric > 3000000);
          break;
      }
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.shortDescription.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(result);
  }, [activeCategory, activeIndustry, activePriceRange, searchQuery]);

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1>Sản phẩm phần mềm</h1>
          <p>Khám phá các giải pháp phần mềm chất lượng cao của XLab</p>
        </div>

        <div className="products-filter">
          <div className="filter-options">
            <select
              name="industry"
              id="industry"
              value={activeIndustry}
              onChange={(e) => setActiveIndustry(e.target.value)}
            >
              {industries.map(industry => (
                <option key={industry.id} value={industry.id}>
                  {industry.name}
                </option>
              ))}
            </select>

            <select
              name="category"
              id="category"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              name="price"
              id="price"
              value={activePriceRange}
              onChange={(e) => setActivePriceRange(e.target.value)}
            >
              <option value="all">Tất cả giá</option>
              <option value="low">Dưới 2 triệu</option>
              <option value="medium">2 - 3 triệu</option>
              <option value="high">Trên 3 triệu</option>
            </select>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-primary">Tìm kiếm</button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-results">
            <h3>Không tìm thấy sản phẩm phù hợp</h3>
            <p>Vui lòng thử lại với bộ lọc khác</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setActiveCategory('all');
                setActiveIndustry('all');
                setActivePriceRange('all');
                setSearchQuery('');
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div className="product-card" key={product.id}>
                {(product.isNew || product.isBestSeller) && (
                  <div className="product-badge">
                    {product.isNew && <span className="badge-new">Mới</span>}
                    {product.isBestSeller && <span className="badge-bestseller">Bán chạy</span>}
                  </div>
                )}
                <div className="product-image">
                  {/* Placeholder cho hình ảnh sản phẩm */}
                  <div className="image-placeholder">
                    <span>{product.name.charAt(0)}</span>
                  </div>
                </div>
                <div className="product-content">
                  <h3>{product.name}</h3>
                  <p>{product.shortDescription}</p>
                  <div className="product-tags">
                    <span className="tag-category">{categories.find(c => c.id === product.category)?.name}</span>
                    {product.industry.slice(0, 2).map(ind => (
                      <span key={ind} className="tag-industry">
                        {industries.find(i => i.id === ind)?.name}
                      </span>
                    ))}
                  </div>
                  <ul className="product-features">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <div className="product-price">
                    <span className="price">{product.price}</span>
                    <Link href={`/products/${product.id}`} className="btn btn-primary">Chi tiết</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="pagination">
            <button className="btn btn-light">Trước</button>
            <div className="page-numbers">
              <button className="active">1</button>
              <button>2</button>
              <button>3</button>
            </div>
            <button className="btn btn-light">Sau</button>
          </div>
        )}
      </div>
    </div>
  );
} 