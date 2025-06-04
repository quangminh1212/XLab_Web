import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Product, ProductCategory } from '@/models/ProductModel';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dataFilePath = path.join(process.cwd(), 'src/data/products.json');

// Hàm đọc dữ liệu từ file JSON
const getProducts = (): Product[] => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2), 'utf8');
      return [];
    }

    const fileContent = fs.readFileSync(dataFilePath, 'utf8');

    try {
      // Thử phân tích trực tiếp
      return JSON.parse(fileContent);
    } catch (parseError) {
      // Nếu có lỗi phân tích, thử sửa lỗi cú pháp JSON
      console.error('JSON parse error:', parseError);

      // Hàm sửa lỗi cú pháp JSON phổ biến
      const fixedContent = fileContent
        .replace(/}\s*"/g, '},"') // Thiếu dấu phẩy giữa các đối tượng
        .replace(/,\s*}/g, '}') // Dấu phẩy thừa trước dấu đóng ngoặc
        .replace(/,\s*]/g, ']'); // Dấu phẩy thừa trước dấu đóng mảng

      try {
        // Thử phân tích lại sau khi sửa
        const parsedData = JSON.parse(fixedContent);

        // Nếu phân tích thành công, ghi lại file đã sửa
        fs.writeFileSync(dataFilePath, JSON.stringify(parsedData, null, 2), 'utf8');
        console.log('JSON syntax errors fixed and file updated');

        return parsedData;
      } catch (secondError) {
        // Nếu vẫn không sửa được, trả về mảng rỗng
        console.error('Could not fix JSON syntax errors:', secondError);
        return [];
      }
    }
  } catch (error) {
    console.error('Error reading products data:', error);
    return [];
  }
};

// Hàm lưu dữ liệu vào file JSON
const saveProducts = (products: Product[]) => {
  try {
    const dirPath = path.dirname(dataFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving products data:', error);
  }
};

// GET - Lấy danh sách sản phẩm
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST - Thêm sản phẩm mới
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const productData = await request.json();

    // Ensure images is always in the correct format
    if (productData.images) {
      // Convert string array to required format if needed
      if (Array.isArray(productData.images) && productData.images.length > 0) {
        // If the array contains strings (direct URLs), convert to the expected format
        if (typeof productData.images[0] === 'string') {
          // Keep as is, we'll handle both formats in the frontend
        }
      }
    } else {
      productData.images = [];
    }

    // Tạo ID từ tên sản phẩm
    const generateIdFromName = (name: string) => {
      return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Loại bỏ ký tự đặc biệt
        .replace(/[\s_-]+/g, '-') // Thay thế khoảng trắng và gạch dưới bằng gạch ngang
        .replace(/^-+|-+$/g, ''); // Loại bỏ gạch ngang ở đầu/cuối
    };

    // Thêm ID và ngày tạo
    const productId = productData.name ? generateIdFromName(productData.name) : uuidv4();

    const newProduct: Product = {
      id: productId,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Chuyển đổi categories từ mảng string sang mảng object
    if (Array.isArray(newProduct.categories) && typeof newProduct.categories[0] === 'string') {
      newProduct.categories = (newProduct.categories as unknown as string[]).map((categoryId) => ({
        id: categoryId,
        name: getCategoryName(categoryId),
        slug: categoryId,
      })) as ProductCategory[];
    }

    // Đọc dữ liệu hiện tại
    const products = getProducts();

    // Thêm sản phẩm mới
    products.push(newProduct);

    // Lưu lại vào file
    saveProducts(products);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}

// Hàm lấy tên danh mục từ ID
function getCategoryName(categoryId: string): string {
  const categories: Record<string, string> = {
    'office-software': 'Phần mềm văn phòng',
    'business-solutions': 'Giải pháp doanh nghiệp',
    'security-software': 'Phần mềm bảo mật',
    'data-protection': 'Bảo vệ dữ liệu',
    'design-software': 'Phần mềm thiết kế',
  };

  return categories[categoryId] || categoryId;
}
