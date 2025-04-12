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

// Kiểm tra biến môi trường
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// In ra đầy đủ thông tin môi trường để debug
console.log("=== DEBUG: FULL NEXTAUTH ENVIRONMENT INFO ===");
console.log("NEXTAUTH_URL:", NEXTAUTH_URL);
console.log("GOOGLE_CLIENT_ID:", GOOGLE_CLIENT_ID ? GOOGLE_CLIENT_ID.substring(0, 8) + "..." : "Missing");
console.log("GOOGLE_CLIENT_SECRET:", GOOGLE_CLIENT_SECRET ? "Configured" : "Missing");
console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "Configured" : "Missing");
console.log("VERCEL_URL:", process.env.VERCEL_URL || "Not available");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("====================================");

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error("GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing!");
}

// Cấu hình NextAuth đơn giản nhất
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID || '',
      clientSecret: GOOGLE_CLIENT_SECRET || '',
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
      console.log("Account provider:", account?.provider);
      console.log("Profile email:", profile?.email);
      
      // Luôn cho phép đăng nhập
      return true;
    },
    
    async redirect({ url, baseUrl }) {
      console.log("=== DEBUG: REDIRECT CALLBACK ===");
      console.log("URL:", url);
      console.log("BaseURL:", baseUrl);
      
      // Luôn chuyển hướng về trang chủ sau khi đăng nhập thành công
      return '/';
    },
    
    async jwt({ token, user, account }) {
      console.log("=== DEBUG: JWT CALLBACK ===");
      console.log("TokenSub:", token.sub);
      
      // Nếu đây là lần đầu đăng nhập, thêm thông tin account vào token
      if (account) {
        console.log("Adding account info to token, provider:", account.provider);
        token.accessToken = account.access_token;
        token.providerId = account.providerAccountId;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      console.log("=== DEBUG: SESSION CALLBACK ===");
      console.log("Session user email:", session.user?.email);
      
      // Thêm accessToken và ID vào session
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      
      if (session.user) {
        session.user.id = token.sub;
      }
      
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