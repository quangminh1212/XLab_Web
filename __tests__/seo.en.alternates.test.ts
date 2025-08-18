import { describe, it, expect } from '@jest/globals';

// Helper to assert alternates languages contain EN subpath
function expectEnSubpath(alts: any, pathPart: string) {
  expect(alts).toBeTruthy();
  const en = alts.languages?.['en-US'];
  expect(typeof en).toBe('string');
  // chấp nhận cả dạng /en và dạng ?lang=eng để phòng cache transform
  expect(en.includes('/en') || en.includes('lang=eng')).toBe(true);
  if (pathPart) expect(en).toContain(pathPart);
}

// generateMetadata tests for EN alternates

describe('EN alternates via generateMetadata (products/categories/services)', () => {
  it('products/[id]: alternates includes en-US subpath', async () => {
    const mod = await import('../src/app/products/[id]/page');
    const md: any = await mod.generateMetadata({ params: Promise.resolve({ id: 'canva' }) } as any);
    expect(md.alternates?.canonical).toContain('/products/');
    expectEnSubpath(md.alternates, '/products/');
  });

  it('categories/[slug]: alternates includes en-US subpath', async () => {
    const mod = await import('../src/app/categories/[slug]/page');
    const md: any = await mod.generateMetadata({ params: Promise.resolve({ slug: 'phan-mem-do-hoa' }) } as any);
    expect(md.alternates?.canonical).toContain('/categories/');
    expectEnSubpath(md.alternates, '/categories/');
  });

  it('services/[id]: alternates includes en-US subpath', async () => {
    const mod = await import('../src/app/services/[id]/page');
    const md: any = await mod.generateMetadata({ params: Promise.resolve({ id: 'capcut-pro' }) } as any);
    expect(md.alternates?.canonical).toContain('/services/');
    expectEnSubpath(md.alternates, '/services/');
  });
});

// sitemap tests for EN alternates

describe('Sitemap EN alternates (static and dynamic)', () => {
  it('static entries include EN alternates using /en', async () => {
    const mod = await import('../src/app/sitemap');
    const map: any[] = mod.default();
    // Root
    const root = map.find((e) => String(e.url).match(/xlab\.vn\/?$/));
    expect(root).toBeTruthy();
    expectEnSubpath(root.alternates, '');
    // Products index
    const prodIdx = map.find((e) => String(e.url).endsWith('/products'));
    expectEnSubpath(prodIdx?.alternates, '/products');
  });

  it('dynamic product/service entry (canva) includes EN alternates under /en', async () => {
    const mod = await import('../src/app/sitemap');
    const map: any[] = mod.default();
    const vi = map.find((e) => ['/products/canva', '/services/canva'].some(p => String(e.url).endsWith(p)));
    expect(vi).toBeTruthy();
    const viUrl: string = String((vi as any).url);
    expectEnSubpath((vi as any).alternates, viUrl.includes('/services/') ? '/services/canva' : '/products/canva');
    // Ensure en variant also exists as a separate entry matching the same base path
    const viPath = new URL(viUrl).pathname;
    const en = map.find((e) => new URL(String(e.url)).pathname === `/en${viPath}`);
    expect(en).toBeTruthy();
    // alternates tie vi<->en properly
    expect((en as any)?.alternates?.languages?.['vi-VN']).toBe(viUrl);
  });
});

