import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  // Lấy biến môi trường
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
  const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "";
  const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "";
  
  // Lấy headers
  const headersList = headers();
  const host = headersList.get('host') || 'localhost';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  
  // Kiểm tra GOOGLE_CLIENT_ID và các biến môi trường khác
  const envStatus = {
    GOOGLE_CLIENT_ID: !!GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_ID_VALUE: GOOGLE_CLIENT_ID ? GOOGLE_CLIENT_ID.substring(0, 10) + "..." : "KHÔNG CÓ",
    GOOGLE_CLIENT_SECRET: !!GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_SECRET_VALUE: GOOGLE_CLIENT_SECRET ? GOOGLE_CLIENT_SECRET.substring(0, 5) + "..." : "KHÔNG CÓ",
    NEXTAUTH_URL,
    NEXTAUTH_SECRET: !!NEXTAUTH_SECRET,
    NODE_ENV: process.env.NODE_ENV || 'development'
  };
  
  // Thông tin về callback URLs
  const callbackInfo = {
    configured_callback: `${NEXTAUTH_URL}/api/auth/callback/google`,
    detected_callback: `${protocol}://${host}/api/auth/callback/google`,
    suggestion: `Đảm bảo URL này được thêm vào Authorized redirect URIs trong Google Console`
  };
  
  return NextResponse.json({ 
    status: "success", 
    message: "Kiểm tra OAuth API",
    env: envStatus,
    callback_urls: callbackInfo,
    headers: {
      host,
      protocol,
      referer: headersList.get('referer') || 'none',
      userAgent: headersList.get('user-agent') || 'none',
    },
    tips: [
      "Đảm bảo GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET đã được cấu hình trong .env.local",
      "Kiểm tra URL callback trong Google Console có đúng không",
      "Đảm bảo dự án Google Cloud đã bật API Google+ API"
    ]
  });
} 