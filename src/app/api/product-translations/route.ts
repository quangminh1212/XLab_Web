import { NextRequest, NextResponse } from 'next/server';
import { product as engProduct } from '@/locales/eng/product';
import { product as spaProduct } from '@/locales/spa/product';
import { product as vieProduct } from '@/locales/vie/product';
import * as localeDebug from '@/utils/localeDebug';
import { LanguageKeys } from '@/locales';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id') || '';
  const lang = searchParams.get('lang') || 'eng';
  const useOriginalStructure = searchParams.get('useOriginalStructure') === 'true';

  console.log(`API call: id=${id}, lang=${lang}, useOriginalStructure=${useOriginalStructure}`);

  if (!id) {
    const message = 'Product ID is required';
    localeDebug.logDebug('API error: ' + message, { path: request.nextUrl.pathname }, 'ERROR');
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
<<<<<<< HEAD
    // Use language-specific files in their respective folders
    const langPath = path.join(process.cwd(), `src/locales/${lang}/products.json`);
    const viePath = path.join(process.cwd(), 'src/locales/vie/products.json');

    if (!fs.existsSync(langPath)) {
      console.error(`Language file not found: ${lang}/products.json`);
      // If the requested language file doesn't exist, fallback to English
      if (lang !== 'eng') {
        console.log(`Falling back to English translations`);
        const engPath = path.join(process.cwd(), 'src/locales/eng/products.json');
        if (!fs.existsSync(engPath)) {
          return NextResponse.json({ error: 'Translation files not found' }, { status: 404 });
        }
      } else {
        return NextResponse.json({ error: 'Translation files not found' }, { status: 404 });
      }
    }

    if (!fs.existsSync(viePath)) {
      console.error('Vietnamese products file not found');
      return NextResponse.json({ error: 'Base products file not found' }, { status: 404 });
    }

    let translations;
    let vieProducts;

    try {
      // Read the language-specific file
      const translationsData = fs.existsSync(langPath)
        ? fs.readFileSync(langPath, 'utf8')
        : fs.readFileSync(path.join(process.cwd(), 'src/locales/eng/products.json'), 'utf8');

      const vieProductsData = fs.readFileSync(viePath, 'utf8');

      translations = JSON.parse(translationsData);
      vieProducts = JSON.parse(vieProductsData);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return NextResponse.json(
        { error: 'Error parsing JSON data', details: String(parseError) },
        { status: 500 },
      );
    }

    // Find product by ID in Vietnamese data
    if (!vieProducts[id]) {
      console.error(`Product not found with ID: ${id}`);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = {
      id,
      ...vieProducts[id],
      slug: id,
    };

    console.log(`Found product: ${product.name}`);

    // Use original if language is Vietnamese
    if (lang === 'vie') {
      return NextResponse.json(product);
    }

    // If there is a translation for this product
    if (translations && translations[id]) {
      const translatedData = translations[id];
      console.log(`Found translation for ${id} in ${lang}`);

      // If using original structure from Vietnamese
      if (useOriginalStructure) {
        const mergedData = {
          ...product,
          name: translatedData.name || product.name,
          shortDescription: translatedData.shortDescription || product.shortDescription,
          description: translatedData.description || product.description,
          productOptions: translatedData.productOptions || product.productOptions,
          options: translatedData.options || product.options,
        };

        return NextResponse.json(mergedData);
      }

      // Return translation
      return NextResponse.json(translatedData);
    }

    console.log(`No translation found for ${id} in ${lang}, returning original product`);

    // If no translation, return original
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product translation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch translation', details: String(error) },
      { status: 500 },
    );
=======
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
    
    // Check if we have translations in the structure
    if (productTranslations?.products && id in productTranslations.products) {
      const translation = (productTranslations.products as Record<string, any>)[id];
      localeDebug.logDebug(`Found translation for product ${id}`, { 
        language: localeLang as LanguageKeys,
        path: request.nextUrl.pathname,
        keysFound: Object.keys(translation).length
      }, 'INFO');
      return NextResponse.json(translation);
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
>>>>>>> 8b81a835c3132e7388e78c2b20148965af49f470
  }
}
