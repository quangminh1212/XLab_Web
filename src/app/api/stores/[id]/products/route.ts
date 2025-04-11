import { NextResponse } from 'next/server';
import { products, stores } from '@/data/mockData';
import { Product } from '@/types';
import { getServerSession } from 'next-auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const storeId = params.id;
    
    // Validate store exists
    const store = stores.find(store => store.id === storeId);
    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }
    
    // Get products for this store
    const storeProducts = products.filter(product => product.storeId === storeId);
    
    return NextResponse.json(storeProducts);
  } catch (error: any) {
    console.error('Error getting store products:', error);
    return NextResponse.json(
      { error: error.message || 'Error getting store products' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession();
    
    if (!session || session.user?.email !== 'xlab.rnd@gmail.com') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    const storeId = params.id;
    
    // Validate store exists
    const store = stores.find(store => store.id === storeId);
    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
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
      storeId: storeId,
    };
    
    // Add to products array
    products.push(newProduct);
    
    return NextResponse.json(
      { success: true, product: newProduct },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error adding store product:', error);
    return NextResponse.json(
      { error: error.message || 'Error adding store product' },
      { status: 500 }
    );
  }
} 