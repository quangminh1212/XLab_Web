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
      allowDangerousEmailAccountLinking: true,
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
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user && account) {
        token.id = user.id;
        token.provider = account.provider;
      }
      return token;
    },
    async signIn({ account, profile, credentials }) {
      try {
        console.log("signIn callback được gọi:", { 
          provider: account?.provider,
          email: profile?.email || credentials?.email 
        });
        
        if (account?.provider === "google" && profile?.email) {
          return true;
        }
        if (account?.provider === "credentials" && credentials?.email) {
          return true;
        }
        return false;
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        return false;
      }
    },
  },
  debug: true, // Luôn bật debug để dễ phát hiện lỗi
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
        secure: process.env.NODE_ENV === "production"
      }
    }
  }
});

export { handler as GET, handler as POST };