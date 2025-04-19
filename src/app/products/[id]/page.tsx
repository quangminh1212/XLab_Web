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
  
  // Tìm sản phẩm từ dữ liệu mẫu
  const product = products.find(p => p.slug === productId || p.id === productId);
  
  // Nếu không tìm thấy sản phẩm, hiển thị trang not-found
  if (!product) {
    notFound();
  }
  
  // Truyền dữ liệu sản phẩm sang client component
  return <ProductDetail product={product} />;
} 