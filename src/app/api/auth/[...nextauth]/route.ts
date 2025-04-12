import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
// import { compare } from 'bcrypt';
// import { PrismaAdapter } from '@next-auth/prisma-adapter';
// import prisma from '@/lib/prisma';

// Mở rộng type Session để thêm accessToken và id
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

// Kiểm tra biến môi trường cho Google OAuth
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

// Ghi log rõ ràng để debug
console.log("=== THÔNG TIN CẤU HÌNH NEXTAUTH ===");
console.log("GOOGLE_CLIENT_ID:", GOOGLE_CLIENT_ID ? "Đã cấu hình" : "Chưa cấu hình");
console.log("GOOGLE_CLIENT_SECRET:", GOOGLE_CLIENT_SECRET ? "Đã cấu hình" : "Chưa cấu hình");
console.log("NEXTAUTH_URL:", NEXTAUTH_URL || "Chưa cấu hình");

console.log("Initializing NextAuth...");

// Khởi tạo NextAuth Options
export const authOptions: NextAuthOptions = {
  debug: true,
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      // Xác định trực tiếp URL callback
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        }
      },
      // Hạn chế các vấn đề với URL callback bằng cách xử lý token trực tiếp
      async profile(profile) {
        console.log("Profile callback của Google:", profile.email);
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture
        };
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log("Bắt đầu xác thực với credentials");
        
        if (!credentials?.email || !credentials?.password) {
          console.error("Thiếu email hoặc mật khẩu");
          throw new Error("Vui lòng nhập đầy đủ thông tin");
        }
        
        // Đơn giản hóa xác thực để tránh lỗi từ Prisma
        if (credentials.email === "test@example.com" && credentials.password === "password") {
          console.log("Đăng nhập thành công với tài khoản test");
          return {
            id: "1",
            name: "Test User",
            email: credentials.email
          };
        }
        
        console.log("Thông tin đăng nhập không chính xác");
        return null;
        
        // try {
        //   const user = await prisma.user.findUnique({
        //     where: { email: credentials.email }
        //   });
        //   
        //   if (!user) {
        //     console.log("Không tìm thấy người dùng");
        //     return null;
        //   }
        //   
        //   // Nếu người dùng đăng nhập bằng Google trước đó, không có mật khẩu
        //   if (!user.password) {
        //     console.log("Người dùng không có mật khẩu (đăng nhập bằng Google)");
        //     throw new Error("Tài khoản này đã được đăng ký với Google. Vui lòng sử dụng tính năng đăng nhập bằng Google.");
        //   }
        //   
        //   const passwordValid = await compare(credentials.password, user.password);
        //   
        //   if (!passwordValid) {
        //     console.log("Mật khẩu không chính xác");
        //     return null;
        //   }
        //   
        //   console.log("Đăng nhập thành công:", user.email);
        //   return user;
        // } catch (error) {
        //   console.error("Lỗi trong quá trình xác thực:", error);
        //   return null;
        // }
      }
    })
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 ngày
  },
  
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("=== CALLBACK: SIGN IN ===");
      console.log("User:", JSON.stringify(user, null, 2));
      console.log("Account:", account ? `Provider: ${account.provider}` : "No account data");
      console.log("Profile:", profile ? `Email: ${(profile as any).email}` : "No profile data");
      
      // Luôn cho phép đăng nhập
      return true;
    },
    
    async redirect({ url, baseUrl }) {
      console.log("=== CALLBACK: REDIRECT ===");
      console.log("URL gốc:", url);
      console.log("Base URL:", baseUrl);
      
      // Xác định trang chuyển hướng đến sau đăng nhập
      if (url.startsWith(baseUrl)) {
        // Nếu URL thuộc cùng domain, chuyển hướng đến URL đó
        console.log("Chuyển hướng đến:", url);
        return url;
      } else {
        // Nếu không, chuyển hướng về trang chủ
        console.log("Chuyển hướng về trang chủ");
        return baseUrl;
      }
    },
    
    async jwt({ token, user, account }) {
      console.log("=== CALLBACK: JWT ===");
      console.log("Token user ID:", token.sub);
      
      // Thêm thông tin access token vào JWT token
      if (account && account.access_token) {
        console.log("Đã cập nhật access token trong JWT");
        token.accessToken = account.access_token;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      console.log("=== CALLBACK: SESSION ===");
      console.log("Session user:", session.user ? session.user.email : "No user");
      
      // Cập nhật session với thông tin từ token
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      
      // Đảm bảo user.id được lưu vào session
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      
      return session;
    },
  },
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 