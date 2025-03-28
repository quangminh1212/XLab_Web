import { siteConfig } from '@/config/siteConfig'
import { MetadataRoute } from 'next'

// Các URL tĩnh của trang web
const routes = [
  '/',
  '/products',
  '/services',
  '/about',
  '/contact',
]

export default function sitemap(): MetadataRoute.Sitemap {
  // Lấy danh sách các URL tĩnh
  const routeEntries = routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '/' ? 1.0 : 0.8,
  })) as MetadataRoute.Sitemap

  return [...routeEntries]
} 