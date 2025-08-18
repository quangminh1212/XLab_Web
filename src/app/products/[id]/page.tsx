import fs from 'fs';
import path from 'path';

import type { Metadata } from 'next';
import { default as dynamicImport } from 'next/dynamic';
import { notFound } from 'next/navigation';

import { siteConfig } from '@/config/siteConfig';
import { Product } from '@/models/ProductModel';

// Loading component đơn giản để hiển thị ngay lập tức
function ProductFallbackLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-200 w-full h-96 rounded-lg"></div>
          <div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-24 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Import các component với cơ chế lazy load
const DynamicProductDetail = dynamicImport(() => import('@/app/products/[id]/ProductDetail'), {
  loading: () => <ProductFallbackLoading />,
  ssr: true,
});

const DynamicProductFallback = dynamicImport(() => import('@/app/products/[id]/fallback'), {
  ssr: true,
});

// Đảm bảo trang được render động với mỗi request
export const dynamic = 'auto';
export const dynamicParams = true;

// Đọc dữ liệu sản phẩm từ file JSON
function getProducts(): Product[] {
  try {
    const dataFilePath = path.join(process.cwd(), 'src/data/products.json');
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2), 'utf8');
      return [];
    }
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading products data:', error);
    return [];
  }
}

// SEO: generateMetadata cho sản phẩm
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const products = getProducts();
  const product = products.find(p => p.slug === id) || products.find(p => p.id === id);

  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || siteConfig.url).replace(/\/$/, '');
  if (!product) {
    return {
      title: `Sản phẩm không tồn tại | ${siteConfig.name}`,
      description: siteConfig.seo.defaultDescription,
      alternates: { canonical: `${baseUrl}/products/${id}` },
      robots: { index: false, follow: false },
    };
  }

  const title = `${product.name} | ${siteConfig.name}`;
  const desc = product.shortDescription || product.description || siteConfig.seo.defaultDescription;
  const image = Array.isArray(product.images) && product.images.length > 0
    ? (typeof product.images[0] === 'string' ? product.images[0] : (product.images[0].url || siteConfig.seo.ogImage))
    : (product.imageUrl || siteConfig.seo.ogImage);
  const url = `${baseUrl}/products/${product.slug || product.id}`;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: 'product',
      url,
      title,
      description: desc,
      siteName: siteConfig.name,
      images: [{ url: image, width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [image],
      creator: siteConfig.seo.twitterHandle,
    },
  };
}

// Server component sẽ tìm sản phẩm và chuyển dữ liệu sang client component
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params trước khi sử dụng thuộc tính của nó
    const { id: productId } = await params;

    // tìm kiếm sản phẩm với ID hoặc slug: productId

    // Lấy dữ liệu sản phẩm từ file JSON
    const products = getProducts();

    // Tìm sản phẩm theo slug trước (ưu tiên tìm theo slug để cải thiện SEO)
    let product = products.find((p) => p.slug === productId);

    // Nếu không tìm thấy bằng slug, thử tìm bằng id
    if (!product) {
      product = products.find((p) => p.id === productId);
    }

    // Nếu không tìm thấy sản phẩm, hiển thị trang not-found
    if (!product) {
      // Không tìm thấy sản phẩm với ID hoặc slug: productId
      notFound();
    }

    // Xác định categoryId cho sản phẩm liên quan (không dùng hiện tại)
    // const categoryId = product.categories && product.categories.length > 0
    //   ? product.categories[0].id
    //   : undefined;

    // Chuẩn bị JSON-LD cho sản phẩm
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || siteConfig.url).replace(/\/$/, '');
    const image = Array.isArray(product.images) && product.images.length > 0
      ? (typeof product.images[0] === 'string' ? product.images[0] : (product.images[0].url || siteConfig.seo.ogImage))
      : (product.imageUrl || siteConfig.seo.ogImage);
    const price = (product as any).salePrice ?? (product as any).price ?? (product.versions?.[0] as any)?.price ?? undefined;

    const productLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.shortDescription || product.description,
      sku: product.id,
      image: image?.startsWith('http') ? image : `${baseUrl}${image}`,
      url: `${baseUrl}/products/${product.slug || product.id}`,
      aggregateRating: product.rating ? { '@type': 'AggregateRating', ratingValue: Number(product.rating), reviewCount: 10 } : undefined,
      offers: price ? { '@type': 'Offer', priceCurrency: siteConfig.payment?.currency || 'VND', price: Number(price), availability: 'https://schema.org/InStock', url: `${baseUrl}/products/${product.slug || product.id}` } : undefined,
      brand: { '@type': 'Brand', name: siteConfig.name },
    };

    // Truyền dữ liệu sản phẩm sang client component
    return (
      <>
        <DynamicProductDetail product={product} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />

        {/* Phần chính sách bảo hành */}
        <div className="mt-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Chính sách bảo hành</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg">
                <div className="rounded-full bg-blue-100 p-3 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Bảo hành 30 ngày</h3>
                <p className="text-sm text-gray-600">Hoàn tiền hoặc đổi sản phẩm nếu không hài lòng trong vòng 30 ngày</p>
              </div>

              <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg">
                <div className="rounded-full bg-green-100 p-3 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Hỗ trợ 24/7</h3>
                <p className="text-sm text-gray-600">Đội ngũ hỗ trợ kỹ thuật luôn sẵn sàng giúp đỡ bạn mọi lúc</p>
              </div>

              <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg">
                <div className="rounded-full bg-purple-100 p-3 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Tài liệu đầy đủ</h3>
                <p className="text-sm text-gray-600">Hướng dẫn sử dụng chi tiết và tài liệu tham khảo đầy đủ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Phần thông tin hỗ trợ khách hàng */}
        <div className="mt-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-lg shadow-sm">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Cần hỗ trợ thêm về sản phẩm?</h2>
              <p className="text-gray-600">Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                <div className="rounded-full bg-blue-100 p-3 mb-3 mx-auto w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Email hỗ trợ</h3>
                <p className="text-sm text-gray-600 mb-3">Phản hồi trong vòng 24 giờ</p>
                <a href="mailto:support@xlab.vn" className="text-primary-600 font-medium hover:text-primary-700">support@xlab.vn</a>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                <div className="rounded-full bg-green-100 p-3 mb-3 mx-auto w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Hotline</h3>
                <p className="text-sm text-gray-600 mb-3">Hỗ trợ từ 8h-22h hàng ngày</p>
                <a href="tel:+84901234567" className="text-primary-600 font-medium hover:text-primary-700">090.123.4567</a>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                <div className="rounded-full bg-purple-100 p-3 mb-3 mx-auto w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Live Chat</h3>
                <p className="text-sm text-gray-600 mb-3">Chat trực tiếp với nhân viên hỗ trợ</p>
                <button className="text-primary-600 font-medium hover:text-primary-700">Bắt đầu chat</button>
              </div>
            </div>
          </div>
        </div>

        <div id="fallback-container" style={{ display: 'none' }}>
          <DynamicProductFallback />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              setTimeout(function() {
                if (document.querySelector('.product-detail-loaded') === null) {
                  document.getElementById('fallback-container').style.display = 'block';
                }
              }, 2000);
            `,
          }}
        />
      </>
    );
  } catch (error) {
    console.error('Error in ProductPage:', error);
    return <DynamicProductFallback />;
  }
}
