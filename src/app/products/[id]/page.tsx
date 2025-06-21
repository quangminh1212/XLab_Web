import { notFound } from 'next/navigation';
import { default as dynamicImport } from 'next/dynamic';
import { getTranslation } from '@/locales';

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

<<<<<<< HEAD
// Đọc dữ liệu sản phẩm từ file JSON
async function getProducts(): Promise<Product[]> {
  try {
    // Create a proper URL for server-side fetching
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const url = new URL('/api/products', baseUrl).toString();

    // Fetch products from API with proper URL
    const response = await fetch(url, { next: { revalidate: 60 } });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching products data:', error);
    return [];
  }
}

=======
>>>>>>> 8b81a835c3132e7388e78c2b20148965af49f470
// Server component sẽ tìm sản phẩm và chuyển dữ liệu sang client component
export default async function ProductPage({ params }: { params: { id: string } }) {
  try {
    // Lấy ID sản phẩm từ params
    const productId = params.id;

    console.log(`Đang tìm kiếm sản phẩm với ID hoặc slug: ${productId}`);

<<<<<<< HEAD
    // Lấy dữ liệu sản phẩm từ file JSON
    const products = await getProducts();
=======
    // Mặc định sử dụng tiếng Việt
    const language = 'vie';
    
    console.log(`Sử dụng ngôn ngữ: ${language} để tải sản phẩm`);
>>>>>>> 8b81a835c3132e7388e78c2b20148965af49f470

    // Tạo URL với ngôn ngữ được chọn
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/language/${productId}?lang=${language}`;
    
    // Lấy dữ liệu sản phẩm từ API
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.log(`Không tìm thấy sản phẩm với ID hoặc slug: ${productId}`);
      notFound();
    }
    
    const productData = await response.json();
    const product = productData.data;

<<<<<<< HEAD
    // Xác định categoryId cho sản phẩm liên quan
    const categoryId =
      product.categories && product.categories.length > 0 ? product.categories[0].id : undefined;
=======
    // Nếu không tìm thấy sản phẩm, hiển thị trang not-found
    if (!product) {
      console.log(`Không tìm thấy sản phẩm với ID hoặc slug: ${productId} trong response API`);
      notFound();
    }
>>>>>>> 8b81a835c3132e7388e78c2b20148965af49f470

    // Ghi log thông tin truy cập
    console.log(
      `Người dùng đang xem sản phẩm: ${product.name} (ID: ${product.id}, Slug: ${product.slug})`,
    );

    // Get translations for the default language (Vietnamese)
    const t = (key: string) => getTranslation(key, 'vie');

    // Truyền dữ liệu sản phẩm sang client component
    return (
      <>
        <DynamicProductDetail product={product} />

        {/* Phần chính sách bảo hành */}
        <div className="mt-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('product.warranty')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg">
                <div className="rounded-full bg-blue-100 p-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{t('product.warranty.days')}</h3>
                <p className="text-sm text-gray-600">{t('product.warranty.description')}</p>
              </div>

              <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg">
                <div className="rounded-full bg-green-100 p-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{t('product.support')}</h3>
                <p className="text-sm text-gray-600">{t('product.support.description')}</p>
              </div>

              <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg">
                <div className="rounded-full bg-purple-100 p-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{t('product.documentation')}</h3>
                <p className="text-sm text-gray-600">{t('product.documentation.description')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Phần thông tin hỗ trợ khách hàng */}
        <div className="mt-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-lg shadow-sm">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{t('product.needHelp')}</h2>
              <p className="text-gray-600">{t('product.supportDescription')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                <div className="rounded-full bg-blue-100 p-3 mb-3 mx-auto w-fit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{t('product.supportEmail')}</h3>
                <p className="text-sm text-gray-600 mb-3">{t('product.emailResponse')}</p>
                <a
                  href="mailto:support@xlab.vn"
                  className="text-primary-600 font-medium hover:text-primary-700"
                >
                  support@xlab.vn
                </a>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                <div className="rounded-full bg-green-100 p-3 mb-3 mx-auto w-fit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{t('product.supportPhone')}</h3>
                <p className="text-sm text-gray-600 mb-3">{t('product.phoneHours')}</p>
                <a
                  href="tel:+84901234567"
                  className="text-primary-600 font-medium hover:text-primary-700"
                >
                  090.123.4567
                </a>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                <div className="rounded-full bg-purple-100 p-3 mb-3 mx-auto w-fit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{t('product.liveChat')}</h3>
                <p className="text-sm text-gray-600 mb-3">{t('product.chatDescription')}</p>
                <button className="text-primary-600 font-medium hover:text-primary-700">
                  {t('product.startChat')}
                </button>
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
