import fs from 'fs';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';

import { getProductById } from '@/lib/i18n/products';

/**
 * @deprecated Use /api/products/[id] with lang parameter instead
 */
export async function GET(_request: NextRequest) {
  const searchParams = _request.nextUrl.searchParams;
  const id = searchParams.get('id') || '';
  const requestedLang = searchParams.get('lang') || 'en';
  
  // Map "en" to "eng" and "vi" to "vie" for compatibility with i18n structure
  const lang = requestedLang === 'en' ? 'eng' : (requestedLang === 'vi' ? 'vie' : requestedLang);

  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    console.log(`Translation request for id: ${id}, lang: ${lang}`);
    
    // Use the i18n product system instead of the old translations file
    const product = await getProductById(id, lang);
    
    if (product) {
      console.log(`Found translation for ${id} in language ${lang}`);
      
      // Extract only the translation-relevant fields
      const translation = {
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        features: product.features || [],
        productOptions: product.optionPrices ? 
          Object.keys(product.optionPrices).reduce((acc, key) => {
            acc[key] = key; // Use the same key as value for now
            return acc;
          }, {} as Record<string, string>) : 
          {},
        options: "Options"
      };
      
      return NextResponse.json(translation);
    } else {
      console.log(`No translation found for ${id} in language ${lang}`);
      return NextResponse.json({ message: 'No translation available' }, { status: 404 });
    }
  } catch (_error) {
    console.error('Error fetching product translation:', _error);
    return NextResponse.json({ error: 'Failed to fetch translation' }, { status: 500 });
  }
} 