import fs from 'fs';
import path from 'path';
<<<<<<< HEAD
=======

>>>>>>> dev_26.fixUI
import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/siteConfig';

import { siteConfig } from '@/config/siteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
<<<<<<< HEAD
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || siteConfig.url;
=======
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || siteConfig.url).replace(/\/$/, '');
>>>>>>> dev_26.fixUI

  // Danh sách các trang tĩnh (vi-VN) + hreflang en-US
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1, alternates: { languages: { 'vi-VN': `${baseUrl}`, 'en-US': `${baseUrl}/en` } } },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8, alternates: { languages: { 'vi-VN': `${baseUrl}/about`, 'en-US': `${baseUrl}/en/about` } } },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9, alternates: { languages: { 'vi-VN': `${baseUrl}/products`, 'en-US': `${baseUrl}/en/products` } } },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9, alternates: { languages: { 'vi-VN': `${baseUrl}/services`, 'en-US': `${baseUrl}/en/services` } } },
    { url: `${baseUrl}/testimonials`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8, alternates: { languages: { 'vi-VN': `${baseUrl}/testimonials`, 'en-US': `${baseUrl}/en/testimonials` } } },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8, alternates: { languages: { 'vi-VN': `${baseUrl}/pricing`, 'en-US': `${baseUrl}/en/pricing` } } },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7, alternates: { languages: { 'vi-VN': `${baseUrl}/contact`, 'en-US': `${baseUrl}/en/contact` } } },
    { url: `${baseUrl}/support`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8, alternates: { languages: { 'vi-VN': `${baseUrl}/support`, 'en-US': `${baseUrl}/en/support` } } },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5, alternates: { languages: { 'vi-VN': `${baseUrl}/login`, 'en-US': `${baseUrl}/en/login` } } },
  ];

  // Trang động: sản phẩm và dịch vụ (account) từ cả products.json và i18n (vie/eng)
  const dynamicPages: MetadataRoute.Sitemap = [];
  const pushEntry = (href: string, lastMod?: Date) => {
    const hrefEn = href.replace(baseUrl, `${baseUrl}/en`);
    dynamicPages.push({
      url: href,
      lastModified: lastMod || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
<<<<<<< HEAD
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
=======
      alternates: { languages: { 'vi-VN': href, 'en-US': hrefEn } },
    });
  };

  try {
    // products.json (nếu có)
    const dataFilePath = path.join(process.cwd(), 'src/data/products.json');
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, 'utf8');
      const products = JSON.parse(fileContent) as Array<{ id: string; slug: string; updatedAt?: string; isPublished?: boolean; isAccount?: boolean; type?: string }>;

      for (const p of products) {
        if (typeof p.isPublished === 'boolean' && !p.isPublished) continue;
        const lastMod = p.updatedAt ? new Date(p.updatedAt) : new Date();
        const isAccount = p.isAccount || p.type === 'account';
        const href = isAccount ? `${baseUrl}/services/${p.slug || p.id}` : `${baseUrl}/products/${p.slug || p.id}`;
        pushEntry(href, lastMod);
      }
    }

    // i18n: vie + eng
    const locales = ['vie', 'eng'] as const;
    for (const loc of locales) {
      const dir = path.join(process.cwd(), `src/i18n/${loc}/product`);
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
        for (const f of files) {
          const raw = fs.readFileSync(path.join(dir, f), 'utf8');
          const p = JSON.parse(raw) as { id?: string; slug?: string; updatedAt?: string; isAccount?: boolean; type?: string };
          const idOrSlug = p.slug || p.id || f.replace(/\.json$/, '');
          const isAccount = p.isAccount || p.type === 'account';
          const href = isAccount ? `${baseUrl}/services/${idOrSlug}` : `${baseUrl}/products/${idOrSlug}`;
          pushEntry(href, p.updatedAt ? new Date(p.updatedAt) : undefined);

          // Thêm biến thể en-US dạng subpath
          const hrefEn = href.replace(baseUrl, `${baseUrl}/en`);
          dynamicPages.push({
            url: hrefEn,
            lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.65,
            alternates: { languages: { 'vi-VN': href, 'en-US': hrefEn } },
          });
        }
      }
    }
  } catch (e) {
    console.warn('sitemap: unable to load dynamic URLs', e);
>>>>>>> dev_26.fixUI
  }

  // Không đưa các trang nhạy cảm (login/checkout/cart/account/admin) vào sitemap
  return [...staticPages, ...dynamicPages];
}
