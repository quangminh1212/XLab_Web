import { describe, it, expect } from '@jest/globals';

// Smoke-check generateMetadata for dynamic routes

describe('generateMetadata for products/[id]', () => {
  it('returns canonical and title', async () => {
    const mod = await import('../src/app/products/[id]/page');
    const md = await mod.generateMetadata({ params: Promise.resolve({ id: 'canva' }) } as any);
    expect(md.title).toBeTruthy();
    expect((md as any).alternates?.canonical).toContain('/products/');
  });
});

describe('generateMetadata for categories/[slug]', () => {
  it('returns canonical and title', async () => {
    const mod = await import('../src/app/categories/[slug]/page');
    const md = await mod.generateMetadata({ params: Promise.resolve({ slug: 'phan-mem-do-hoa' }) } as any);
    expect(md.title).toBeTruthy();
    expect((md as any).alternates?.canonical).toContain('/categories/');
  });
});

describe('generateMetadata for services/[id]', () => {
  it('returns canonical and title (fallback to sample if needed)', async () => {
    const mod = await import('../src/app/services/[id]/page');
    const md = await mod.generateMetadata({ params: Promise.resolve({ id: 'capcut-pro' }) } as any);
    expect(md.title).toBeTruthy();
    expect((md as any).alternates?.canonical).toContain('/services/');
  });
});

