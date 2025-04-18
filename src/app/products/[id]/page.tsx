import { products } from '@/data/mockData';
import { Product } from '@/types';
import ClientProductDetail from './client-product';

// Server Component
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
  
  // Hiển thị trang sản phẩm
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="text-sm text-gray-500 mb-4">
        Phiên bản {product.version || '1.0'}
      </p>
      
      <div className="mb-4">
        <p className="text-gray-700">{product.description}</p>
      </div>
      
      <div 
        className="prose max-w-none mb-6" 
        dangerouslySetInnerHTML={{ __html: product.longDescription }}
      />
      
      <div className="mt-4">
        <ClientProductDetail product={product} />
      </div>
    </div>
  );
} 