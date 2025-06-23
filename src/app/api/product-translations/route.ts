import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id') || '';
  const requestedLang = searchParams.get('lang') || 'en';
  
  // Map "eng" to "en" for compatibility with translations file
  const lang = requestedLang === 'eng' ? 'en' : requestedLang;

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

    console.log(`Translation request for id: ${id}, lang: ${requestedLang}`);
    console.log(`Available translations for ${lang}:`, Object.keys(translations[lang] || {}));

    // Kiểm tra nếu có bản dịch cho sản phẩm này với ngôn ngữ được chỉ định
    if (translations[lang] && translations[lang][id]) {
      console.log(`Found translation for ${id}`);
      return NextResponse.json(translations[lang][id]);
    } else {
      console.log(`No translation found for ${id} in language ${requestedLang}`);
      return NextResponse.json({ message: 'No translation available' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching product translation:', error);
    return NextResponse.json({ error: 'Failed to fetch translation' }, { status: 500 });
  }
} 