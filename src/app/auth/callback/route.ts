import { NextRequest, NextResponse } from "next/server";

// Xử lý callback từ Google OAuth
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  console.log("Google OAuth callback:", Object.fromEntries(searchParams.entries()));
  
  // Chuyển hướng đến endpoint chính thức của NextAuth
  const nextAuthUrl = new URL("/api/auth/callback/google", request.url);
  
  // Sao chép query parameters
  nextAuthUrl.search = searchParams.toString();
  
  // Log và redirect
  console.log("Chuyển hướng đến NextAuth endpoint:", nextAuthUrl.toString());
  return NextResponse.redirect(nextAuthUrl);
} 