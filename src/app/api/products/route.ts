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

    // Chỉ tạo file mới nếu không tồn tại
    if (!fs.existsSync(DATA_FILE_PATH)) {
      console.log(`[API] Data file does not exist, creating: ${DATA_FILE_PATH}`);
      // Khởi tạo với một số sản phẩm mẫu để đảm bảo có dữ liệu demo
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(mockProducts, null, 2), { encoding: 'utf8' });
      console.log(`[API] Created data file with ${mockProducts.length} products`);
    } else {
      console.log(`[API] Data file already exists: ${DATA_FILE_PATH}`);
    }
  } catch (error) {
    console.error('[API] Error initializing data file:', error);
    // Không ném lỗi để tránh làm hỏng quá trình khởi động
    return;
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
      return [];
    }
    
    try {
      const products = JSON.parse(data) as Product[];
      console.log(`[API] Successfully read ${products.length} products from file`);
      return products;
    } catch (parseError) {
      console.error('[API] Error parsing JSON data:', parseError);
      // Nếu file có dữ liệu nhưng không phải định dạng JSON hợp lệ
      // Thì sao lưu file cũ để tránh mất dữ liệu
      const backupPath = `${DATA_FILE_PATH}.backup.${Date.now()}`;
      fs.copyFileSync(DATA_FILE_PATH, backupPath);
      console.log(`[API] Corrupted data file backed up to: ${backupPath}`);
      return [];
    }
  } catch (error) {
    console.error('[API] Error reading products from file:', error);
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
    
    // Sao lưu file hiện tại trước khi ghi đè
    if (fs.existsSync(DATA_FILE_PATH)) {
      const backupPath = `${DATA_FILE_PATH}.backup`;
      fs.copyFileSync(DATA_FILE_PATH, backupPath);
    }
    
    console.log(`[API] Writing ${products.length} products to file: ${DATA_FILE_PATH}`);
    
    // Sử dụng writeFileSync với đồng bộ để đảm bảo dữ liệu được ghi hoàn toàn
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(products, null, 2), { encoding: 'utf8' });
    
    // Xác minh rằng file đã được ghi thành công bằng cách đọc lại
    const verifyData = fs.readFileSync(DATA_FILE_PATH, { encoding: 'utf8' });
    const verifyProducts = JSON.parse(verifyData) as Product[];
    
    if (verifyProducts.length === products.length) {
      console.log(`[API] Products written to file successfully and verified`);
      return true;
    } else {
      console.error(`[API] Verification failed: Expected ${products.length} products but got ${verifyProducts.length}`);
      throw new Error('Verification failed after writing products');
    }
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