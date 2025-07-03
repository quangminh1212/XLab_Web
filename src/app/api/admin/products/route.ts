import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Product, ProductCategory, ProductSpecification } from '@/models/ProductModel';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getAllProducts, saveProduct, deleteProduct, updateProduct } from '@/lib/i18n/products';


// Set this route to be dynamically rendered at request time
export const dynamic = "force-dynamic";

/**
 * Normalize language code from Accept-Language header
 * @param lang The Accept-Language header value
 * @returns 'eng' or 'vie' based on the primary language
 */
function normalizeLanguageHeader(lang: string | null): string {
  if (!lang) return 'vie'; // Default to Vietnamese
  
  // Extract primary language code before any quality values
  const primaryLang = lang.split(',')[0].split('-')[0].toLowerCase();
  
  // Map to our supported codes
  if (primaryLang === 'en') return 'eng';
  
  // Default to Vietnamese for any other language
  return 'vie';
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

    // Get language from header or default to 'vie'
    const language = request.headers.get('accept-language') || 'vie';
    
    // Save the new product using the i18n product function
    const saveResult = await saveProduct(newProduct, language);
    
    if (saveResult) {
      return NextResponse.json(newProduct, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Failed to save product' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}

// GET - Lấy danh sách sản phẩm
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get language from header and normalize it
    const acceptLanguage = request.headers.get('accept-language');
    const language = normalizeLanguageHeader(acceptLanguage);
    console.log(`Fetching admin products with normalized language: ${language}`);

    // Get products based on language using the i18n product function
    const products = await getAllProducts(language);
    console.log(`Retrieved ${products.length} products from ${language} files`);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
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
