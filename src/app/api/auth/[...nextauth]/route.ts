import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Mở rộng type Session để thêm accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

// Log thông số cấu hình để debug
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
        account
      });
      
      if (!user) {
        console.error("[auth] SignIn callback: User is null or undefined");
        return false;
      }
      
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("REDIRECT CALLBACK:", { url, baseUrl });
      
      // Kiểm tra xem URL có phải là đường dẫn nội bộ hay URL đầy đủ
      if (url.startsWith('/')) {
        // Trả về URL đầy đủ cho đường dẫn nội bộ
        return `${baseUrl}${url}`;
      } else if (url.startsWith(baseUrl)) {
        // Trả về URL nếu đã là URL đầy đủ với baseUrl
        return url;
      }
      
      // Mặc định trả về baseUrl
      return baseUrl;
    },
    async jwt({ token, account }) {
      console.log("JWT CALLBACK:", { token, account });
      
      // Khi đăng nhập thành công, lưu access token vào token
      if (account) {
        token.accessToken = account.access_token as string;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("SESSION CALLBACK:", { session, token });
      
      // Thêm access token vào session
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