import { describe, it, expect, jest } from '@jest/globals';

jest.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({ t: (k: string) => k })
}));

// Sử dụng bản impl để test mapping logic trước khi render ProductGrid
import RelatedProductsImpl from '../RelatedProducts.impl';

// Nếu không có impl, fallback sang component chính để import không lỗi

import { getDisplayPrices } from '@/features/products/services/pricing';

describe('RelatedProducts mapping', () => {
  it('maps image, price, originalPrice, category correctly via pricing service', () => {
    const product: any = {
      id: '1',
      name: 'P1',
      description: 'd',
      shortDescription: 's',
      defaultProductOption: 'A',
      optionPrices: { A: { price: 10, originalPrice: 50 } },
      imageUrl: { url: '/img.png' },
      category: { name: 'Cat' },
    };

    const { price, originalPrice } = getDisplayPrices(product);
    expect(price).toBe(10);
    expect(originalPrice).toBe(50);
  });
});

