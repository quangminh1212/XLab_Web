import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Mở rộng type Session để thêm accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

// Định nghĩa các client ID và callback URL
const GOOGLE_CLIENT_ID = "909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

// Log thông số cấu hình để debug
console.log("Khởi tạo NextAuth với Google OAuth...");
console.log("ClientID:", GOOGLE_CLIENT_ID);
console.log("Đảm bảo đã cấu hình đúng Authorized redirect URIs trong Google Cloud Console");

// Cấu hình NextAuth với OAuth chính xác
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent", // Luôn hiển thị màn hình đồng ý của Google
          access_type: "offline", // Để nhận refresh token
          response_type: "code",
          scope: "email profile openid"
        }
      }
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "121200",
  debug: true, // Bật debug để xem các lỗi chi tiết
  logger: {
    error(code, metadata) {
      console.error("🔴 NextAuth Error:", { code, metadata });
    },
    warn(code) {
      console.warn("🟠 NextAuth Warning:", { code });
    },
    debug(code, metadata) {
      console.log("🔵 NextAuth Debug:", { code, metadata });
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("🟢 Đăng nhập thành công:", { 
        email: user?.email,
        provider: account?.provider
      });
      
      // Luôn đăng nhập nếu có thông tin người dùng
      return !!user;
    },
    async redirect({ url, baseUrl }) {
      console.log("🔄 Redirect callback:", { url, baseUrl });
      
      // Fix lỗi chuyển hướng
      if (url.startsWith('/')) {
        // URL nội bộ
        return `${baseUrl}${url}`;
      } else if (url.startsWith(baseUrl)) {
        // URL đầy đủ trong cùng domain
        return url;
      }
      
      // Mặc định về trang chủ
      return baseUrl;
    },
    async jwt({ token, account }) {
      console.log("🔑 JWT callback");
      
      // Thêm accessToken vào JWT token
      if (account) {
        token.accessToken = account.access_token as string;
      }
      
      return token;
    },
    async session({ session, token }) {
      console.log("📝 Session callback");
      
      // Thêm accessToken vào session để client có thể sử dụng
      if (token) {
        session.accessToken = token.accessToken as string;
      }
      
      return session;
    },
  }
};

console.log("NextAuth config loaded");
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 