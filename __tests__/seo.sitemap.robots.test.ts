import { describe, it, expect } from '@jest/globals';

// Lightweight tests to ensure sitemap/robots modules load and produce expected shapes

describe('robots.ts export', () => {
  it('exports a function that returns robots config with sitemap and host', async () => {
    const mod = await import('../src/app/robots');
    const robots = mod.default();
    expect(robots.rules).toBeTruthy();
    expect(typeof robots.sitemap === 'string').toBe(true);
    expect(typeof robots.host === 'string').toBe(true);
  });
});

describe('sitemap.ts export', () => {
  it('exports a function that returns an array of URL entries', async () => {
    const mod = await import('../src/app/sitemap');
    const map = mod.default();
    expect(Array.isArray(map)).toBe(true);
    // Must include home page
    const hasHome = map.some((e) => {
      const u = (e && e.url) || '';
      return typeof u === 'string' && (/\/$/.test(u) || /xlab\.vn\/?$/.test(u));
    });
    expect(hasHome).toBeTruthy();
  });
});

