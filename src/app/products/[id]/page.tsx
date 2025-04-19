import { notFound } from 'next/navigation';
import { products } from '@/data/mockData';
import ProductDetail from './ProductDetail';

// Đảm bảo trang được render động với mỗi request
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

// Server component sẽ tìm sản phẩm và chuyển dữ liệu sang client component
export default function ProductPage({ params }: { params: { id: string } }) {
  const productId = params.id;
  
  // Tìm sản phẩm từ dữ liệu mẫu
  const product = products.find(p => p.slug === productId || p.id === productId);
  
  // Nếu không tìm thấy sản phẩm, hiển thị trang not-found
  if (!product) {
    notFound();
  }
  
  // Truyền dữ liệu sản phẩm sang client component
  return <ProductDetail product={product} />;
} 