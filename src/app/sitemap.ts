import fs from 'fs';
import path from 'path';
import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/siteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || siteConfig.url;

  // Danh sách các trang tĩnh
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ] as MetadataRoute.Sitemap;

  // Các trang nhạy cảm không index
  const sensitiveNoIndex = [
    `${baseUrl}/login`,
    `${baseUrl}/checkout`,
    `${baseUrl}/cart`,
    `${baseUrl}/account`,
    `${baseUrl}/admin`,
  ].map((url) => ({ url, changeFrequency: 'never', priority: 0.1 }));

  // Thêm các trang động: sản phẩm từ src/data/products.json
  const dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const productsPath = path.join(process.cwd(), 'src/data/products.json');
    if (fs.existsSync(productsPath)) {
      const content = fs.readFileSync(productsPath, 'utf8');
      const products = JSON.parse(content) as Array<{ id?: string; slug?: string; updatedAt?: string | Date; isPublished?: boolean }>;
      products
        .filter((p) => (p as any).isPublished !== false)
        .forEach((p) => {
          const slugOrId = p.slug || p.id;
          if (!slugOrId) return;
          dynamicPages.push({
            url: `${baseUrl}/products/${slugOrId}`,
            lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        });
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('sitemap: cannot load products.json', err);
    }
  }

  // Không đưa các trang nhạy cảm (login/checkout/cart/account/admin) vào sitemap
  return [...staticPages, ...dynamicPages];
}
