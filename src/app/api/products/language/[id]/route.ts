import { NextResponse } from 'next/server';
import { productsData } from '@/locales/productsData';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: productId } = params;
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'vie'; // Default to Vietnamese

    // Determine which language data to use
    const supportedLanguages = ['eng', 'vie', 'spa', 'chi'];
    const language = supportedLanguages.includes(lang) ? lang : 'vie';
    
    console.log(`Tìm kiếm sản phẩm ${productId} trong ngôn ngữ ${language}`);
    
    if (productsData[language as keyof typeof productsData]) {
      const localizedProducts = productsData[language as keyof typeof productsData];
      
      // Tìm sản phẩm theo slug trước (ưu tiên tìm theo slug để cải thiện SEO)
      let product = localizedProducts.find((p) => p.slug === productId);
      
      // Nếu không tìm thấy bằng slug, thử tìm bằng id
      if (!product) {
        product = localizedProducts.find((p) => p.id === productId);
      }

      if (product) {
        console.log(`Đã tìm thấy sản phẩm ${product.name} trong ngôn ngữ ${language}`);
        return NextResponse.json(
          {
            success: true,
            data: product,
            language: language
          },
          { status: 200 },
        );
      }
    }

    console.log(`Không tìm thấy sản phẩm ${productId} trong ngôn ngữ ${language}`);
    return NextResponse.json(
      {
        success: false,
        error: `Product ${productId} not found in language ${language}`,
      },
      { status: 404 }
    );
  } catch (error: any) {
    console.error('Error fetching localized product:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 },
    );
  }
} 