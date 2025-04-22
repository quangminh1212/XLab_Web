import { NextResponse } from 'next/server';
import { products } from '@/data/mockData';

// GET: Lấy thông tin sản phẩm theo ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'ID sản phẩm là bắt buộc' }, { status: 400 });
    }
    
    // Tìm sản phẩm theo ID hoặc slug
    const product = products.find(p => p.id === id || p.slug === id);
    
    if (!product) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    console.error('Lỗi khi lấy sản phẩm:', error);
    return NextResponse.json({ error: error.message || 'Lỗi máy chủ nội bộ' }, { status: 500 });
  }
}

// PUT: Cập nhật sản phẩm
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID sản phẩm là bắt buộc' }, { status: 400 });
    }
    
    // Tìm index của sản phẩm
    const productIndex = products.findIndex(p => p.id === id || p.slug === id);
    
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }
    
    // Trong môi trường thực tế, chúng ta sẽ cập nhật sản phẩm trong cơ sở dữ liệu
    // Ở đây, chúng ta chỉ cập nhật trong mảng products
    const updatedProduct = {
      ...products[productIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    products[productIndex] = updatedProduct;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Sản phẩm đã được cập nhật thành công',
      data: updatedProduct
    });
  } catch (error: any) {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    return NextResponse.json({ error: error.message || 'Lỗi máy chủ nội bộ' }, { status: 500 });
  }
}

// DELETE: Xóa sản phẩm
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'ID sản phẩm là bắt buộc' }, { status: 400 });
    }
    
    // Tìm index của sản phẩm
    const productIndex = products.findIndex(p => p.id === id || p.slug === id);
    
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }
    
    // Trong môi trường thực tế, chúng ta sẽ xóa sản phẩm từ cơ sở dữ liệu
    // Ở đây, chúng ta chỉ xóa từ mảng products
    const deletedProduct = products[productIndex];
    products.splice(productIndex, 1);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Sản phẩm đã được xóa thành công',
      data: deletedProduct
    });
  } catch (error: any) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    return NextResponse.json({ error: error.message || 'Lỗi máy chủ nội bộ' }, { status: 500 });
  }
} 