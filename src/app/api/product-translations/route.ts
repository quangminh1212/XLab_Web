import { NextResponse } from 'next/server';

/**
 * This endpoint has been removed. Please use /api/products/[id]?lang=<eng|vie> instead.
 */
export async function GET() {
  return NextResponse.json(
    {
      error: 'This endpoint is deprecated. Use /api/products/[id]?lang=<eng|vie> instead.'
    },
    { status: 410 }
  );
}
