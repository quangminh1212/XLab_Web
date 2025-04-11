import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/data/mockData';
import { Product } from '@/types';

// GET: Lấy thông tin một sản phẩm theo ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        message: 'Không tìm thấy sản phẩm' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: product,
      message: 'Lấy thông tin sản phẩm thành công' 
    }, { status: 200 });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin sản phẩm:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Lỗi khi lấy thông tin sản phẩm' 
    }, { status: 500 });
  }
}

// PUT: Cập nhật thông tin sản phẩm
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await req.json();
    
    // Tìm sản phẩm trong danh sách
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json({ 
        success: false, 
        message: 'Không tìm thấy sản phẩm' 
      }, { status: 404 });
    }
    
    // Cập nhật thông tin sản phẩm
    const updatedProduct: Product = {
      ...products[productIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    // Cập nhật lại mảng sản phẩm
    products[productIndex] = updatedProduct;
    
    return NextResponse.json({ 
      success: true, 
      data: updatedProduct,
      message: 'Cập nhật sản phẩm thành công' 
    }, { status: 200 });
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Lỗi khi cập nhật sản phẩm' 
    }, { status: 500 });
  }
}

// DELETE: Xóa sản phẩm
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Tìm sản phẩm trong danh sách
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json({ 
        success: false, 
        message: 'Không tìm thấy sản phẩm' 
      }, { status: 404 });
    }
    
    // Xóa sản phẩm khỏi mảng
    const deletedProduct = products.splice(productIndex, 1)[0];
    
    return NextResponse.json({ 
      success: true, 
      data: deletedProduct,
      message: 'Xóa sản phẩm thành công' 
    }, { status: 200 });
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Lỗi khi xóa sản phẩm' 
    }, { status: 500 });
  }
} 