import { NextResponse } from "next/server";

// API endpoint tạm thời để test đăng nhập Google
export async function GET() {
  // Tạo URL đăng nhập Google với các tham số cần thiết
  const params = new URLSearchParams({
    client_id: "909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com",
    redirect_uri: "http://localhost:3000/api/auth/callback/google",
    response_type: "code",
    scope: "openid email profile",
    state: "nextauth-google-" + Math.random().toString(36).substring(2),
    prompt: "consent",
    access_type: "offline"
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  
  // Chuyển hướng người dùng đến URL đăng nhập Google
  return NextResponse.redirect(url);
} 