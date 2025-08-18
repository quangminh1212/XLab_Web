import fs from 'fs';
import path from 'path';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProductDetail from '@/app/products/[id]/ProductDetail';
import { products as mockProducts } from '@/data/mockData';
import { getAllProducts, normalizeLanguageCode } from '@/lib/i18n/products';
import { Product } from '@/models/ProductModel';
import { siteConfig } from '@/config/siteConfig';
import type { Product as MockProduct } from '@/types';

// Đảm bảo trang được render động với mỗi request
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  // Tìm bản ghi "dịch vụ" trong các nguồn dữ liệu (isAccount/type==='account')
  const language = 'vie';
  const i18nProducts = await getAllProducts(language);
  const all: Product[] = [...i18nProducts, ...mockProducts as any[]].map((p: any) => ({ ...p }));
  const service = all.find(p => (p.isAccount || p.type === 'account') && (p.slug === id || p.id === id));

  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || siteConfig.url).replace(/\/$/, '');
  if (!service) {
    return { title: `Dịch vụ không tồn tại | ${siteConfig.name}`, robots: { index: false, follow: false }, alternates: { canonical: `${baseUrl}/services/${id}` } };
  }

  const title = `${service.name} | ${siteConfig.name}`;
  const desc = (service as any).shortDescription || service.description || siteConfig.seo.defaultDescription;
  const image = Array.isArray(service.images) && service.images.length > 0
    ? (typeof service.images[0] === 'string' ? service.images[0] : (service.images[0].url || siteConfig.seo.ogImage))
    : (service.imageUrl || siteConfig.seo.ogImage);
  const url = `${baseUrl}/services/${service.slug || service.id}`;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title, description: desc, images: [{ url: image, width: 1200, height: 630, alt: service.name }] },
    twitter: { card: 'summary_large_image', title, description: desc, images: [image], creator: siteConfig.seo.twitterHandle },
  };
}

// Hàm chuyển đổi dữ liệu sản phẩm từ bất kỳ nguồn nào sang kiểu Product
function normalizeProduct(product: any): Product {
  // Đảm bảo các trường bắt buộc
  const normalizedProduct: Product = {
    id: product.id || '',
    name: product.name || '',
    slug: product.slug || '',
    description: product.description || '',
    shortDescription: product.shortDescription || '',
    // Đảm bảo specifications là mảng
    specifications: Array.isArray(product.specifications) 
      ? product.specifications 
      : product.specifications 
        ? Object.entries(product.specifications).map(([key, value]) => ({ key, value: String(value) }))
        : [],
    // Đảm bảo features là mảng
    features: Array.isArray(product.features)
      ? product.features
      : [],
    // Các trường khác
    ...product
  };
  
  return normalizedProduct;
}

// Đọc dữ liệu sản phẩm từ file JSON và thư mục i18n
async function getProducts(lang = 'vie'): Promise<Product[]> {
  try {
    // Lấy sản phẩm từ file products.json
    const dataFilePath = path.join(process.cwd(), 'products.json');
    let productsFromJson: any[] = [];
    
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, 'utf8');
      try {
        // Đảm bảo dữ liệu từ file JSON tuân thủ kiểu Product
        const parsedData = JSON.parse(fileContent);
        if (parsedData && parsedData.data && Array.isArray(parsedData.data)) {
          productsFromJson = parsedData.data;
        } else if (Array.isArray(parsedData)) {
          productsFromJson = parsedData;
        }
        // Normalize backslashes to forward slashes in image paths
        productsFromJson = productsFromJson.map((p: any) => ({
          ...p,
          images: Array.isArray(p.images) ? p.images.map((x: any) => typeof x === 'string' ? x.replace(/\\/g, '/') : x) : p.images,
          imageUrl: typeof p.imageUrl === 'string' ? p.imageUrl.replace(/\\/g, '/') : p.imageUrl,
        }));
      } catch (error) {
        console.error('Error parsing products.json:', error);
      }
    }
    
    // Lấy sản phẩm từ thư mục i18n theo ngôn ngữ
    const i18nProducts = await getAllProducts(lang);
    
    // Kết hợp sản phẩm từ cả hai nguồn, ưu tiên sản phẩm từ i18n
    const combinedProducts: Product[] = [];
    const productIds = new Set<string>();
    
    // Thêm sản phẩm từ i18n trước và chuẩn hóa
    for (const product of i18nProducts) {
      combinedProducts.push(normalizeProduct(product));
      productIds.add(product.id);
    }
    
    // Thêm sản phẩm từ products.json nếu chưa có trong i18n và chuẩn hóa
    for (const product of productsFromJson) {
      if (!productIds.has(product.id)) {
        combinedProducts.push(normalizeProduct(product));
        productIds.add(product.id);
      }
    }
    
    return combinedProducts;
  } catch (error) {
    console.error('Error reading products data:', error);
    return [];
  }
}

