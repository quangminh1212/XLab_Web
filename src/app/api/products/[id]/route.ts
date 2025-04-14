import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/data/mockData'; // Import the original data for now
import { Product } from '@/types';

// Temporary in-memory storage. In a real app, you'd interact with a database.
// It's better to manage the state in the main route or a dedicated service,
// but for simplicity, we'll re-filter the original list here.
// A more robust solution would share the 'currentProducts' state.
let currentProducts: Product[] = [...products];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const product = currentProducts.find(p => p.id === productId);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(`Error fetching product ${params.id}:`, error);
    return NextResponse.json({ message: 'Error fetching product' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const productIndex = currentProducts.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const updatedData = await request.json();

    // Basic validation
    if (!updatedData.name || !updatedData.slug || !updatedData.price || !updatedData.categoryId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const updatedProduct = {
      ...currentProducts[productIndex], // Keep existing fields
      ...updatedData,                 // Overwrite with new data
      id: productId,                 // Ensure ID doesn't change
      updatedAt: new Date().toISOString(), // Update timestamp
    };

    currentProducts[productIndex] = updatedProduct;

    return NextResponse.json(updatedProduct);

  } catch (error) {
    console.error(`Error updating product ${params.id}:`, error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON format' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error updating product' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const initialLength = currentProducts.length;
    currentProducts = currentProducts.filter(p => p.id !== productId);

    if (currentProducts.length === initialLength) {
      // No product was removed, meaning it wasn't found
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Return a success response, usually with no content
    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error(`Error deleting product ${params.id}:`, error);
    return NextResponse.json({ message: 'Error deleting product' }, { status: 500 });
  }
} 