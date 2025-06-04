import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Product } from '@/models/ProductModel';

// Data file path
const dataFilePath = path.join(process.cwd(), 'src/data/products.json');

// Read product data
function getProducts(): Product[] {
  try {
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

export async function GET(request: NextRequest) {
  try {
    const products = getProducts();

    // Kiểm tra có bao nhiêu sản phẩm có weeklyPurchases > 0
    const productsWithPurchases = products.filter(
      (p) => p.weeklyPurchases && p.weeklyPurchases > 0,
    );

    // Tạo một mảng thông tin ngắn gọn về sản phẩm
    const simplifiedProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      weeklyPurchases: p.weeklyPurchases || 0,
      rating: p.rating || 0,
    }));

    return NextResponse.json({
      totalProducts: products.length,
      productsWithPurchases: productsWithPurchases.length,
      products: simplifiedProducts,
    });
  } catch (error: any) {
    console.error('Error checking product data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 },
    );
  }
}
