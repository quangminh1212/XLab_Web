import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id') || '';
  const lang = searchParams.get('lang') || 'eng';
  const useOriginalStructure = searchParams.get('useOriginalStructure') === 'true';

  console.log(`API call: id=${id}, lang=${lang}, useOriginalStructure=${useOriginalStructure}`);

  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    // Use language-specific files in their respective folders
    const langPath = path.join(process.cwd(), `src/locales/${lang}/products.json`);
    const productsPath = path.join(process.cwd(), 'src/data/products.json');
    
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

    if (!fs.existsSync(productsPath)) {
      console.error('Products file not found');
      return NextResponse.json({ error: 'Products file not found' }, { status: 404 });
    }
    
    let translations;
    let products;
    
    try {
      // Read the language-specific file
      const translationsData = fs.existsSync(langPath) 
        ? fs.readFileSync(langPath, 'utf8') 
        : fs.readFileSync(path.join(process.cwd(), 'src/locales/eng/products.json'), 'utf8');
      
      const productsData = fs.readFileSync(productsPath, 'utf8');
      
      translations = JSON.parse(translationsData);
      products = JSON.parse(productsData);
      
      console.log(`Products length: ${products.length}`);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return NextResponse.json({ error: 'Error parsing JSON data', details: String(parseError) }, { status: 500 });
    }

    // Find product by ID
    const product = Array.isArray(products) 
      ? products.find((p: any) => p.id === id)
      : null;
    
    if (!product) {
      console.error(`Product not found with ID: ${id}`);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
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
          features: translatedData.features || product.features,
          productOptions: translatedData.productOptions || product.productOptions,
          options: translatedData.options || product.options
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
    return NextResponse.json({ error: 'Failed to fetch translation', details: String(error) }, { status: 500 });
  }
} 