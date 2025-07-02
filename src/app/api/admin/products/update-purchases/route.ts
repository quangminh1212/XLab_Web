import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
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

// Cập nhật số lượt mua tự động
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authKey = searchParams.get('authKey');

    // Check authentication - sử dụng authKey đơn giản cho cronjob
    // Trong thực tế, nên sử dụng phương thức xác thực an toàn hơn
    const validAuthKey = process.env.UPDATE_PURCHASES_AUTH_KEY || 'fallback-key-for-build';

    if (authKey !== validAuthKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = getProducts();
    let updatedCount = 0;

    // Cập nhật số lượt mua cho tất cả sản phẩm
    const updatedProducts = products.map((product) => {
      // Random từ 1 đến 10 lượt mua mỗi ngày
      const randomPurchases = Math.floor(Math.random() * 10) + 1;
      const currentPurchases = product.weeklyPurchases ? Number(product.weeklyPurchases) : 0;

      // Cập nhật số lượt mua
      const updatedProduct = {
        ...product,
        weeklyPurchases: currentPurchases + randomPurchases,
      };

      updatedCount++;
      return updatedProduct;
    });

    // Lưu cập nhật vào file
    saveProducts(updatedProducts);

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật số lượt mua cho ${updatedCount} sản phẩm`,
    });
  } catch (error: any) {
    console.error('Error updating purchase counts:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 },
    );
  }
}
