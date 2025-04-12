import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// Lấy biến môi trường 
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "your-secret-key-xlab-web-app";

// Hiển thị thông tin debug khi khởi động
console.log("NextAuth đang khởi tạo...");
console.log("GOOGLE_CLIENT_ID:", GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET có giá trị:", !!GOOGLE_CLIENT_SECRET);
console.log("NEXTAUTH_URL:", NEXTAUTH_URL);

// Extend the Session interface
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string;
    }
  }
}

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error("THIẾU THÔNG TIN GOOGLE OAUTH! Vui lòng kiểm tra file .env");
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          // Trong thực tế, bạn sẽ kiểm tra thông tin đăng nhập với cơ sở dữ liệu
          if (credentials?.email && credentials?.password === "password") {
            const username = credentials.email.split('@')[0];
            return {
              id: "1",
              name: username.charAt(0).toUpperCase() + username.slice(1),
              email: credentials.email,
              image: "/images/avatar-placeholder.svg"
            }
          }
          return null;
        } catch (error) {
          console.error("Lỗi xác thực:", error);
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      try {
        if (token && session.user) {
          session.user.id = token.id as string;
          if (token.provider) {
            session.user.provider = token.provider as string;
          }
        }
        return session;
      } catch (error) {
        console.error("Lỗi session callback:", error);
        return session;
      }
    },
    async jwt({ token, user, account }) {
      try {
        // Initial sign in
        if (user && account) {
          token.id = user.id;
          token.provider = account.provider;
        }
        return token;
      } catch (error) {
        console.error("Lỗi jwt callback:", error);
        return token;
      }
    },
    async signIn({ account, profile, credentials, user }) {
      try {
        console.log("signIn callback được gọi:", { 
          provider: account?.provider,
          email: profile?.email || credentials?.email
        });
        
        // Cho phép đăng nhập bằng Google
        if (account?.provider === "google" && profile?.email) {
          return true;
        }
        
        // Cho phép đăng nhập bằng credentials
        if (account?.provider === "credentials" && credentials?.email) {
          return true;
        }
        
        console.log("Không tìm thấy phương thức đăng nhập hợp lệ");
        return false;
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      try {
        console.log("redirect callback:", { url, baseUrl });
        // Nếu URL là tương đối hoặc thuộc cùng origin, sử dụng nó
        if (url.startsWith(baseUrl) || url.startsWith('/')) {
          return url;
        }
        // Mặc định chuyển hướng về trang chủ
        return baseUrl;
      } catch (error) {
        console.error("Lỗi redirect callback:", error);
        return baseUrl;
      }
    }
  },
  debug: false, // Tắt debug để dễ theo dõi
  secret: NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false
      }
    }
  }
});

export { handler as GET, handler as POST };