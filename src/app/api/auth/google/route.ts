import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // URL redirect phải CHÍNH XÁC khớp với cấu hình trong Google Cloud Console
    // Đảm bảo URL này giống hệt với cấu hình "Authorized redirect URIs" trong Google Cloud Console
    const redirectUri = 'https://xlab-web.vercel.app/api/auth/callback/google';
    
    console.log("Google Auth API - Sử dụng redirect URI:", redirectUri);
    
    // URL đăng nhập Google được tạo với các thông số cố định
    // Chú ý: URL redirect đã được mã hóa đúng cách
    const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth" +
      "?client_id=909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com" +
      "&redirect_uri=" + encodeURIComponent(redirectUri) +
      "&response_type=code" +
      "&scope=openid%20email%20profile" +
      "&access_type=offline" +
      "&prompt=consent";
    
    // Ghi log URL đầy đủ để kiểm tra
    console.log("URL đăng nhập Google đầy đủ:", googleAuthUrl);
    
    // Chuyển hướng người dùng đến trang xác thực Google với status 302
    return NextResponse.redirect(googleAuthUrl, { status: 302 });
  } catch (error) {
    console.error("Lỗi khi tạo URL chuyển hướng Google:", error);
    return NextResponse.redirect(`https://xlab-web.vercel.app/login?error=redirect_failed`, { status: 302 });
  }
} 