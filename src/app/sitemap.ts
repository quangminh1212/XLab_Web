import fs from 'fs';
import path from 'path';

import { MetadataRoute } from 'next';

import { siteConfig } from '@/config/siteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || siteConfig.url).replace(/\/$/, '');

  // Danh sách các trang tĩnh
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/testimonials`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/support`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Trang động: sản phẩm và dịch vụ (account)
  const dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const dataFilePath = path.join(process.cwd(), 'src/data/products.json');
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, 'utf8');
      const products = JSON.parse(fileContent) as Array<{ id: string; slug: string; updatedAt?: string; isPublished?: boolean; isAccount?: boolean; type?: string }>;

      for (const p of products) {
        // Bỏ qua sản phẩm chưa phát hành nếu có cờ isPublished
        if (typeof p.isPublished === 'boolean' && !p.isPublished) continue;

        const lastMod = p.updatedAt ? new Date(p.updatedAt) : new Date();
        const isAccount = p.isAccount || p.type === 'account';
        const href = isAccount ? `${baseUrl}/services/${p.slug || p.id}` : `${baseUrl}/products/${p.slug || p.id}`;
        dynamicPages.push({
          url: href,
          lastModified: lastMod,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }
  } catch (e) {
    console.warn('sitemap: unable to load dynamic product URLs', e);
  }

  // Gộp tất cả URL
  return [...staticPages, ...dynamicPages];
}
