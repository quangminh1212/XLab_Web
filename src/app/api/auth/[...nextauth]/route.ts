import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { SessionStrategy } from "next-auth/core/types";

// Extend the Session interface
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phone?: string | null;
      memberSince?: string | null;
      customName?: boolean;
      isAdmin?: boolean;
    }
  }
}

// Danh sách các email có quyền admin
const ADMIN_EMAILS = ['xlab.rnd@gmail.com'];

// Đảm bảo NEXTAUTH_URL được đặt đúng - luôn sử dụng URL tuyệt đối
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
// Không bật debug trong môi trường production
// const DEBUG_ENABLED = process.env.NODE_ENV === 'development';

// Secret key cho NextAuth - yêu cầu phải có trong .env.local
const AUTH_SECRET = process.env.NEXTAUTH_SECRET;
if (!AUTH_SECRET && process.env.NODE_ENV !== 'development') {
  console.warn('NEXTAUTH_SECRET is not set. Using fallback for development only.');
}

// Google OAuth credentials - yêu cầu phải có trong .env.local
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
if ((!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) && process.env.NODE_ENV !== 'development') {
  console.warn('Google OAuth credentials are not set. Using fallback for development only.');
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID || "fallback-client-id",
      clientSecret: GOOGLE_CLIENT_SECRET || "fallback-client-secret",
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
    signOut: "/",
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.sub;
        // Đảm bảo lưu giữ thông tin hình ảnh từ Google
        if (token.picture) {
          session.user.image = token.picture as string;
        }
        // Remove sensitive logging in production
        if (process.env.NODE_ENV === 'development') {
          console.log("AUTH SESSION IMAGE:", session.user.image);
          console.log("AUTH TOKEN PICTURE:", token.picture);
        }
        // Kiểm tra email có trong danh sách admin không
        if (token.email && ADMIN_EMAILS.includes(token.email as string)) {
          session.user.isAdmin = true;
        } else {
          session.user.isAdmin = false;
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      // Lưu thông tin avatar từ Google vào token (token.picture đã được tự động thêm bởi NextAuth)
      if (process.env.NODE_ENV === 'development') {
        console.log("AUTH JWT TOKEN:", token);
        if (account && account.provider === 'google' && account.id_token) {
          console.log("AUTH GOOGLE ACCOUNT:", account);
        }
      }
      return token;
    },
  },
  secret: AUTH_SECRET || "fallback-secret-for-build",
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: false, // Force debug always off to prevent warnings
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 // 30 days
      }
    },
    callbackUrl: {
      name: process.env.NODE_ENV === "production" ? `__Secure-next-auth.callback-url` : `next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      }
    },
    csrfToken: {
      name: process.env.NODE_ENV === "production" ? `__Host-next-auth.csrf-token` : `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      }
    }
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };