import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Product } from '@/models/ProductModel';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST() {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the Vietnamese products data
    const dataFilePath = path.join(process.cwd(), 'src/locales/vie/products.json');
    
    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json({ error: 'Products file does not exist' }, { status: 404 });
    }
    
    // Read the file
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    const jsonData = JSON.parse(rawData);
    
    // Process each product to ensure it has all required fields
    const fixedProducts = Object.entries(jsonData).reduce((acc, [id, data]: [string, any]) => {
      // Ensure the product has all required fields
      const fixedProduct = {
        ...data,
        name: data.name || `Product ${id}`,
        description: data.description || '',
        shortDescription: data.shortDescription || '',
        productOptions: data.productOptions || {
          'Standard': {
            price: 100000, 
            originalPrice: 200000
          }
        }
      };
      
      // Ensure default option exists and is valid
      if (!data.options || !Object.keys(fixedProduct.productOptions).includes(data.options)) {
        fixedProduct.options = Object.keys(fixedProduct.productOptions)[0];
      }
      
      acc[id] = fixedProduct;
      return acc;
    }, {} as Record<string, any>);
    
    // Write the fixed data back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(fixedProducts, null, 2), 'utf8');
    
    return NextResponse.json({ 
      success: true,
      message: 'Products data fixed successfully',
      productsCount: Object.keys(fixedProducts).length
    });
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

// For GET requests, we'll just check the data without modifying it
export async function GET() {
  try {
    // Get the Vietnamese products data
    const dataFilePath = path.join(process.cwd(), 'src/locales/vie/products.json');
    
    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json({ error: 'Products file does not exist' }, { status: 404 });
    }
    
    // Read the file
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    const jsonData = JSON.parse(rawData);
    
    // Count products with issues
    const issues = Object.entries(jsonData).filter(([id, data]: [string, any]) => {
      return (
        !data.name || 
        !data.description || 
        !data.shortDescription || 
        !data.productOptions || 
        Object.keys(data.productOptions).length === 0 ||
        !data.options ||
        !Object.keys(data.productOptions).includes(data.options)
      );
    });
    
    return NextResponse.json({ 
      success: true,
      totalProducts: Object.keys(jsonData).length,
      issuesCount: issues.length,
      issues: issues.map(([id]) => id)
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
} 