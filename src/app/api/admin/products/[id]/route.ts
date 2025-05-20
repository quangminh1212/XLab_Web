import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import fs from 'fs';
import path from 'path';
import { Product, ProductCategory } from '@/models/ProductModel';
import fsPromises from 'fs/promises';

// Data file path
const dataFilePath = path.join(process.cwd(), 'src/data/products.json');
// Image directory
const imagesDir = path.join(process.cwd(), 'public/images/products');

// Function to generate ID from product name
function generateIdFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // Remove special characters
    .replace(/[\s_-]+/g, '-')   // Replace spaces with hyphens
    .replace(/^-+|-+$/g, '');   // Remove leading/trailing hyphens
}

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

// Function to delete old images
function deleteOldImages(oldImages: (string | { url: string })[], newImages: (string | { url: string })[]): void {
  try {
    // Chỉ xử lý xóa nếu có ảnh cũ và ảnh mới
    if (!oldImages || !newImages || oldImages.length === 0 || newImages.length === 0) {
      return;
    }

    // Chuyển đổi mảng để có được các URL dạng chuỗi
    const oldImageUrls = oldImages.map(img => typeof img === 'string' ? img : img.url);
    const newImageUrls = newImages.map(img => typeof img === 'string' ? img : img.url);

    // Tìm các ảnh cũ không còn xuất hiện trong danh sách ảnh mới
    const imagesToDelete = oldImageUrls.filter(oldImg => !newImageUrls.includes(oldImg));
    
    // Xóa từng ảnh
    for (const imageUrl of imagesToDelete) {
      // Chỉ xóa ảnh trong thư mục images
      if (imageUrl && imageUrl.startsWith('/images/')) {
        const imagePath = path.join(process.cwd(), 'public', imageUrl);
        
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`Deleted old image: ${imagePath}`);
        } else {
          console.log(`Image not found for deletion: ${imagePath}`);
        }
      }
    }
  } catch (error) {
    console.error('Error deleting old images:', error);
  }
}

// Category lookup
function getCategoryName(categoryId: string): string {
  const categories: Record<string, string> = {
    'office-software': 'Phần mềm văn phòng',
    'business-solutions': 'Giải pháp doanh nghiệp',
    'security-software': 'Phần mềm bảo mật',
    'data-protection': 'Bảo vệ dữ liệu',
    'design-software': 'Phần mềm thiết kế'
  };
  return categories[categoryId] || categoryId;
}

// Extract product ID from URL
function extractIdFromUrl(url: string): string {
  const segments = url.split('/');
  return segments[segments.length - 1];
}

// Kiểm tra quyền admin
async function checkAdminPermission() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return false;
  }
  
  // Kiểm tra email có phải admin không
  return session.user?.email === 'xlab.rnd@gmail.com' || session.user?.isAdmin === true;
}

// GET product handler
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Kiểm tra quyền admin
    const isAdmin = await checkAdminPermission();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Đọc tệp JSON sản phẩm
    const fileData = await fsPromises.readFile(dataFilePath, 'utf-8');
    const products = JSON.parse(fileData);
    
    // Tìm sản phẩm với ID tương ứng
    const product = products.find((p: any) => p.id.toString() === params.id);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
    return NextResponse.json({ error: 'Failed to load product' }, { status: 500 });
  }
}

// UPDATE product handler
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Kiểm tra quyền admin
    const isAdmin = await checkAdminPermission();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Lấy dữ liệu từ request
    const productData = await request.json();
    
    // Đọc tệp JSON sản phẩm
    const fileData = await fsPromises.readFile(dataFilePath, 'utf-8');
    let products = JSON.parse(fileData);
    
    // Tìm index của sản phẩm cần cập nhật
    const productIndex = products.findIndex((p: any) => p.id.toString() === params.id);
    
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Cập nhật sản phẩm
    products[productIndex] = { ...products[productIndex], ...productData };
    
    // Lưu lại tệp JSON
    await fsPromises.writeFile(dataFilePath, JSON.stringify(products, null, 2));
    
    return NextResponse.json({ success: true, product: products[productIndex] });
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE product handler
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Kiểm tra quyền admin
    const isAdmin = await checkAdminPermission();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Đọc tệp JSON sản phẩm
    const fileData = await fsPromises.readFile(dataFilePath, 'utf-8');
    let products = JSON.parse(fileData);
    
    // Tìm sản phẩm cần xóa
    const productIndex = products.findIndex((p: any) => p.id.toString() === params.id);
    
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Lấy thông tin sản phẩm trước khi xóa
    const productToDelete = products[productIndex];
    
    // Xóa sản phẩm khỏi mảng
    products.splice(productIndex, 1);
    
    // Lưu lại tệp JSON
    await fsPromises.writeFile(dataFilePath, JSON.stringify(products, null, 2));
    
    // Xóa các hình ảnh của sản phẩm (nếu có)
    if (productToDelete.images && Array.isArray(productToDelete.images)) {
      for (const image of productToDelete.images) {
        const imagePath = typeof image === 'string' 
          ? path.join(imagesDir, image.replace('/images/products/', ''))
          : path.join(imagesDir, image.url.replace('/images/products/', ''));
        
        try {
          await fsPromises.access(imagePath);
          await fsPromises.unlink(imagePath);
        } catch (err) {
          // Bỏ qua lỗi nếu file không tồn tại
          console.warn(`Không thể xóa ảnh ${imagePath}:`, err);
        }
      }
    }
    
    return NextResponse.json({ success: true, deletedProduct: productToDelete });
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
} 