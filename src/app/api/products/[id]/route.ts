import * as fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

import { Product } from '@/models/ProductModel';
import { getProductById } from '@/lib/i18n/products';

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
    const dirPath = path.dirname(dataFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving products data:', error);
  }
}

// GET: Lấy thông tin sản phẩm theo ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get language from query parameter or default to Vietnamese
    const searchParams = req.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'vie';

    // Get product file path based on ID and language
    const productFilePath = path.join(process.cwd(), `src/i18n/${lang}/product/${params.id}.json`);
    
    // Check if product file exists
    console.log(`Looking for product with ID: ${params.id}, language: ${lang}`);
    
    let product: Product | null = null;
    
    try {
      if (fs.existsSync(productFilePath)) {
        const fileContent = fs.readFileSync(productFilePath, 'utf-8');
        product = JSON.parse(fileContent) as Product;
      } else {
        // Try finding by slug if not found by ID
        const productsDir = path.join(process.cwd(), `src/i18n/${lang}/product`);
        const files = fs.readdirSync(productsDir);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        for (const file of jsonFiles) {
          const filePath = path.join(productsDir, file);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const productData = JSON.parse(fileContent) as Product;
          
          if (productData.slug === params.id) {
            product = productData;
            break;
          }
        }
      }
    } catch (error) {
      console.error(`Error reading product file for ${params.id}:`, error);
    }

    if (!product) {
      console.log(`Could not find product with ID or slug: ${params.id}`);
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    console.log(`User is viewing product: ${product.name} (ID: ${product.id}, Slug: ${product.slug})`);

    // Process blob URLs in images
    const processedProduct = {
      ...product,
      images: product.images?.map((img: any) => {
        if (typeof img === 'string') {
          return img.startsWith('blob:') ? '/images/placeholder/product-placeholder.jpg' : img;
        }
        return img.url;
      }) || [],
    };

    return NextResponse.json({ success: true, data: processedProduct }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching product with ID ${params.id}:`, error);
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT: Cập nhật sản phẩm
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Await params before accessing its properties
    const safeParams = await params;
    const id = safeParams.id;

    const body = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID sản phẩm là bắt buộc' }, { status: 400 });
    }

    // Tìm index của sản phẩm
    const products = getProducts();
    const productIndex = products.findIndex((p) => p.id === id || p.slug === id);

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    // Cập nhật sản phẩm
    const updatedProduct = {
      ...products[productIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    products[productIndex] = updatedProduct;
    saveProducts(products);

    return NextResponse.json({
      success: true,
      message: 'Sản phẩm đã được cập nhật thành công',
      data: updatedProduct,
    });
  } catch (error: any) {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    return NextResponse.json({ error: error.message || 'Lỗi máy chủ nội bộ' }, { status: 500 });
  }
}

// DELETE: Xóa sản phẩm
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Await params before accessing its properties
    const safeParams = await params;
    const id = safeParams.id;

    if (!id) {
      return NextResponse.json({ error: 'ID sản phẩm là bắt buộc' }, { status: 400 });
    }

    // Tìm index của sản phẩm
    const products = getProducts();
    const productIndex = products.findIndex((p) => p.id === id || p.slug === id);

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    // Xóa sản phẩm
    const deletedProduct = products[productIndex];
    const newProducts = products.filter((_, index) => index !== productIndex);
    saveProducts(newProducts);

    return NextResponse.json({
      success: true,
      message: 'Sản phẩm đã được xóa thành công',
      data: deletedProduct,
    });
  } catch (error: any) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    return NextResponse.json({ error: error.message || 'Lỗi máy chủ nội bộ' }, { status: 500 });
  }
}
