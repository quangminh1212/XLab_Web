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

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
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
    async signIn({ account, profile }) {
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
      console.log("NextAuth redirect:", { url, baseUrl });
      
      // Nếu URL bắt đầu bằng /, nó là đường dẫn tương đối
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Nếu URL bắt đầu bằng http, kiểm tra nó có thuộc cùng domain không
      else if (url.startsWith('http')) {
        return url.startsWith(baseUrl) ? url : baseUrl;
      }
      
      // Mặc định về trang chủ
      return baseUrl;
    }
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});

export { handler as GET, handler as POST }; 