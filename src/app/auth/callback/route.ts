import { NextRequest, NextResponse } from 'next/server';

// Xử lý callback trực tiếp từ Google thông qua đường dẫn /auth/callback
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  console.log('Google Callback trực tiếp được nhận', {
    url: request.url,
    params: Object.fromEntries(searchParams.entries())
  });
  
  // Tạo URL mới đến NextAuth callback endpoint
  const nextAuthCallbackUrl = new URL('/api/auth/callback/google', request.url);
  
  // Sao chép toàn bộ query parameters
  nextAuthCallbackUrl.search = searchParams.toString();
  
  console.log('Chuyển hướng callback Google đến NextAuth:', nextAuthCallbackUrl.toString());
  
  // Chuyển hướng đến NextAuth endpoint
  return NextResponse.redirect(nextAuthCallbackUrl);
}

// Xử lý các request khác
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Phương thức không được hỗ trợ' },
    { status: 405 }
  );
} 