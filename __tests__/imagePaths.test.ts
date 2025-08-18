import { describe, it, expect } from '@jest/globals';

// Avoid TS syntax in test file to keep Jest parser simple
const normalize = (url: string) => url.replace(/\\\\/g, '/');

describe('Image URL normalization', () => {
  it('replaces backslashes with forward slashes', () => {
    expect(normalize('\\\\images\\\\products\\\\canva\\\\a.png')).toBe('/images/products/canva/a.png');
    expect(normalize('/images/placeholder\\\\product-placeholder.jpg')).toBe('/images/placeholder/product-placeholder.jpg');
  });
});
