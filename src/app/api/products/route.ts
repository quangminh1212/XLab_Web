import { NextResponse } from 'next/server';
import { products as mockProducts } from '@/data/mockData';
import { Product } from '@/types';
import * as fs from 'fs';
import * as path from 'path';

// Đường dẫn đến file JSON để lưu sản phẩm
const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'userProducts.json');

// Khởi tạo file JSON nếu chưa tồn tại
function initializeDataFile() {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(mockProducts, null, 2), 'utf8');
      console.log('Đã tạo file dữ liệu sản phẩm mới tại:', DATA_FILE_PATH);
    }
  } catch (error) {
    console.error('Lỗi khi khởi tạo file dữ liệu:', error);
  }
}

// Đọc dữ liệu sản phẩm từ file
function readProductsFromFile() {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      initializeDataFile();
      return [...mockProducts];
    }
    
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Lỗi khi đọc file dữ liệu:', error);
    return [...mockProducts];
  }
}

// Ghi dữ liệu sản phẩm vào file
function writeProductsToFile(products: Product[]) {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(products, null, 2), 'utf8');
    console.log('Đã lưu dữ liệu sản phẩm vào file thành công');
  } catch (error) {
    console.error('Lỗi khi ghi dữ liệu vào file:', error);
  }
}

// Đảm bảo file dữ liệu tồn tại khi khởi động
initializeDataFile();

export async function GET() {
  console.log('Received GET request to /api/products');
  
  try {
    // Đọc dữ liệu sản phẩm từ file
    const products = readProductsFromFile();
    console.log(`Returning ${products.length} products from file`);
    return NextResponse.json(products);
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
    
    // Đọc dữ liệu hiện tại từ file
    const products = readProductsFromFile();
    
    // Thêm sản phẩm mới vào mảng
    products.push(productData);
    
    // Lưu mảng đã cập nhật vào file
    writeProductsToFile(products);
    
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