import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const origin = request.headers.get('host')?.includes('localhost') 
      ? 'http://localhost:3000' 
      : `https://${request.headers.get('host')}`;
    
    // Xây dựng URL đăng nhập Google với hardcode các giá trị
    const redirectUri = `${origin}/api/auth/callback/google`;
    
    // Sử dụng URL đã được mã hóa sẵn để đảm bảo không có vấn đề về mã hóa URL
    const googleAuthUrl = 
      "https://accounts.google.com/o/oauth2/v2/auth" +
      "?client_id=909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com" +
      "&redirect_uri=" + encodeURIComponent(redirectUri) +
      "&response_type=code" +
      "&scope=openid%20email%20profile" +
      "&access_type=offline" +
      "&prompt=consent";
    
    // Ghi log để debug
    console.log("Google Auth URL:", googleAuthUrl);
    console.log("Redirect URI:", redirectUri);
    console.log("Origin:", origin);
    
    // Chuyển hướng người dùng đến trang xác thực Google
    return NextResponse.redirect(googleAuthUrl, { status: 302 });
  } catch (error) {
    console.error("Lỗi khi tạo URL chuyển hướng Google:", error);
    return NextResponse.redirect(`/login?error=redirect_failed`, { status: 302 });
  }
} 