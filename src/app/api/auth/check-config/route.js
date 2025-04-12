import { NextResponse } from "next/server";

export async function GET() {
  const CLIENT_ID = "909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com";
  const CLIENT_SECRET = "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";

  // Tạo URL đăng nhập Google mà không qua NextAuth
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: "http://localhost:3000/api/auth/callback/google",
    response_type: "code",
    scope: "email profile",
    access_type: "offline",
    prompt: "consent",
  });

  // URL chuyển hướng trực tiếp đến Google
  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  return NextResponse.json({
    client_id: CLIENT_ID.substring(0, 15) + "...",
    client_secret_exists: !!CLIENT_SECRET, 
    googleUrl,
    note: "Hãy thử truy cập URL trong phần 'googleUrl' để xác thực trực tiếp với Google"
  });
} 