import { MetadataRoute } from 'next';
import path from 'path';
import fs from 'fs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://xlab.vn';

  // Danh sách các trang tĩnh
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
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
      changeFrequency: 'daily',
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
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ] as MetadataRoute.Sitemap;

  // Thêm các trang động từ thư mục dữ liệu sản phẩm
  const dynamicPages: MetadataRoute.Sitemap = [];
  
  try {
    // Lấy danh sách sản phẩm từ file JSON hoặc từ thư mục
    const productsDirectory = path.join(process.cwd(), 'data', 'products');
    
    // Kiểm tra xem thư mục có tồn tại không
    if (fs.existsSync(productsDirectory)) {
      const productFolders = fs.readdirSync(productsDirectory);
      
      // Duyệt qua các thư mục sản phẩm
      for (const productId of productFolders) {
        if (fs.statSync(path.join(productsDirectory, productId)).isDirectory()) {
          dynamicPages.push({
            url: `${baseUrl}/products/${productId}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error generating dynamic sitemap entries:', error);
  }

  // Gộp tất cả URL
  return [...staticPages, ...dynamicPages];
}
