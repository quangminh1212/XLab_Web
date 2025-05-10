import { NextResponse } from 'next/server';
import { products } from '@/data/mockData';

export async function GET(request: Request) {
  try {
    return NextResponse.json({ 
      success: true, 
      data: products
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 