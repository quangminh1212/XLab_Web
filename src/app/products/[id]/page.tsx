import { products } from '@/data/mockData';
import ProductUI from './product-ui';

export default function ProductPage({ params }: { params: { id: string } }) {
  // Tìm sản phẩm theo slug
  const product = products.find(p => p.slug === params.id);
  
  // Nếu không tìm thấy, hiển thị lỗi
  if (!product) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Không tìm thấy sản phẩm</h1>
        <p className="mb-4">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <a href="/products" className="text-blue-500 hover:underline">Quay lại danh sách sản phẩm</a>
      </div>
    );
  }
  
  // Render ProductUI cho phần client-side interaction
  return <ProductUI product={product} />;
} 