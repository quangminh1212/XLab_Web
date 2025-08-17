import { describe, it, expect } from '@jest/globals';
import React from 'react';

import { getDisplayPrices, getCheapestPrice, getOriginalOfCheapest } from '@/features/products/services/pricing';

describe('ProductDetail pricing helpers integration', () => {
  it('getCheapestPrice and getOriginalOfCheapest align on versions', () => {
    const product = {
      versions: [
        { name: 'v1', price: 50, originalPrice: 100 },
        { name: 'v2', price: 30, originalPrice: 80 },
      ],
    };
    expect(getCheapestPrice(product)).toBe(30);
    expect(getOriginalOfCheapest(product)).toBe(80);
  });

  it('getDisplayPrices respects default option', () => {
    const product = {
      defaultProductOption: 'A',
      optionPrices: {
        A: { price: 99, originalPrice: 199 },
        B: { price: 59, originalPrice: 129 },
      },
    };
    expect(getDisplayPrices(product)).toEqual({ price: 99, originalPrice: 199 });
  });
});

