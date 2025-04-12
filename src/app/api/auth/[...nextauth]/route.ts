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

// Địa chỉ redirect chuẩn cho môi trường production
const REDIRECT_URI = "https://xlab-web.vercel.app/api/auth/callback/google";

// Log thông số cấu hình để debug
console.log("=====================================");
console.log("Khởi tạo NextAuth với Google OAuth");
console.log("ClientID:", GOOGLE_CLIENT_ID);
console.log("Sử dụng redirect URI:", REDIRECT_URI);
console.log("=====================================");

// Cấu hình NextAuth với OAuth chính xác
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          redirect_uri: REDIRECT_URI,
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "email profile openid"
        }
      }
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "121200",
  debug: true, // Bật debug để xem các lỗi chi tiết
  logger: {
    error(code, metadata) {
      console.error("🔴 [ERROR]:", { code, metadata });
    },
    warn(code) {
      console.warn("🟠 [WARNING]:", { code });
    },
    debug(code, metadata) {
      console.log("🔵 [DEBUG]:", { code, metadata });
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("=== SIGN IN CALLBACK ===");
      console.log("User info:", JSON.stringify(user, null, 2));
      console.log("Account info:", account);
      
      // Luôn đăng nhập nếu có thông tin người dùng
      return !!user;
    },
    async redirect({ url, baseUrl }) {
      console.log("=== REDIRECT CALLBACK ===");
      console.log("URL:", url);
      console.log("Base URL:", baseUrl);
      
      // Kiểm tra nếu URL bắt đầu với baseUrl hoặc là URL tương đối
      if (url.startsWith(baseUrl) || url.startsWith('/')) {
        console.log("Chuyển hướng đến:", url);
        return url;
      }
      
      // Trường hợp mặc định, quay về trang chủ
      console.log("Chuyển hướng về trang chủ");
      return baseUrl;
    },
    async jwt({ token, account }) {
      console.log("=== JWT CALLBACK ===");
      console.log("Token:", token);
      
      // Thêm accessToken vào JWT token
      if (account) {
        token.accessToken = account.access_token as string;
        console.log("Access token added to JWT");
      }
      
      return token;
    },
    async session({ session, token }) {
      console.log("=== SESSION CALLBACK ===");
      console.log("Session:", session);
      
      // Thêm accessToken vào session để client có thể sử dụng
      if (token) {
        session.accessToken = token.accessToken as string;
        console.log("Access token added to session");
      }
      
      return session;
    },
  }
};

console.log("NextAuth config loaded and ready");
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 