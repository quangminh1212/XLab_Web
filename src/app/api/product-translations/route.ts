import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id') || '';
  const lang = searchParams.get('lang') || 'en';

  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    // Đọc file dịch
    const translationsPath = path.join(process.cwd(), 'src/data/product_translations.json');
    
    if (!fs.existsSync(translationsPath)) {
      return NextResponse.json({ error: 'Translations file not found' }, { status: 404 });
    }
    
    const translationsData = fs.readFileSync(translationsPath, 'utf8');
    const translations = JSON.parse(translationsData);

    // Kiểm tra nếu có bản dịch cho sản phẩm này với ngôn ngữ được chỉ định
    if (translations[lang] && translations[lang][id]) {
      return NextResponse.json(translations[lang][id]);
    } else {
      return NextResponse.json({ message: 'No translation available' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching product translation:', error);
    return NextResponse.json({ error: 'Failed to fetch translation' }, { status: 500 });
  }
} 