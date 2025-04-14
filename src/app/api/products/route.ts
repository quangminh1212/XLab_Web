import { NextResponse } from 'next/server';
import { products as mockProducts } from '@/data/mockData'; // Import mock data
import { Product } from '@/types';

// Tạo một biến toàn cục để lưu trữ dữ liệu sản phẩm giữa các lần gọi API
// Đây là giải pháp tạm thời cho môi trường phát triển, không dùng cho production
// Trong thực tế, dữ liệu sẽ được lưu trong cơ sở dữ liệu

// Tạo key duy nhất trong quá trình phát triển
const PRODUCTS_STORAGE_KEY = 'xlab_server_products_v1';

// Khởi tạo hoặc lấy dữ liệu từ global object
let productsData: Product[];

// Hàm khởi tạo dữ liệu
const initializeProductsData = () => {
  try {
    // Trong môi trường server-side, kiểm tra global object hoặc khởi tạo lại
    if (typeof global !== 'undefined' && (global as any)[PRODUCTS_STORAGE_KEY]) {
      productsData = (global as any)[PRODUCTS_STORAGE_KEY];
      console.log("[API /api/products] Using existing global productsData:", productsData.length);
      return;
    }
    
    // Nếu không có dữ liệu, khởi tạo từ mockData
    productsData = [...mockProducts];
    
    // Lưu vào global object để tránh reset khi module được reload
    if (typeof global !== 'undefined') {
      (global as any)[PRODUCTS_STORAGE_KEY] = productsData;
    }
    
    console.log("[API /api/products] Initialized productsData with mock data:", productsData.length);
  } catch (error) {
    console.error("[API /api/products] Error initializing productsData:", error);
    productsData = [...mockProducts]; // Fallback
  }
};

// Khởi tạo dữ liệu khi module được load
initializeProductsData();

// GET - Lấy danh sách sản phẩm
export async function GET(req: Request) {
  // Đảm bảo productsData đã được khởi tạo
  if (!productsData) {
    initializeProductsData();
  }
  
  console.log("[API /api/products] GET request, serving", productsData.length, "products");
  
  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get('storeId');
  const categoryId = searchParams.get('categoryId');
  
  let filteredProducts = [...productsData];
  
  // Lọc sản phẩm theo cửa hàng nếu có
  if (storeId) {
    filteredProducts = filteredProducts.filter(product => 
      product.storeId.toString() === storeId
    );
  }
  
  // Lọc sản phẩm theo danh mục nếu có
  if (categoryId) {
    filteredProducts = filteredProducts.filter(product => 
      product.categoryId.toString() === categoryId
    );
  }
  
  return NextResponse.json(filteredProducts);
}

// POST - Thêm sản phẩm mới
export async function POST(req: Request) {
  // Đảm bảo productsData đã được khởi tạo
  if (!productsData) {
    initializeProductsData();
  }
  
  console.log("[API /api/products] Received POST request");
  try {
    // Đọc dữ liệu từ request
    const body = await req.json();
    console.log("[API /api/products] Request body:", body);
    
    // Kiểm tra dữ liệu đầu vào chi tiết hơn
    const requiredFields = ['name', 'price', 'categoryId'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.error(`[API /api/products] Missing required fields: ${missingFields.join(', ')}`, body);
      return NextResponse.json(
        { error: `Thiếu thông tin bắt buộc: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Tạo ID sản phẩm mới với timestamp và chuỗi ngẫu nhiên để đảm bảo duy nhất
    const productId = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    console.log(`[API /api/products] Generated new product ID: ${productId}`);

    // Tạo sản phẩm mới với dữ liệu từ request và các giá trị mặc định
    const newProduct: Product = {
      id: productId,
      name: String(body.name),
      slug: body.slug || String(body.name).toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''),
      description: body.description || '',
      longDescription: body.longDescription || '',
      price: Number(body.price),
      salePrice: Number(body.salePrice) || Number(body.price),
      categoryId: body.categoryId,
      imageUrl: body.imageUrl || '/images/placeholder-product.jpg',
      isFeatured: Boolean(body.isFeatured),
      isNew: body.isNew === undefined ? true : Boolean(body.isNew),
      downloadCount: Number(body.downloadCount) || 0,
      viewCount: Number(body.viewCount) || 0,
      rating: Number(body.rating) || 0,
      version: body.version || '1.0.0',
      size: body.size || '0MB',
      licenseType: body.licenseType || 'Thương mại',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      storeId: body.storeId || '1'
    };
    
    console.log("[API /api/products] Creating new product:", newProduct);
    
    // Thêm sản phẩm vào danh sách (mô phỏng database)
    productsData.push(newProduct);
    
    // Cập nhật dữ liệu trong global object
    if (typeof global !== 'undefined') {
      (global as any)[PRODUCTS_STORAGE_KEY] = productsData;
    }
    
    console.log("[API /api/products] productsData length after push:", productsData.length);
    
    // Trả về sản phẩm vừa tạo với đầy đủ thông tin
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    // Log lỗi chi tiết hơn để dễ dàng debug
    console.error("[API /api/products] Error in POST handler:", error);
    console.error("[API /api/products] Error stack:", error.stack);
    return NextResponse.json(
      { error: 'Lỗi server khi tạo sản phẩm', details: error.message },
      { status: 500 }
    );
  }
} 