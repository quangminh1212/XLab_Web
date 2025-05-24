import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { Product } from '@/models/ProductModel';
import ProductDetail from './ProductDetail';
import ProductFallback from './fallback';

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

// Server component sẽ tìm sản phẩm và chuyển dữ liệu sang client component
export default async function ProductPage({ params }: { params: { id: string } }) {
  try {
    // Await params trước khi sử dụng thuộc tính của nó
    const { id: productId } = await Promise.resolve(params);
    
    console.log(`Đang tìm kiếm sản phẩm với ID hoặc slug: ${productId}`);
    
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
      console.log(`Không tìm thấy sản phẩm với ID hoặc slug: ${productId}`);
      notFound();
    }
    
    // Ghi log thông tin truy cập
    console.log(`Người dùng đang xem sản phẩm: ${product.name} (ID: ${product.id}, Slug: ${product.slug})`);
    
    // Truyền dữ liệu sản phẩm sang client component
    return <ProductDetail product={product} />;
  } catch (error) {
    console.error('Error in ProductPage:', error);
    return <ProductFallback />;
  }
} 