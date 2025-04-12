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

// In ra đầy đủ thông tin môi trường để debug
console.log("=== DEBUG: FULL NEXTAUTH ENVIRONMENT INFO ===");
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "Đã cấu hình" : "Chưa cấu hình");
console.log("VERCEL_URL:", process.env.VERCEL_URL || "Not available");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PUBLIC_URL:", process.env.PUBLIC_URL || "Not available");

// Cấu hình NextAuth đơn giản nhất
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        }
      }
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
    async signIn({ user, account, profile }) {
      console.log("=== DEBUG: SIGN IN CALLBACK ===");
      console.log("User:", JSON.stringify(user, null, 2));
      console.log("Account:", JSON.stringify(account, null, 2));
      console.log("Profile:", profile ? "Profile exists" : "No profile");
      
      // Luôn cho phép đăng nhập
      return true;
    },
    
    async redirect({ url, baseUrl }) {
      console.log("=== DEBUG: REDIRECT CALLBACK ===");
      console.log("URL:", url);
      console.log("BaseURL:", baseUrl);
      
      // Logic đơn giản: nếu URL bắt đầu với baseUrl, sử dụng URL đó
      // Nếu không, sử dụng baseUrl
      if (url.startsWith(baseUrl)) {
        console.log("Chuyển hướng đến trang trong app:", url);
        return url;
      }
      
      console.log("Chuyển hướng về trang chủ:", baseUrl);
      return baseUrl;
    },
    
    async jwt({ token, user, account }) {
      console.log("=== DEBUG: JWT CALLBACK ===");
      console.log("Token:", JSON.stringify(token, null, 2));
      
      // Nếu đây là lần đầu đăng nhập, thêm thông tin account vào token
      if (account) {
        console.log("Adding account info to token");
        token.accessToken = account.access_token;
        token.providerId = account.providerAccountId;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      console.log("=== DEBUG: SESSION CALLBACK ===");
      console.log("Session before:", JSON.stringify(session, null, 2));
      
      // Thêm accessToken và ID vào session
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      
      if (session.user) {
        session.user.id = token.sub;
      }
      
      console.log("Session after:", JSON.stringify(session, null, 2));
      return session;
    },
  },
  
  debug: true,
  
  logger: {
    error(code, metadata) {
      console.error(`[AUTH ERROR] ${code}:`, metadata);
    },
    warn(code) {
      console.warn(`[AUTH WARNING] ${code}`);
    },
    debug(code, metadata) {
      console.log(`[AUTH DEBUG] ${code}:`, metadata);
    },
  },
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 