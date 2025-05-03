import { NextResponse } from 'next/server';
import { products } from '@/data/mockData';
<<<<<<< HEAD
import { getProductBySlug } from '@/lib/utils';

// In a real application, this would interact with a database or session store
// For now, we'll use a mock implementation
export async function GET(request: Request) {
  try {
    // Get the product ID from the URL
=======

// Trong ứng dụng thực tế, các API này sẽ tương tác với cơ sở dữ liệu hoặc lưu trữ session
// Hiện tại, chúng ta sẽ sử dụng một triển khai mô phỏng
export async function GET(request: Request) {
  try {
    // Lấy ID sản phẩm từ URL
>>>>>>> 2aea817a
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const quantity = Number(searchParams.get('quantity')) || 1;

    if (!id) {
<<<<<<< HEAD
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Find the product by ID or slug
    const product = products.find(p => p.id === id || p.slug === id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // In a real application, we would add the product to the user's cart
    // For this demo, we'll just return success with the product details
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product added to cart successfully',
=======
      return NextResponse.json({ error: 'Yêu cầu ID sản phẩm' }, { status: 400 });
    }

    // Tìm sản phẩm theo ID hoặc slug
    const product = products.find(p => p.id === id || p.slug === id);

    if (!product) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    // Trong ứng dụng thực tế, chúng ta sẽ thêm sản phẩm vào giỏ hàng của người dùng
    // Đối với bản demo này, chúng ta sẽ trả về thành công với thông tin chi tiết sản phẩm
    
    return NextResponse.json({ 
      success: true, 
      message: 'Đã thêm sản phẩm vào giỏ hàng thành công',
>>>>>>> 2aea817a
      product: {
        id: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        quantity: quantity,
        image: product.imageUrl
      }
    });
  } catch (error: any) {
<<<<<<< HEAD
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
=======
    console.error('Lỗi khi thêm vào giỏ hàng:', error);
    return NextResponse.json({ error: error.message || 'Lỗi máy chủ nội bộ' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Lấy dữ liệu từ body request
    const data = await request.json();
    const { id, quantity = 1 } = data;

    if (!id) {
      return NextResponse.json({ error: 'Yêu cầu ID sản phẩm' }, { status: 400 });
    }

    // Tìm sản phẩm theo ID hoặc slug
    const product = products.find(p => p.id === id || p.slug === id);

    if (!product) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    // Trả về thông tin sản phẩm đã thêm vào giỏ hàng
    return NextResponse.json({ 
      success: true, 
      message: 'Đã thêm sản phẩm vào giỏ hàng thành công',
      product: {
        id: product.id,
        name: product.name,
        version: product.version || 'Tiêu chuẩn',
        price: product.salePrice || product.price,
        quantity: quantity,
        image: product.imageUrl
      }
    });
  } catch (error: any) {
    console.error('Lỗi khi thêm vào giỏ hàng:', error);
    return NextResponse.json({ error: error.message || 'Lỗi máy chủ nội bộ' }, { status: 500 });
>>>>>>> 2aea817a
  }
} 