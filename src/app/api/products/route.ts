import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/data/mockData';
import { Product } from '@/types';

// Tạm thời lưu trữ dữ liệu trong bộ nhớ
// Trong ứng dụng thực tế, bạn sẽ lấy dữ liệu từ database
let currentProducts: Product[] = [...products]; 

export async function GET(request: NextRequest) {
  try {
    // Trả về danh sách sản phẩm hiện tại
    return NextResponse.json(currentProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const newProductData = await request.json();

    // Validate required fields (basic example)
    if (!newProductData.name || !newProductData.slug || !newProductData.price || !newProductData.categoryId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}`, // Simple ID generation for mock data
      ...newProductData,
      // Ensure default values or override received ones if necessary
      longDescription: newProductData.longDescription || '',
      salePrice: newProductData.salePrice || null,
      imageUrl: newProductData.imageUrl || '/images/products/placeholder.png',
      isFeatured: newProductData.isFeatured || false,
      isNew: newProductData.isNew === undefined ? true : newProductData.isNew, // Default to true if not provided
      downloadCount: newProductData.downloadCount || 0,
      viewCount: newProductData.viewCount || 0,
      rating: newProductData.rating || 0,
      version: newProductData.version || '1.0.0',
      size: newProductData.size || 'N/A',
      licenseType: newProductData.licenseType || 'Thương mại',
      storeId: newProductData.storeId || '1', // Default storeId if necessary
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    currentProducts.push(newProduct);

    return NextResponse.json(newProduct, { status: 201 });

  } catch (error) {
    console.error("Error creating product:", error);
    // Check if the error is due to invalid JSON
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON format' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error creating product' }, { status: 500 });
  }
} 