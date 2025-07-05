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

// Save product data
function saveProducts(products: Product[]): void {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving products data:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const products = getProducts();
    let updatedCount = 0;

    // Cập nhật số lượt mua cho tất cả sản phẩm
    const updatedProducts = products.map((product) => {
      if (!product.weeklyPurchases || product.weeklyPurchases === 0) {
        // Thêm số lượt mua ngẫu nhiên từ 20-100 cho sản phẩm
        const randomPurchases = Math.floor(Math.random() * 80) + 20;

        // Cập nhật sản phẩm
        updatedCount++;
        return {
          ...product,
          weeklyPurchases: randomPurchases,
        };
      }
      return product;
    });

    // Lưu cập nhật vào file
    saveProducts(updatedProducts);

    return NextResponse.json({
      success: true,
      message: `Đã thêm số lượt mua cho ${updatedCount} sản phẩm`,
    });
  } catch (error: any) {
    console.error('Error adding purchase counts:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 },
    );
  }
}
