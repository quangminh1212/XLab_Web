import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { product as engProduct } from '@/locales/eng/product';
import { product as spaProduct } from '@/locales/spa/product';
import { product as vieProduct } from '@/locales/vie/product';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id') || '';
  const lang = searchParams.get('lang') || 'en';

  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    // First, check if we have the translation in the restructured locale files
    console.log(`Translation request for id: ${id}, lang: ${lang}`);
    
    // Map API language code to locale language code
    const langMap: Record<string, string> = {
      'en': 'eng',
      'eng': 'eng',
      'es': 'spa', 
      'spa': 'spa',
      'vi': 'vie',
      'vie': 'vie'
    };
    
    const localeLang = langMap[lang] || lang;
    
    // Get the appropriate locale product object
    let productTranslations;
    if (localeLang === 'eng') {
      productTranslations = engProduct;
    } else if (localeLang === 'spa') {
      productTranslations = spaProduct;
    } else if (localeLang === 'vie') {
      productTranslations = vieProduct;
    }
    
    // Check if we have translations in the new nested structure
    if (productTranslations?.products && id in productTranslations.products) {
      console.log(`Found translation for ${id} in locale files`);
      return NextResponse.json((productTranslations.products as Record<string, any>)[id]);
    }
    
    // If not found in the new structure, try the legacy JSON file
    const translationsPath = path.join(process.cwd(), 'src/data/product_translations.json');
    
    if (!fs.existsSync(translationsPath)) {
      return NextResponse.json({ error: 'Translations file not found' }, { status: 404 });
    }
    
    const translationsData = fs.readFileSync(translationsPath, 'utf8');
    const translations = JSON.parse(translationsData);

    // Map the language codes for the JSON file
    const jsonLangMap: Record<string, string> = {
      'eng': 'en',
      'en': 'en',
      'spa': 'en', // Temporarily use English for Spanish if not found in Spanish
      'es': 'en',
      'vie': 'en',
      'vi': 'en'
    };
    
    const jsonLang = jsonLangMap[localeLang] || 'en';
    
    console.log(`Available translations for ${jsonLang}:`, Object.keys(translations[jsonLang] || {}));

    // Kiểm tra nếu có bản dịch cho sản phẩm này với ngôn ngữ được chỉ định
    if (translations[jsonLang] && translations[jsonLang][id]) {
      console.log(`Found translation for ${id} in JSON file`);
      return NextResponse.json(translations[jsonLang][id]);
    } else {
      console.log(`No translation found for ${id} in language ${lang}`);
      return NextResponse.json({ message: 'No translation available' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching product translation:', error);
    return NextResponse.json({ error: 'Failed to fetch translation' }, { status: 500 });
  }
} 