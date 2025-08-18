import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/siteConfig';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || siteConfig.url;
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/account/', '/checkout/', '/cart/', '/.well-known/'],
    },
    sitemap: `${baseUrl.replace(/\/$/, '')}/sitemap.xml`,
    host: baseUrl.replace(/\/$/, ''),
  };
}
