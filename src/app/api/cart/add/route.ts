import { NextResponse } from 'next/server';

import { getProductBySlug } from '@/lib/utils';
import { products } from '@/data/mockData';

// In a real application, this would interact with a database or session store
// For now, we'll use a mock implementation
export async function GET(request: Request) {
  try {
    // Get the product ID from the URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const quantity = Number(searchParams.get('quantity')) || 1;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Find the product by ID or slug
    const product = products.find((p) => p.id === id || p.slug === id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // In a real application, we would add the product to the user's cart
    // For this demo, we'll just return success with the product details

    return NextResponse.json({
      success: true,
      message: 'Product added to cart successfully',
      product: {
        id: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        quantity: quantity,
        image: product.imageUrl,
      },
    });
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
