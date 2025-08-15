import { describe, it, expect } from '@jest/globals';

const normalize = (url: string) => url.replace(/\\/g, '/');

describe('Image URL normalization', () => {
  it('replaces backslashes with forward slashes', () => {
    expect(normalize('\\images\\products\\canva\\a.png')).toBe('/images/products/canva/a.png');
    expect(normalize('/images/placeholder\\product-placeholder.jpg')).toBe('/images/placeholder/product-placeholder.jpg');
  });
});

