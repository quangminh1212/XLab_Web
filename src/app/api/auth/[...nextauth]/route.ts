import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Debug logging
console.log("[NextAuth] Initializing with env variables:");
console.log(`GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? "Set (starts with " + process.env.GOOGLE_CLIENT_ID.substring(0, 5) + "...)" : "Not set"}`);
console.log(`GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not set"}`);
console.log(`NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || "Not set"}`);
console.log(`NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? "Set" : "Not set"}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

// Extend Session interface to include user details
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
      provider?: string;
    };
    token: JWT;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      // Chắc chắn callback URL đã được cấu hình đúng trong Google Cloud Console
      // Đảm bảo các URL này khớp với cấu hình trong Google Cloud Console:
      // - http://localhost:3000/api/auth/callback/google (cho môi trường phát triển)
      // - https://your-production-domain.com/api/auth/callback/google (cho production)
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Thêm logic xác thực thực tế ở đây
        // Đây chỉ là mẫu để demo
        if (credentials?.email === "admin@example.com" && credentials?.password === "password") {
          return {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
          };
        }
        return null;
      }
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      console.log("[NextAuth] session callback", { sessionUser: session.user, token });
      
      // Gán thông tin từ token vào session
      if (token) {
        session.user.id = token.sub;
        session.user.provider = token.provider as string;
        session.token = token;
      }
      
      return session;
    },
    async jwt({ token, user, account }) {
      console.log("[NextAuth] jwt callback", { token, user, account });
      
      // Lưu thông tin provider vào token khi đăng nhập
      if (account) {
        token.provider = account.provider;
      }
      
      // Gán thông tin user vào token khi đăng nhập
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      
      return token;
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log("[NextAuth] signIn callback", { 
        user, 
        accountProvider: account?.provider,
        profileEmail: profile?.email,
        credentials 
      });
      
      try {
        // Thêm logic kiểm tra tài khoản nếu cần
        if (account?.provider === "google" && profile?.email) {
          // Có thể thêm logic kiểm tra email đã tồn tại trong hệ thống hay chưa
          // Hoặc tạo tài khoản tự động trong cơ sở dữ liệu nếu chưa tồn tại
          return true;
        }
        
        // Xử lý credential provider riêng 
        if (account?.provider === "credentials") {
          return !!user;
        }
        
        return true;
      } catch (error) {
        console.error("[NextAuth] Error in signIn callback:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      console.log("[NextAuth] redirect callback", { url, baseUrl });
      
      // Đảm bảo xử lý chính xác các URL redirect
      if (url.startsWith("/")) {
        // URL tương đối - thêm baseUrl
        return `${baseUrl}${url}`;
      } else if (url.startsWith(baseUrl)) {
        // URL có base đúng
        return url;
      }
      
      // Mặc định trở về trang chủ
      return baseUrl;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 