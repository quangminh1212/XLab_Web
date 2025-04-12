import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

// Hiển thị log đầy đủ để debug
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID || "909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com");
console.log("Khởi tạo NextAuth...");

// Cấu hình NextAuth với OAuth chính xác
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: "909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com",
      clientSecret: "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",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "121200",
  debug: true,
  logger: {
    error(code, metadata) {
      console.error("[auth] Error:", { code, metadata });
    },
    warn(code) {
      console.warn("[auth] Warning:", { code });
    },
    debug(code, metadata) {
      console.log("[auth] Debug:", { code, metadata });
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("[auth] SignIn callback:", { 
        hasUser: !!user, 
        hasAccount: !!account, 
        hasProfile: !!profile,
        user,
        account,
        profile
      });
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("[auth] Redirect callback:", { url, baseUrl });
      // Xử lý redirect đúng cách, đảm bảo trở về trang chủ sau khi đăng nhập thành công
      if (url.startsWith("/api/auth") || url === "/api/auth/signin/google") {
        return baseUrl;
      }
      if (url.startsWith(baseUrl) || url.startsWith("/")) {
        return url;
      }
      return baseUrl;
    }
  }
};

console.log("NextAuth config loaded");
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 