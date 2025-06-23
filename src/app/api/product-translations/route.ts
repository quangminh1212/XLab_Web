import { NextRequest, NextResponse } from 'next/server';
import { product as engProduct } from '@/locales/eng/product';
import { product as spaProduct } from '@/locales/spa/product';
import { product as vieProduct } from '@/locales/vie/product';
import * as localeDebug from '@/utils/localeDebug';
import { LanguageKeys } from '@/locales';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id') || '';
  const requestedLang = searchParams.get('lang') || 'en';
  
  // Map "eng" to "en" for compatibility with translations file
  const lang = requestedLang === 'eng' ? 'en' : requestedLang;

  if (!id) {
    const message = 'Product ID is required';
    localeDebug.logDebug('API error: ' + message, { path: request.nextUrl.pathname }, 'ERROR');
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
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
    
    // Log language mapping
    localeDebug.logDebug('API language mapping', { 
      original: lang, 
      mapped: localeLang, 
      path: request.nextUrl.pathname,
      productId: id
    }, 'INFO');
    
    // Get the appropriate locale product object
    let productTranslations;
    if (localeLang === 'eng') {
      productTranslations = engProduct;
    } else if (localeLang === 'spa') {
      productTranslations = spaProduct;
    } else if (localeLang === 'vie') {
      productTranslations = vieProduct;
    }
    
<<<<<<< HEAD
    // Check if we have translations in the structure
    if (productTranslations?.products && id in productTranslations.products) {
      const translation = (productTranslations.products as Record<string, any>)[id];
      localeDebug.logDebug(`Found translation for product ${id}`, { 
        language: localeLang as LanguageKeys,
        path: request.nextUrl.pathname,
        keysFound: Object.keys(translation).length
      }, 'INFO');
      return NextResponse.json(translation);
=======
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
>>>>>>> 77d40f007c10996d4a8a25a577d10a9b0f3ca33d
    }
    
    // If not found in any of the locales
    localeDebug.logDebug(`No translation found for product ${id}`, {
      language: localeLang as LanguageKeys,
      path: request.nextUrl.pathname,
      timestamp: new Date().toISOString()
    }, 'WARN');
    return NextResponse.json({ message: 'No translation available' }, { status: 404 });
  } catch (error) {
    localeDebug.logDebug('Error fetching product translation', {
      error: error instanceof Error ? error.message : String(error),
      path: request.nextUrl.pathname,
      productId: id,
      language: lang
    }, 'ERROR');
    return NextResponse.json({ error: 'Failed to fetch translation' }, { status: 500 });
  }
} 