import { NextResponse } from 'next/server';

export async function GET() {
  // Lấy biến môi trường
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
  const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "";
  const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "";
  
  // Kiểm tra GOOGLE_CLIENT_ID và các biến môi trường khác
  const envStatus = {
    GOOGLE_CLIENT_ID: !!GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_ID_VALUE: GOOGLE_CLIENT_ID.substring(0, 10) + "...",
    GOOGLE_CLIENT_SECRET: !!GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_SECRET_VALUE: GOOGLE_CLIENT_SECRET ? GOOGLE_CLIENT_SECRET.substring(0, 5) + "..." : "",
    NEXTAUTH_URL,
    NEXTAUTH_SECRET: !!NEXTAUTH_SECRET,
  };
  
  return NextResponse.json({ 
    status: "success", 
    message: "Kiểm tra OAuth API",
    env: envStatus,
    callback_url: `${NEXTAUTH_URL}/api/auth/callback/google`,
  });
} 