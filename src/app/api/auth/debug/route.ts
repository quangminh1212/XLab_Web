import { NextResponse } from 'next/server';

export async function GET() {
  // Kiểm tra biến môi trường trên server
  const vars = {
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Đã cấu hình' : 'Không có',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Đã cấu hình' : 'Không có',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Đã cấu hình' : 'Không có',
  };
  
  // Thêm các giá trị cứng hiện tại để so sánh
  const hardcoded = {
    GOOGLE_CLIENT_ID: "909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET: "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",
    NEXTAUTH_URL: "http://localhost:3000",
    NEXTAUTH_SECRET: "121200"
  };
  
  // Trả về thông tin
  return NextResponse.json({
    vars,
    hardcoded,
    note: "Đây là trang debug cho server-side của NextAuth",
    env_files: [".env", ".env.local", ".env.development"],
    cwd: process.cwd()
  });
} 