import { NextResponse } from 'next/server';
import { products as mockProducts } from '@/data/mockData';
import { Product } from '@/types';

// Lưu trữ sản phẩm trong bộ nhớ (thay cho database)
let productsInMemory = [...mockProducts];

export async function GET() {
  console.log('Received GET request to /api/products');
  
  try {
    console.log(`Returning ${productsInMemory.length} products from memory (not from import)`);
    return NextResponse.json(productsInMemory);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi lấy danh sách sản phẩm' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const productData: Product = await request.json();
    
    // Thêm ID và timestamp nếu chưa có
    if (!productData.id) {
      productData.id = `prod-${Date.now()}`;
    }
    
    if (!productData.createdAt) {
      productData.createdAt = new Date().toISOString();
    }
    
    productData.updatedAt = new Date().toISOString();
    
    // Thêm vào mảng sản phẩm trong bộ nhớ
    productsInMemory.push(productData);
    
    console.log(`Added new product: ${productData.name} (ID: ${productData.id})`);
    return NextResponse.json(productData, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi tạo sản phẩm mới' },
      { status: 500 }
    );
  }
} 