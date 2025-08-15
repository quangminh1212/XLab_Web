import { getAllProducts } from '@/lib/i18n/products';

jest.mock('fs', () => ({
  existsSync: jest.fn(() => true),
  readdirSync: jest.fn(() => ['a.json']),
  readFileSync: jest.fn(() => JSON.stringify({
    id: 'a', name: 'A', slug: 'a', images: ['blob:temp'], versions: [{ price: 100, originalPrice: 200 }],
  })),
}));

jest.mock('path', () => ({
  join: (...args: string[]) => args.join('/'),
}));

describe('getAllProducts basic behavior', () => {
  it('reads products and returns array', async () => {
    const res = await getAllProducts('eng');
    expect(Array.isArray(res)).toBe(true);
    expect(res[0].id).toBe('a');
  });
});

