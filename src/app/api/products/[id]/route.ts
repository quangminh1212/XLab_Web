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
  console.log(`[API /api/products/${params.id}] Received PATCH request`);
  try {
    const body = await req.json();
    console.log(`[API /api/products/${params.id}] Request body:`, body);
    const productIndex = productsData.findIndex(p => String(p.id) === params.id);
    
    if (productIndex === -1) {
      console.error(`[API /api/products/${params.id}] Product not found for PATCH`);
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }
    
    // Cập nhật sản phẩm
    const updatedProduct = {
      ...productsData[productIndex],
      ...body,
      id: productsData[productIndex].id, // Đảm bảo ID không bị ghi đè bởi body
      updatedAt: new Date().toISOString()
    };
    
    console.log(`[API /api/products/${params.id}] Updating product at index ${productIndex}:`, updatedProduct);
    productsData[productIndex] = updatedProduct;
    
    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error(`[API /api/products/${params.id}] Error in PATCH handler:`, error);
    return NextResponse.json(
      { error: 'Lỗi server khi cập nhật sản phẩm', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Xóa sản phẩm
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  console.log(`[API /api/products/${params.id}] Received DELETE request`);
  try {
    const productIndex = productsData.findIndex(p => String(p.id) === params.id);
    
    if (productIndex === -1) {
      console.error(`[API /api/products/${params.id}] Product not found for DELETE`);
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }
    
    console.log(`[API /api/products/${params.id}] Deleting product at index ${productIndex}:`, productsData[productIndex]);
    // Xóa sản phẩm khỏi mảng (mô phỏng database)
    productsData.splice(productIndex, 1);
    console.log(`[API /api/products/${params.id}] productsData length after splice:`, productsData.length);
    
    // Trả về thành công (không cần nội dung)
    return NextResponse.json({ success: true }, { status: 200 }); // Sử dụng status 200 hoặc 204
  } catch (error: any) {
    console.error(`[API /api/products/${params.id}] Error in DELETE handler:`, error);
    return NextResponse.json(
      { error: 'Lỗi server khi xóa sản phẩm', details: error.message },
      { status: 500 }
    );
  }
} 