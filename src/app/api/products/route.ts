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
    console.log('Kiểm tra file dữ liệu tại:', DATA_FILE_PATH);
    
    if (!fs.existsSync(DATA_FILE_PATH)) {
      console.log('File dữ liệu không tồn tại, đang tạo file mới...');
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(mockProducts, null, 2), 'utf8');
      console.log('Đã tạo file dữ liệu sản phẩm mới thành công');
    } else {
      console.log('File dữ liệu đã tồn tại');
      
      // Kiểm tra xem file có thể đọc/ghi không
      try {
        fs.accessSync(DATA_FILE_PATH, fs.constants.R_OK | fs.constants.W_OK);
        console.log('File dữ liệu có quyền đọc/ghi');
      } catch (err) {
        console.error('File dữ liệu không có quyền đọc/ghi:', err);
      }
    }
  } catch (error) {
    console.error('Lỗi khi khởi tạo file dữ liệu:', error);
  }
}

// Đọc dữ liệu sản phẩm từ file
function readProductsFromFile() {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      console.log('File dữ liệu không tồn tại, đang khởi tạo...');
      initializeDataFile();
      return [...mockProducts];
    }
    
    console.log('Đang đọc dữ liệu từ file:', DATA_FILE_PATH);
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    
    try {
      const products = JSON.parse(data);
      console.log(`Đã đọc ${products.length} sản phẩm từ file`);
      return products;
    } catch (parseError) {
      console.error('Lỗi khi phân tích dữ liệu JSON:', parseError);
      console.log('Đang trả về dữ liệu mẫu...');
      return [...mockProducts];
    }
  } catch (error) {
    console.error('Lỗi khi đọc file dữ liệu:', error);
    return [...mockProducts];
  }
}

// Ghi dữ liệu sản phẩm vào file
function writeProductsToFile(products: Product[]) {
  try {
    console.log(`Đang ghi ${products.length} sản phẩm vào file...`);
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(products, null, 2), 'utf8');
    console.log('Đã lưu dữ liệu sản phẩm vào file thành công');
  } catch (error) {
    console.error('Lỗi khi ghi dữ liệu vào file:', error);
  }
}

// Đảm bảo file dữ liệu tồn tại khi khởi động
console.log('Khởi tạo API Products route...');
initializeDataFile();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const timestamp = url.searchParams.get('t') || '';
  console.log(`Nhận request GET đến /api/products (timestamp: ${timestamp})`);
  
  try {
    // Đọc dữ liệu sản phẩm từ file
    const products = readProductsFromFile();
    console.log(`Trả về ${products.length} sản phẩm`);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi lấy danh sách sản phẩm' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  console.log('Nhận request POST đến /api/products');
  
  try {
    const productData: Product = await request.json();
    console.log('Dữ liệu sản phẩm nhận được:', productData);
    
    // Thêm ID và timestamp nếu chưa có
    if (!productData.id) {
      productData.id = `prod-${Date.now()}`;
      console.log(`Đã tạo ID sản phẩm mới: ${productData.id}`);
    }
    
    if (!productData.createdAt) {
      productData.createdAt = new Date().toISOString();
    }
    
    productData.updatedAt = new Date().toISOString();
    
    // Đọc dữ liệu hiện tại từ file
    let products = readProductsFromFile();
    
    if (!Array.isArray(products)) {
      console.warn('Dữ liệu đọc từ file không phải là mảng, đang khởi tạo lại mảng rỗng');
      products = [];
    }
    
    // Thêm sản phẩm mới vào mảng
    products.push(productData);
    console.log(`Đã thêm sản phẩm mới, tổng số: ${products.length}`);
    
    // Lưu mảng đã cập nhật vào file
    writeProductsToFile(products);
    
    console.log(`Đã thêm sản phẩm thành công: ${productData.name} (ID: ${productData.id})`);
    return NextResponse.json(productData, { status: 201 });
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm mới:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi tạo sản phẩm mới' },
      { status: 500 }
    );
  }
} 