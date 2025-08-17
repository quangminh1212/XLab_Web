import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock language context
jest.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({ t: (k: string) => k, language: 'vi' }),
}));

// Mock cart context minimal
jest.mock('@/components/cart/CartContext', () => ({
  useCart: () => ({ addItem: jest.fn(), clearCart: jest.fn() }),
}));

// Stub next/image to regular img for tests
jest.mock('next/image', () => ({ __esModule: true, default: (props: any) => {
  // eslint-disable-next-line @next/next/no-img-element
  return React.createElement('img', { ...props, alt: props.alt || '' });
}}));

import ProductDetail from '../ProductDetail';

function makeProduct(overrides: Partial<any> = {}) {
  return {
    id: 'p1',
    name: 'Product 1',
    description: 'desc',
    shortDescription: 'short',
    images: ['/images/p1.png'],
    versions: [{ name: 'v1', price: 50, originalPrice: 100 }],
    productOptions: ['A', 'B'],
    defaultProductOption: 'A',
    optionPrices: {
      A: { price: 99, originalPrice: 199 },
      B: { price: 59, originalPrice: 159 },
    },
    slug: 'p1',
    rating: 4.5,
    reviewCount: 10,
    totalSold: 100,
    weeklyPurchases: 5,
    ...overrides,
  } as any;
}

describe('ProductDetail UI', () => {
  it('shows default option price, original price, and discount', () => {
    const product = makeProduct();
    render(React.createElement(ProductDetail, { product }));

    // Giá hiện tại (99)
    expect(screen.getByText(/99\s?₫|₫\s?99|99/)).toBeTruthy();

    // Giá gốc line-through (199)
    expect(screen.getByText(/199\s?₫|₫\s?199|199/)).toBeTruthy();

    // Discount: luôn hiển thị; nếu original <= price, UI fallback 80%, còn ở đây 199>99 nên hiển thị tính toán thật
    // Tỷ lệ xấp xỉ 50% (chính xác 50.25% -> làm tròn 50)
    expect(screen.getByText(/-50%/)).toBeTruthy();
  });

  it('changes price when selecting another option', () => {
    const product = makeProduct();
    render(React.createElement(ProductDetail, { product }));

    // Chọn option B nếu có selector render
    const optionBtn = screen.queryByText('B');
    if (optionBtn) {
      fireEvent.click(optionBtn);
    }

    // Sau khi đổi sang B, giá nên đổi sang 59
    expect(screen.getByText(/59\s?₫|₫\s?59|59/)).toBeTruthy();
  });
});

