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

// Kiểm tra và ghi log client ID để debug
console.log("GOOGLE_CLIENT_ID có tồn tại:", !!GOOGLE_CLIENT_ID);
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error("GOOGLE_CLIENT_ID hoặc GOOGLE_CLIENT_SECRET không được cấu hình");
}

console.log("Initializing NextAuth...");

export const authOptions: NextAuthOptions = {
  debug: true,
  
  // Tạm thời comment PrismaAdapter nếu chưa cài đặt
  // adapter: PrismaAdapter(prisma),
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
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
        // Trong thực tế, nên sử dụng xác thực database
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("signIn callback called", { user, account, profile, email, credentials });
      return true;
    },
    
    async redirect({ url, baseUrl }) {
      console.log("redirect callback called", { url, baseUrl });
      
      // Xác định baseUrl dựa trên môi trường
      const productionUrl = "https://xlab-web.vercel.app";
      const effectiveBaseUrl = process.env.NODE_ENV === "production" ? productionUrl : baseUrl;
      
      console.log("Environment:", process.env.NODE_ENV);
      console.log("Effective baseUrl:", effectiveBaseUrl);
      
      // Ensure we redirect back to the home page after login
      if (url.startsWith("/api/auth") || url.startsWith(baseUrl) || url.startsWith(productionUrl)) {
        let targetUrl = "/";
        try {
          // Attempt to extract callbackUrl from the URL
          const urlObj = new URL(url);
          targetUrl = urlObj.searchParams.get("callbackUrl") || "/";
        } catch (error) {
          console.error("Error parsing URL:", error);
        }
        
        console.log("Redirecting to:", targetUrl);
        return targetUrl;
      }
      
      return effectiveBaseUrl;
    },
    
    async jwt({ token, user, account, profile }) {
      console.log("jwt callback called", { token, user, account, profile });
      if (account) {
        token.accessToken = account.access_token;
        token.id = user?.id;
      }
      return token;
    },
    
    async session({ session, token, user }) {
      console.log("session callback called", { session, token, user });
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