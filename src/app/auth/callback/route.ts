import { NextRequest, NextResponse } from 'next/server';

// Xử lý callback trực tiếp từ Google thông qua đường dẫn /auth/callback
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  console.log('Google Callback trực tiếp được nhận', {
    url: request.url,
    fullUrl: request.nextUrl.toString(),
    pathname: request.nextUrl.pathname,
    params: Object.fromEntries(searchParams.entries())
  });
  
  // Kiểm tra nếu có lỗi từ Google OAuth
  if (searchParams.has('error')) {
    const error = searchParams.get('error');
    console.error('Google OAuth trả về lỗi:', error);
    
    // Chuyển hướng về trang đăng nhập với thông báo lỗi
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'google');
    loginUrl.searchParams.set('error_description', error || 'unknown_error');
    return NextResponse.redirect(loginUrl);
  }
  
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