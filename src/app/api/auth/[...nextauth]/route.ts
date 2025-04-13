import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

// Extend the Session interface
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

// Thông tin OAuth từ Google Console
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

// Kiểm tra nếu Google Client ID và Secret chưa được cấu hình
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn("Cảnh báo: Google Client ID hoặc Client Secret chưa được cấu hình!");
}

console.log("NextAuth setup - Client ID có được cấu hình:", !!GOOGLE_CLIENT_ID);
console.log("NextAuth setup - Client Secret có được cấu hình:", !!GOOGLE_CLIENT_SECRET);

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
          scope: "openid email profile"
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
      console.log("NextAuth session callback:", { sessionUser: session.user, token });
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      console.log("NextAuth JWT callback:", { token, userId: user?.id, accountProvider: account?.provider });
      // Initial sign in
      if (user && account) {
        token.id = user.id;
        token.provider = account.provider;
      }
      return token;
    },
    async signIn({ account, profile, user }) {
      console.log("NextAuth signIn callback:", { 
        provider: account?.provider,
        profileEmail: profile?.email,
        userId: user?.id
      });
      
      try {
        if (account?.provider === "google" && profile?.email) {
          console.log("Google đăng nhập thành công:", profile.email);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Lỗi trong quá trình đăng nhập:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Log thông tin debug
      console.log("NextAuth redirect callback:", { url, baseUrl });
      
      // Nếu URL bắt đầu bằng /, nó là đường dẫn tương đối
      if (url.startsWith('/')) {
        const fullUrl = `${baseUrl}${url}`;
        console.log("Chuyển hướng đến URL tương đối:", fullUrl);
        return fullUrl;
      }
      // Nếu URL bắt đầu bằng http, kiểm tra nó có thuộc cùng domain không
      else if (url.startsWith('http')) {
        const isSameDomain = url.startsWith(baseUrl);
        console.log("Chuyển hướng đến URL tuyệt đối:", url, "Cùng domain:", isSameDomain);
        return isSameDomain ? url : baseUrl;
      }
      
      // Mặc định về trang chủ
      console.log("Mặc định chuyển hướng về trang chủ:", baseUrl);
      return baseUrl;
    }
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  logger: {
    error(code, metadata) {
      console.error("NextAuth error:", { code, metadata });
    },
    warn(code) {
      console.warn("NextAuth warning:", { code });
    },
    debug(code, metadata) {
      console.log("NextAuth debug:", { code, metadata });
    }
  }
});

export { handler as GET, handler as POST }; 