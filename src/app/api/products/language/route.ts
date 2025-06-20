import { NextResponse } from 'next/server';
import { productsData } from '@/locales/productsData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'vie'; // Default to Vietnamese
    const categoryId = searchParams.get('categoryId');
    const exclude = searchParams.get('exclude');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    // Determine which language data to use
    const supportedLanguages = ['eng', 'vie', 'spa', 'chi'];
    const language = supportedLanguages.includes(lang) ? lang : 'vie';
    
    let productList = [];
    if (productsData[language as keyof typeof productsData]) {
      productList = productsData[language as keyof typeof productsData];
      console.log(`Retrieved ${productList.length} products from localized data (${language})`);
    } else {
      console.log(`No products found for language: ${language}`);
      return NextResponse.json(
        {
          success: false,
          error: `Language ${language} not supported`,
        },
        { status: 404 }
      );
    }

    // Chỉ lấy sản phẩm được xuất bản
    productList = productList.filter((p) => p.isPublished);
    console.log(`Found ${productList.length} published products`);

    // Lọc theo categoryId nếu được cung cấp
    if (categoryId) {
      productList = productList.filter((p) => {
        if (!p.categories) return false;
        
        return p.categories.some((cat) => {
          if (typeof cat === 'string') return cat === categoryId;
          
          // Xử lý cấu trúc phức tạp của categories
          const catId = cat.id;
          if (typeof catId === 'string') return catId === categoryId;
          if (typeof catId === 'object' && catId && 'id' in catId) {
            return catId.id === categoryId;
          }
          return false;
        });
      });
      
      console.log(`Filtered to ${productList.length} products in category ${categoryId}`);
    }

    // Exclude sản phẩm nếu được chỉ định
    if (exclude) {
      productList = productList.filter((p) => p.id !== exclude);
      console.log(`Excluded product ${exclude}, ${productList.length} products remaining`);
    }

    // Giới hạn số lượng kết quả nếu được chỉ định
    const limitedProducts = limit ? productList.slice(0, limit) : productList;

    return NextResponse.json(
      {
        success: true,
        data: limitedProducts,
        total: productList.length,
        language: language
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error fetching localized products:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 },
    );
  }
} 