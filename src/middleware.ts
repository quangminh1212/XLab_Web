import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Hàm middleware đơn giản hóa, chỉ xử lý đường dẫn callback Google
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Debug
  console.log('Middleware xử lý đường dẫn:', pathname);

  // Xử lý đường dẫn callback từ Google OAuth - chỉ xử lý đường dẫn này
  if (pathname === '/auth/callback') {
    console.log('Google callback được phát hiện, chuyển hướng:', pathname);
    
    // Tạo URL mới chuyển hướng đến endpoint chính thức của NextAuth
    const url = new URL('/api/auth/callback/google', request.url);
    
    // Sao chép tất cả các query params
    url.search = request.nextUrl.search;
    
    console.log('Middleware chuyển hướng đến:', url.toString());
    
    // Chuyển hướng đến endpoint chính thức của NextAuth
    return NextResponse.redirect(url);
  }

  // Mặc định next() cho tất cả các trường hợp khác
  return NextResponse.next();
}

// Chỉ áp dụng middleware cho đường dẫn auth/callback, tránh xử lý quá nhiều
export const config = {
  matcher: [
    '/auth/callback',
  ],
} 