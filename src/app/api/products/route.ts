import { NextResponse } from 'next/server';
import { products } from '@/data/mockData';

export async function GET(request: Request) {
  try {
    // Lọc chỉ lấy sản phẩm VoiceTyping - sản phẩm thực tế duy nhất
    const realProducts = products.filter(product => product.id === 'prod-vt');
    
    return NextResponse.json({ 
      success: true, 
      data: realProducts
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 