export default async function AccountPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params trước khi sử dụng thuộc tính của nó
  const { id: accountId } = await params;

  // Lấy ngôn ngữ từ headers hoặc mặc định là 'vie'
  // Trong môi trường server component, không thể trực tiếp lấy headers
  // Nên tạm thời sử dụng 'vie' làm mặc định
  const language = 'vie'; // Mặc định sử dụng tiếng Việt

  console.log(`Đang tìm kiếm dịch vụ với ID hoặc slug: ${accountId}`);

  // Lấy danh sách sản phẩm từ file JSON và i18n
  const productsFromJson = await getProducts(language);

  // Tìm kiếm trong products.json và i18n trước
  let selectedProduct = productsFromJson.find(
    (p) => p.slug === accountId && (p.isAccount || p.type === 'account'),
  );

  if (!selectedProduct) {
    selectedProduct = productsFromJson.find(
      (p) => p.id === accountId && (p.isAccount || p.type === 'account'),
    );
  }

  // Nếu không tìm thấy, tìm trong mockData
  if (!selectedProduct) {
    // Tìm theo slug trước
    const bySlug = (mockProducts as unknown as MockProduct[]).find(
      (p) => p.slug === accountId && (p.isAccount || p.type === 'account'),
    );
    if (bySlug) {
      selectedProduct = normalizeProduct(bySlug as any);
    }

    // Sau đó tìm theo id nếu không tìm thấy theo slug
    if (!selectedProduct) {
      const byId = (mockProducts as unknown as MockProduct[]).find(
        (p) => p.id === accountId && (p.isAccount || p.type === 'account'),
      );
      if (byId) {
        selectedProduct = normalizeProduct(byId as any);
      }
    }
  }

  // Thêm dữ liệu mẫu cho các sản phẩm CapCut Pro
  const sampleAccounts = [
    {
      id: 'capcut-pro',
      slug: 'capcut-pro',
      name: 'CapCut Pro',
      description: 'Tài khoản CapCut Pro với đầy đủ tính năng chỉnh sửa video chuyên nghiệp.',
      longDescription: `
        <h2>CapCut Pro - Giải pháp chỉnh sửa video hàng đầu</h2>
        <p>CapCut Pro cung cấp trải nghiệm chỉnh sửa video chuyên nghiệp với đầy đủ công cụ, hiệu ứng và tính năng cao cấp.</p>
        
        <h3>Lợi ích khi sử dụng tài khoản Pro:</h3>
        <ul>
          <li>Bỏ qua tất cả giới hạn của phiên bản miễn phí</li>
          <li>Truy cập thư viện hiệu ứng, nhạc và sticker cao cấp</li>
          <li>Xuất video chất lượng cao không có watermark</li>
          <li>Công cụ AI tiên tiến để tạo nội dung độc đáo</li>
          <li>Đồng bộ hóa dự án trên nhiều thiết bị</li>
        </ul>
        
        <h3>Hỗ trợ đa nền tảng:</h3>
        <p>Sử dụng CapCut Pro trên điện thoại, máy tính bảng và máy tính với cùng một tài khoản.</p>
      `,
      imageUrl: '/capcut.png',
      price: 290000,
      salePrice: 199000,
      rating: 4.8,
      downloadCount: 280,
      viewCount: 1200,
      categoryId: 'cat-3', // Phần mềm đồ họa
      isAccount: true,
      type: 'account',
      isFeatured: true,
      isNew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      size: 'Online',
      licenseType: 'Subscription',
      storeId: '3', // Creative Tools
      features: [
        'Tất cả các hiệu ứng và công cụ chỉnh sửa cao cấp',
        'Xuất video không giới hạn',
        'Không có logo watermark',
        'Thư viện hiệu ứng và âm thanh đầy đủ',
        'Sử dụng trên cả thiết bị di động và máy tính',
        'Hỗ trợ kỹ thuật 24/7',
        'Cập nhật tính năng mới ngay khi phát hành',
      ],
    },
    {
      id: 'capcut-pro-7days',
      slug: 'capcut-pro-7days',
      name: 'CapCut Pro - 7 Ngày',
      description:
        'Tài khoản CapCut Pro với đầy đủ tính năng chỉnh sửa video chuyên nghiệp. Gói 7 ngày lý tưởng để thử nghiệm hoặc hoàn thành dự án ngắn hạn.',
      longDescription: `
        <h2>CapCut Pro - Gói 7 ngày</h2>
        <p>Trải nghiệm đầy đủ các tính năng cao cấp của CapCut Pro trong 7 ngày với giá cực kỳ hấp dẫn.</p>
        
        <h3>Phù hợp cho:</h3>
        <ul>
          <li>Người muốn thử nghiệm trước khi mua dài hạn</li>
          <li>Dự án video ngắn hạn cần hoàn thành nhanh chóng</li>
          <li>Người làm video không thường xuyên</li>
        </ul>
      `,
      imageUrl: '/capcut.png',
      price: 99000,
      salePrice: 69000,
      rating: 4.7,
      downloadCount: 120,
      viewCount: 500,
      categoryId: 'cat-3', // Phần mềm đồ họa
      isAccount: true,
      type: 'account',
      isFeatured: true,
      isNew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      size: 'Online',
      licenseType: 'Subscription',
      storeId: '3', // Creative Tools
      features: [
        'Tất cả các hiệu ứng và công cụ chỉnh sửa cao cấp',
        'Xuất video không giới hạn',
        'Không có logo watermark',
        'Thư viện hiệu ứng và âm thanh đầy đủ',
        'Có thể sử dụng cho cả thiết bị di động và máy tính',
        'Hỗ trợ kỹ thuật 24/7',
      ],
    },
    {
      id: 'capcut-pro-1month',
      slug: 'capcut-pro-1month',
      name: 'CapCut Pro - 1 Tháng',
      description:
        'Tài khoản CapCut Pro với đầy đủ tính năng chỉnh sửa video chuyên nghiệp. Gói 1 tháng phù hợp cho các nhà sáng tạo nội dung thường xuyên.',
      longDescription: `
        <h2>CapCut Pro - Gói 1 tháng</h2>
        <p>Gói đăng ký 1 tháng phù hợp với những người làm nội dung thường xuyên nhưng không muốn cam kết dài hạn.</p>
        
        <h3>Lợi ích:</h3>
        <ul>
          <li>Linh hoạt với chi phí hàng tháng hợp lý</li>
          <li>Hủy bất cứ lúc nào</li>
          <li>Cập nhật tính năng mới thường xuyên</li>
        </ul>
      `,
      imageUrl: '/capcut.png',
      price: 290000,
      salePrice: 199000,
      rating: 4.8,
      downloadCount: 280,
      viewCount: 890,
      categoryId: 'cat-3', // Phần mềm đồ họa
      isAccount: true,
      type: 'account',
      isFeatured: true,
      isNew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      size: 'Online',
      licenseType: 'Subscription',
      storeId: '3', // Creative Tools
      features: [
        'Tất cả các hiệu ứng và công cụ chỉnh sửa cao cấp',
        'Xuất video không giới hạn',
        'Không có logo watermark',
        'Thư viện hiệu ứng và âm thanh đầy đủ',
        'Có thể sử dụng cho cả thiết bị di động và máy tính',
        'Hỗ trợ kỹ thuật 24/7',
        'Cập nhật tính năng mới ngay khi phát hành',
      ],
    },
    {
      id: 'capcut-pro-2years',
      slug: 'capcut-pro-2years',
      name: 'CapCut Pro - 2 Năm',
      description:
        'Tài khoản CapCut Pro dài hạn với đầy đủ tính năng chỉnh sửa video chuyên nghiệp. Gói 2 năm tiết kiệm tối đa, phù hợp cho các studio và nhà sáng tạo nội dung chuyên nghiệp.',
      longDescription: `
        <h2>CapCut Pro - Gói 2 năm</h2>
        <p>Giải pháp tiết kiệm nhất dành cho các nhà sáng tạo nội dung chuyên nghiệp và studio làm phim.</p>
        
        <h3>Ưu điểm vượt trội:</h3>
        <ul>
          <li>Tiết kiệm hơn 70% so với mua hàng tháng</li>
          <li>Không lo về việc gia hạn thường xuyên</li>
          <li>Đảm bảo hoàn tiền trong 30 ngày</li>
          <li>Hỗ trợ kỹ thuật ưu tiên</li>
        </ul>
      `,
      imageUrl: '/capcut.png',
      price: 1990000,
      salePrice: 1290000,
      rating: 4.9,
      downloadCount: 350,
      viewCount: 1100,
      categoryId: 'cat-3', // Phần mềm đồ họa
      isAccount: true,
      type: 'account',
      isFeatured: true,
      isNew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      size: 'Online',
      licenseType: 'Subscription',
      storeId: '3', // Creative Tools
      features: [
        'Tất cả các hiệu ứng và công cụ chỉnh sửa cao cấp',
        'Xuất video không giới hạn với độ phân giải 4K',
        'Không có logo watermark',
        'Thư viện hiệu ứng và âm thanh đầy đủ và cập nhật thường xuyên',
        'Có thể sử dụng cho cả thiết bị di động và máy tính',
        'Hỗ trợ kỹ thuật ưu tiên 24/7',
        'Cập nhật tính năng mới ngay khi phát hành',
        'Đảm bảo hoàn tiền 30 ngày',
        'Hỗ trợ đồng bộ đám mây không giới hạn',
        'Tiết kiệm hơn 70% so với mua hàng tháng',
      ],
    },
  ];

  // Tìm kiếm trong mảng sampleAccounts nếu không tìm thấy trong mockData và products.json
  if (!selectedProduct) {
    // Tìm theo slug trước
    const bySlugSample = sampleAccounts.find((p) => p.slug === accountId);
    if (bySlugSample) {
      selectedProduct = normalizeProduct(bySlugSample as any);
    }

    // Sau đó tìm theo id nếu cần
    if (!selectedProduct) {
      const byIdSample = sampleAccounts.find((p) => p.id === accountId);
      if (byIdSample) {
        selectedProduct = normalizeProduct(byIdSample as any);
      }
    }
  }

  // Nếu không tìm thấy sản phẩm, hiển thị trang not-found
  if (!selectedProduct) {
    console.log(`Không tìm thấy tài khoản với ID hoặc slug: ${accountId}`);
    return notFound();
  }

  // Ghi log thông tin truy cập
  console.log(
    `Người dùng đang xem tài khoản: ${selectedProduct.name} (ID: ${selectedProduct.id}, Slug: ${selectedProduct.slug})`,
  );

  // Truyền dữ liệu sản phẩm sang client component
  return <ProductDetail product={selectedProduct} />;
}
