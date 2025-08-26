import { NextResponse } from 'next/server';

import { getProductBySlug, incrementDownloadCount } from '@/lib/utils';

export async function GET(_request: Request) {
  try {
    // Get the slug from the URL
    const { searchParams } = new URL(_request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Get the product
    const product = getProductBySlug(slug);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Increment download count
    incrementDownloadCount(slug);

    // In a real application, we would handle authorization, check if the user has purchased the product,
    // and serve the actual download file. For this example, we'll just return success.

    return NextResponse.json({
      success: true,
      message: 'Download initiated successfully',
      product: {
        id: product.id,
        name: product.name,
        version: product.version,
        size: product.size,
        downloadCount: product.downloadCount,
      },
    });
  } catch (_error: any) {
    console.error('Error in download API:', _error);
    return NextResponse.json({ error: _error.message || 'Internal server error' }, { status: 500 });
  }
}
