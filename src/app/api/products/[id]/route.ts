import { NextResponse } from 'next/server';
import { products } from '@/data/mockData';
import { Product } from '@/types';

// Sử dụng array để có thể thay đổi dữ liệu
let productsData = [...products];

// GET - Lấy chi tiết sản phẩm theo ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = productsData.find(p => p.id.toString() === params.id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Không tìm thấy sản phẩm' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi khi lấy thông tin sản phẩm' },
      { status: 500 }
    );
  }
}

// PATCH - Cập nhật sản phẩm
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const productIndex = productsData.findIndex(p => p.id.toString() === params.id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Không tìm thấy sản phẩm' },
        { status: 404 }
      );
    }
    
    // Cập nhật sản phẩm
    const updatedProduct = {
      ...productsData[productIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    productsData[productIndex] = updatedProduct;
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật sản phẩm' },
      { status: 500 }
    );
  }
}

// DELETE - Xóa sản phẩm
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productIndex = productsData.findIndex(p => p.id.toString() === params.id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Không tìm thấy sản phẩm' },
        { status: 404 }
      );
    }
    
    // Xóa sản phẩm khỏi mảng
    productsData.splice(productIndex, 1);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi khi xóa sản phẩm' },
      { status: 500 }
    );
  }
} 