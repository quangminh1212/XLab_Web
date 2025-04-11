import { NextResponse } from 'next/server';
import { products, stores } from '@/data/mockData';
import { Product } from '@/types';
import { getServerSession } from 'next-auth';

// Get all products
export async function GET() {
  return NextResponse.json(products);
}

// Add a new product
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession();
    
    if (!session || session.user?.email !== 'xlab.rnd@gmail.com') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const formData = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'name', 'slug', 'description', 'price', 
      'categoryId', 'imageUrl', 'version', 'size', 'licenseType'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Create new product
    const newProduct: Product = {
      id: `prod-${products.length + 1}`,
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      longDescription: formData.longDescription || formData.description,
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : 0,
      categoryId: formData.categoryId,
      imageUrl: formData.imageUrl,
      isFeatured: formData.isFeatured || false,
      isNew: formData.isNew || true,
      downloadCount: 0,
      viewCount: 0,
      rating: 0,
      version: formData.version,
      size: formData.size,
      licenseType: formData.licenseType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      storeId: formData.storeId || stores[0].id, // Default to first store if not specified
    };
    
    // Add to products array
    products.push(newProduct);
    
    return NextResponse.json(
      { success: true, product: newProduct },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { error: error.message || 'Error adding product' },
      { status: 500 }
    );
  }
} 