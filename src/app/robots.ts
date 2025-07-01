import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/account/', '/checkout/', '/cart/', '/.well-known/'],
    },
    sitemap: 'https://xlab.com/sitemap.xml',
    host: 'https://xlab.com',
  };
}
