import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Product } from '@/types';
import { products as mockProducts } from '@/data/mockData';

// Đường dẫn đến file lưu dữ liệu sản phẩm
const DATA_FILE_PATH = path.join(process.cwd(), 'src/data/userProducts.json');

// Hàm khởi tạo file dữ liệu nếu chưa tồn tại
function initializeDataFile() {
  try {
    // Tạo thư mục nếu chưa tồn tại
    const dirPath = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dirPath)) {
      console.log(`[API] Creating directory: ${dirPath}`);
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Kiểm tra xem file có tồn tại không
    if (!fs.existsSync(DATA_FILE_PATH)) {
      console.log(`[API] Data file does not exist, creating: ${DATA_FILE_PATH}`);
      // Tạo file rỗng
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify([], null, 2), { encoding: 'utf8' });
      console.log(`[API] Created empty data file`);
    } else {
      console.log(`[API] Data file already exists: ${DATA_FILE_PATH}`);
    }
  } catch (error) {
    console.error('[API] Error initializing data file:', error);
    throw error;
  }
}

// Hàm đọc sản phẩm từ file
function readProductsFromFile(): Product[] {
  try {
    // Đảm bảo file tồn tại
    initializeDataFile();
    
    console.log(`[API] Reading products from file: ${DATA_FILE_PATH}`);
    if (!fs.existsSync(DATA_FILE_PATH)) {
      console.log(`[API] Data file does not exist, returning empty array`);
      return [];
    }
    
    const data = fs.readFileSync(DATA_FILE_PATH, { encoding: 'utf8' });
    
    // Xử lý trường hợp file trống
    if (!data || data.trim() === '') {
      console.log(`[API] Data file is empty, returning empty array`);
      // Khởi tạo file trống
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify([], null, 2), { encoding: 'utf8' });
      return [];
    }
    
    const products = JSON.parse(data) as Product[];
    console.log(`[API] Successfully read ${products.length} products from file`);
    return products;
  } catch (error) {
    console.error('[API] Error reading products from file:', error);
    // Khởi tạo lại file nếu có lỗi
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify([], null, 2), { encoding: 'utf8' });
    console.log(`[API] Recreated empty data file due to error`);
    return [];
  }
}

// Hàm ghi sản phẩm vào file
function writeProductsToFile(products: Product[]) {
  try {
    // Đảm bảo thư mục tồn tại
    const dirPath = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dirPath)) {
      console.log(`[API] Creating directory: ${dirPath}`);
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    console.log(`[API] Writing ${products.length} products to file: ${DATA_FILE_PATH}`);
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(products, null, 2), { encoding: 'utf8' });
    console.log(`[API] Products written to file successfully`);
  } catch (error) {
    console.error('[API] Error writing products to file:', error);
    throw error;
  }
}

// GET API - Lấy danh sách sản phẩm
export async function GET(request: NextRequest) {
  console.log('[API] GET /api/products - Fetching all products');
  try {
    // Đọc sản phẩm từ file
    const products = readProductsFromFile();
    
    console.log(`[API] Returning ${products.length} products`);
    return NextResponse.json(products);
  } catch (error) {
    console.error('[API] Error in GET /api/products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST API - Thêm sản phẩm mới
export async function POST(request: NextRequest) {
  console.log('[API] POST /api/products - Adding new product');
  try {
    // Đọc dữ liệu sản phẩm từ request
    const productData = await request.json();
    
    // Kiểm tra dữ liệu bắt buộc
    if (!productData.name || !productData.price) {
      console.error('[API] Missing required fields in product data');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    console.log('[API] Received product data:', productData);
    
    // Đọc danh sách sản phẩm hiện tại
    const products = readProductsFromFile();
    
    // Tạo ID mới bằng cách lấy ID lớn nhất + 1 hoặc 1 nếu không có sản phẩm
    const newId = products.length > 0 
      ? Math.max(...products.map(p => typeof p.id === 'number' ? p.id : 0)) + 1 
      : 1;
    
    // Thiết lập thời gian tạo và cập nhật
    const now = new Date().toISOString();
    
    // Tạo sản phẩm mới với dữ liệu từ request và các giá trị mặc định
    const newProduct: Product = {
      id: newId,
      name: productData.name,
      slug: productData.slug || productData.name.toLowerCase().replace(/\s+/g, '-'),
      description: productData.description || '',
      longDescription: productData.longDescription || productData.description || '',
      price: parseFloat(productData.price),
      salePrice: parseFloat(productData.salePrice || '0'),
      categoryId: productData.categoryId || 1,
      imageUrl: productData.imageUrl || '/images/products/default.png',
      isFeatured: productData.isFeatured === 'true' || productData.isFeatured === true || false,
      isNew: true,
      downloadCount: 0,
      viewCount: 0,
      rating: 0,
      version: productData.version || '1.0',
      size: productData.size || 'N/A',
      licenseType: productData.licenseType || 'Standard',
      createdAt: now,
      updatedAt: now,
      storeId: productData.storeId || 1,
    };
    
    console.log('[API] Created new product with ID:', newId);
    
    // Thêm sản phẩm mới vào danh sách
    products.push(newProduct);
    
    // Lưu danh sách đã cập nhật vào file
    writeProductsToFile(products);
    
    console.log('[API] Product added successfully');
    return NextResponse.json(newProduct);
  } catch (error) {
    console.error('[API] Error in POST /api/products:', error);
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    );
  }
} 