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
console.log("=== KIỂM TRA CẤU HÌNH NEXTAUTH ===");
console.log("GOOGLE_CLIENT_ID:", !!process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", !!process.env.GOOGLE_CLIENT_SECRET);
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);

// Cấu hình NextAuth đơn giản nhất
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Vui lòng nhập đầy đủ thông tin");
        }
        
        // Tài khoản test đơn giản
        if (credentials.email === "test@example.com" && credentials.password === "password") {
          return {
            id: "1",
            name: "Test User",
            email: credentials.email
          };
        }
        return null;
      }
    })
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 ngày
  },
  
  callbacks: {
    async signIn({ user }) {
      console.log("Đăng nhập thành công:", user.email);
      return true;
    },
    
    async redirect({ url, baseUrl }) {
      console.log("Chuyển hướng:", { url, baseUrl });
      return baseUrl;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  
  debug: true,
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 