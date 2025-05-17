import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { Product } from '@/models/ProductModel';
import { default as dynamicImport } from 'next/dynamic';
import { safeLog } from '@/lib/utils';

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
  ssr: true
});

const DynamicProductFallback = dynamicImport(() => import('@/app/products/[id]/fallback'), {
  ssr: true
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
    safeLog.error('Error reading products data:', error);
    return [];
  }
}

// Server component sẽ tìm sản phẩm và chuyển dữ liệu sang client component
export default async function ProductPage({ params }: { params: { id: string } }) {
  try {
    // Await params trước khi sử dụng thuộc tính của nó
    const { id: productId } = await Promise.resolve(params);
    
    safeLog.info(`Đang tìm kiếm sản phẩm với ID hoặc slug: ${productId}`);
    
    // Lấy dữ liệu sản phẩm từ file JSON
    const products = getProducts();
    
    // Tìm sản phẩm theo slug trước (ưu tiên tìm theo slug để cải thiện SEO)
    let product = products.find(p => p.slug === productId);
    
    // Nếu không tìm thấy bằng slug, thử tìm bằng id
    if (!product) {
      product = products.find(p => p.id === productId);
    }
    
    // Nếu không tìm thấy sản phẩm, hiển thị trang not-found
    if (!product) {
      safeLog.warn(`Không tìm thấy sản phẩm với ID hoặc slug: ${productId}`);
      notFound();
    }
    
    // Ghi log thông tin truy cập
    safeLog.info(`Người dùng đang xem sản phẩm: ${product.name} (ID: ${product.id}, Slug: ${product.slug})`);
    
    // Truyền dữ liệu sản phẩm sang client component
    return (
      <>
        <DynamicProductDetail product={product} />
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
            `
          }}
        />
      </>
    );
  } catch (error) {
    safeLog.error('Error in ProductPage:', error);
    return <DynamicProductFallback />;
  }
} 