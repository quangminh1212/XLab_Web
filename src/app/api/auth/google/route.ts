import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Xây dựng URL đăng nhập Google
    const redirectUri = `${request.nextUrl.origin}/api/auth/callback/google`;
    const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth?" +
      "client_id=909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com" +
      "&redirect_uri=" + encodeURIComponent(redirectUri) +
      "&response_type=code" +
      "&scope=openid email profile" +
      "&access_type=offline" +
      "&prompt=consent";
    
    // Ghi log để debug
    console.log("Chuyển hướng đến URL Google Auth:", googleAuthUrl);
    
    // Chuyển hướng người dùng đến trang xác thực Google
    return NextResponse.redirect(googleAuthUrl);
  } catch (error) {
    console.error("Lỗi khi tạo URL chuyển hướng Google:", error);
    return NextResponse.redirect(`${request.nextUrl.origin}/login?error=redirect_failed`);
  }
} 