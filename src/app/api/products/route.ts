import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types';
import { products } from '@/data/mockData';

// GET: Lấy tất cả sản phẩm
export async function GET(req: NextRequest) {
  try {
    // Trả về danh sách sản phẩm từ dữ liệu mẫu
    return NextResponse.json({ 
      success: true, 
      data: products,
      message: 'Lấy danh sách sản phẩm thành công'
    }, { status: 200 });
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Lỗi khi lấy danh sách sản phẩm' 
    }, { status: 500 });
  }
}

// POST: Tạo sản phẩm mới
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Kiểm tra dữ liệu đầu vào
    if (!data.name || !data.price || !data.categoryId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Thiếu thông tin sản phẩm' 
      }, { status: 400 });
    }
    
    // Tạo ID mới
    const newId = `prod-${products.length + 1}`;
    
    // Tạo slug từ tên nếu chưa có
    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-');
    
    // Tạo sản phẩm mới
    const newProduct: Product = {
      id: newId,
      name: data.name,
      slug: slug,
      description: data.description || '',
      longDescription: data.longDescription || '',
      price: Number(data.price),
      salePrice: data.salePrice ? Number(data.salePrice) : Number(data.price),
      categoryId: data.categoryId,
      imageUrl: data.imageUrl || '/images/products/default.png',
      isFeatured: data.isFeatured || false,
      isNew: data.isNew || true,
      downloadCount: 0,
      viewCount: 0,
      rating: 0,
      version: data.version || '1.0.0',
      size: data.size || '0MB',
      licenseType: data.licenseType || 'Cá nhân',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      storeId: data.storeId || '1'
    };
    
    // Trong môi trường thực tế, bạn sẽ lưu vào cơ sở dữ liệu
    // Ở đây chỉ giả lập thêm vào mảng
    products.push(newProduct);
    
    return NextResponse.json({ 
      success: true, 
      data: newProduct,
      message: 'Tạo sản phẩm thành công' 
    }, { status: 201 });
  } catch (error) {
    console.error('Lỗi khi tạo sản phẩm:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Lỗi khi tạo sản phẩm' 
    }, { status: 500 });
  }
} 