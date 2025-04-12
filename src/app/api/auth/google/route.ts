import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Xác định origin dựa trên host
    const isLocalhost = request.headers.get('host')?.includes('localhost') || false;
    const origin = isLocalhost ? 'http://localhost:3000' : `https://${request.headers.get('host')}`;
    
    console.log("Google Auth API - Origin:", origin);
    console.log("Host header:", request.headers.get('host'));
    
    // Xây dựng URL đăng nhập Google với origin đã tính toán
    const redirectUri = `${origin}/api/auth/callback/google`;
    
    // Hardcode URL đăng nhập Google
    const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth" +
      "?client_id=909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com" +
      "&redirect_uri=" + encodeURIComponent(redirectUri) +
      "&response_type=code" +
      "&scope=openid%20email%20profile" +
      "&access_type=offline" +
      "&prompt=consent";
    
    // Ghi log để debug
    console.log("Chuyển hướng đến Google Auth:", googleAuthUrl);
    
    // Chuyển hướng người dùng đến trang xác thực Google với status 302
    return NextResponse.redirect(googleAuthUrl, { status: 302 });
  } catch (error) {
    console.error("Lỗi khi tạo URL chuyển hướng Google:", error);
    // Xác định origin dựa trên host khi có lỗi
    const isLocalhost = request.headers.get('host')?.includes('localhost') || false;
    const origin = isLocalhost ? 'http://localhost:3000' : `https://${request.headers.get('host')}`;
    return NextResponse.redirect(`${origin}/login?error=redirect_failed`, { status: 302 });
  }
} 