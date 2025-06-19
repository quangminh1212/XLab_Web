import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Product } from '@/models/ProductModel';
import JSON5 from 'json5';

export async function GET() {
  try {
    // Get the Vietnamese products data
    const dataFilePath = path.join(process.cwd(), 'src/locales/vie/products.json');
    
    let diagnostics = {
      fileExists: false,
      fileReadable: false,
      validJson: false,
      productCount: 0,
      productsAnalysis: [] as any[],
      isError: false,
      errorMessage: ''
    };
    
    // Check if file exists
    diagnostics.fileExists = fs.existsSync(dataFilePath);
    
    if (!diagnostics.fileExists) {
      diagnostics.isError = true;
      diagnostics.errorMessage = 'Products file does not exist';
      return NextResponse.json(diagnostics);
    }
    
    // Try to read the file
    try {
      const rawData = fs.readFileSync(dataFilePath, 'utf8');
      diagnostics.fileReadable = true;
      
      // Try to parse the JSON
      try {
        const jsonData = JSON.parse(rawData);
        diagnostics.validJson = true;
        
        // Convert to array of products
        const productList = Object.entries(jsonData).map(([id, data]: [string, any]) => {
          const product = {
            id,
            ...data,
            slug: id,
            isPublished: true
          };
          
          // Analyze each product
          const analysis = {
            id,
            name: !!data.name,
            description: !!data.description,
            shortDescription: !!data.shortDescription,
            productOptions: !!data.productOptions,
            optionsCount: Object.keys(data.productOptions || {}).length,
            defaultOption: !!data.options,
            defaultOptionValid: data.options && data.productOptions && Object.keys(data.productOptions).includes(data.options),
            hasPrice: false,
            price: 0
          };
          
          // Check if product has price info
          if (data.productOptions && Object.keys(data.productOptions).length > 0) {
            const firstOptionKey = Object.keys(data.productOptions)[0];
            const firstOption = data.productOptions[firstOptionKey];
            analysis.hasPrice = !!firstOption?.price;
            analysis.price = firstOption?.price || 0;
          }
          
          diagnostics.productsAnalysis.push(analysis);
          return product;
        });
        
        diagnostics.productCount = productList.length;
      } catch (err) {
        diagnostics.validJson = false;
        diagnostics.isError = true;
        diagnostics.errorMessage = 'Invalid JSON format: ' + (err as Error).message;
      }
    } catch (err) {
      diagnostics.fileReadable = false;
      diagnostics.isError = true;
      diagnostics.errorMessage = 'Could not read file: ' + (err as Error).message;
    }
    
    return NextResponse.json(diagnostics);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 