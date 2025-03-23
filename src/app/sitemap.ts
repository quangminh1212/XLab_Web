import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://xlab.com';
  
  // Danh sách các trang tĩnh
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
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
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ] as MetadataRoute.Sitemap;

  // TODO: Thêm các trang động từ API hoặc database ở đây
  // Ví dụ: /products/[id], etc.
  
  // Có thể fetch dữ liệu từ API hoặc sử dụng dữ liệu tĩnh
  const dynamicPages = [] as MetadataRoute.Sitemap;
  /* Ví dụ:
  const productPages = (await fetchProducts()).map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  })) as MetadataRoute.Sitemap;
  */

  // Gộp tất cả URL
  return [...staticPages, ...dynamicPages];
} 