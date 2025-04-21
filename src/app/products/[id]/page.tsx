import { notFound } from 'next/navigation';
import { products } from '@/data/mockData';
import ProductDetail from '@/app/products/[id]/ProductDetail';

// Đảm bảo trang được render động với mỗi request
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

// Server component sẽ tìm sản phẩm và chuyển dữ liệu sang client component
export default async function ProductPage({ params }: { params: { id: string } }) {
  // Await params trước khi sử dụng thuộc tính của nó
  const { id: productId } = await Promise.resolve(params);
  
  console.log(`Đang tìm kiếm sản phẩm với ID hoặc slug: ${productId}`);
  
  // Tìm sản phẩm theo slug trước (ưu tiên tìm theo slug để cải thiện SEO)
  let product = products.find(p => p.slug === productId);
  
  // Nếu không tìm thấy bằng slug, thử tìm bằng id
  if (!product) {
    product = products.find(p => p.id === productId);
  }
  
  // Nếu không tìm thấy sản phẩm, hiển thị trang not-found
  if (!product) {
    console.log(`Không tìm thấy sản phẩm với ID hoặc slug: ${productId}`);
    notFound();
  }
  
  // Ghi log thông tin truy cập
  console.log(`Người dùng đang xem sản phẩm: ${product.name} (ID: ${product.id}, Slug: ${product.slug})`);
  
  // Truyền dữ liệu sản phẩm sang client component
  return <ProductDetail product={product} />;
} 