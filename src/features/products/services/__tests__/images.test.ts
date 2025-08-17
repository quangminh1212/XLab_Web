import { describe, it, expect } from '@jest/globals';
import { getValidImageUrl } from '../images';

describe('getValidImageUrl', () => {
  it('returns placeholder when product is null/undefined', () => {
    expect(getValidImageUrl(null as any)).toBe('/images/placeholder/product-placeholder.svg');
    expect(getValidImageUrl(undefined as any)).toBe('/images/placeholder/product-placeholder.svg');
  });

  it('normalizes backslashes and rejects blob/undefined/empty', () => {
    expect(getValidImageUrl({ images: ['\\a\\b.png'] } as any)).toBe('/a/b.png');
    expect(getValidImageUrl({ images: ['blob:xyz'] } as any)).toBe('/images/placeholder/product-placeholder.svg');
    expect(getValidImageUrl({ images: ['undefined.png'] } as any)).toBe('/images/placeholder/product-placeholder.svg');
    expect(getValidImageUrl({ images: [''] } as any)).toBe('/images/placeholder/product-placeholder.svg');
  });

  it('uses imageUrl when images array invalid', () => {
    expect(getValidImageUrl({ images: [], imageUrl: '/ok.png' } as any)).toBe('/ok.png');
    expect(getValidImageUrl({ images: [], imageUrl: 'http://x/ok.png' } as any)).toBe('http://x/ok.png');
  });

  it('accepts object with url in images[0]', () => {
    expect(getValidImageUrl({ images: [{ url: '/x.png' }] } as any)).toBe('/x.png');
  });
});

