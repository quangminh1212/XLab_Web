import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/product/ProductCard';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));

jest.mock('@/components/cart/CartContext', () => ({
  useCart: () => ({ addItem: jest.fn(), clearCart: jest.fn() }),
}));

jest.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({ t: (k: string) => k, language: 'vie' }),
}));

describe('ProductCard', () => {
  it('renders plain text for HTML description', () => {
    render(
      <ProductCard
        id="p1"
        name="Test Product"
        description={'<p>Hello <strong>World</strong></p>'}
        price={100}
        originalPrice={200}
        image={'/images/placeholder/product-placeholder.jpg'}
        category={'cat1'}
        rating={0}
        weeklyPurchases={0}
        totalSold={0}
      />
    );

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});

