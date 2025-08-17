import { describe, it, expect } from '@jest/globals';
import { getDisplayPrices, getCheapestPrice, getOriginalOfCheapest } from '../pricing';

describe('pricing service', () => {
  it('prefers default option for display prices', () => {
    const p = { defaultProductOption: 'A', optionPrices: { A: { price: 10, originalPrice: 50 } } };
    expect(getDisplayPrices(p)).toEqual({ price: 10, originalPrice: 50 });
  });

  it('falls back to versions when no default option', () => {
    const p = { versions: [{ name: 'v1', price: 30, originalPrice: 100 }, { name: 'v2', price: 20, originalPrice: 60 }] };
    expect(getDisplayPrices(p)).toEqual({ price: 20, originalPrice: 60 });
  });

  it('falls back to product price and 5x when original invalid', () => {
    const p = { price: 40, originalPrice: 0 };
    expect(getDisplayPrices(p)).toEqual({ price: 40, originalPrice: 200 });
  });

  it('cheapest price finds from optionPrices/versions/price', () => {
    const p = { optionPrices: { A: { price: 70 }, B: { price: 30 } }, versions: [{ name: 'v1', price: 50, originalPrice: 70 }], price: 60 };
    expect(getCheapestPrice(p)).toBe(30);
  });

  it('original of cheapest maps correctly (option case)', () => {
    const p = { optionPrices: { A: { price: 30, originalPrice: 90 } } };
    expect(getOriginalOfCheapest(p)).toBe(90);
  });

  it('original of cheapest maps correctly (version case)', () => {
    const p = { versions: [{ name: 'v', price: 30, originalPrice: 80 }] };
    expect(getOriginalOfCheapest(p)).toBe(80);
  });

  it('original of cheapest falls back to 5x', () => {
    const p = { price: 10, originalPrice: 0 };
    expect(getOriginalOfCheapest(p)).toBe(50);
  });
});

