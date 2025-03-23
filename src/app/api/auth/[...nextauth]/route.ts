import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

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

// Logger cho NextAuth
const nextAuthLogger = {
  error(code, metadata) {
    console.error(`[AuthAPI] [Error] ${code}:`, metadata);
  },
  warn(code) {
    console.warn(`[AuthAPI] [Warning] ${code}`);
  },
  debug(code, metadata) {
    console.log(`[AuthAPI] [Debug] ${code}:`, metadata);
  }
};

const handler = NextAuth({
  providers: [
    // Provider đơn giản nhất - Credentials
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      // Xác định các trường thông tin đăng nhập
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("[AuthAPI] Authorize called with credentials", 
          credentials ? { email: credentials.email } : "no credentials");

        // Xác thực đơn giản cho môi trường phát triển
        if (credentials?.email) {
          // Trả về user demo
          return {
            id: "1",
            name: "Test User",
            email: credentials.email,
            image: "https://i.pravatar.cc/150?img=1"
          };
        }
        return null;
      }
    }),
    // Google Provider (nếu có cấu hình)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
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
      console.log("[AuthAPI] Session callback:", { 
        hasUser: !!session?.user,
        hasToken: !!token
      });
      
      // Gán user ID từ token vào session
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      console.log("[AuthAPI] JWT callback:", { 
        tokenSub: token?.sub?.substring(0, 8),
        hasUser: !!user,
        provider: account?.provider
      });
      
      // Thêm thông tin vào token khi đăng nhập lần đầu
      if (user && account) {
        token.id = user.id;
        token.provider = account.provider;
      }
      return token;
    },
  },
  // Cấu hình logger
  logger: nextAuthLogger,
  // Bật debug mode trong môi trường phát triển
  debug: process.env.NODE_ENV === "development",
  // Secret key cần được cung cấp trong biến môi trường
  secret: process.env.NEXTAUTH_SECRET || "NEXTAUTH_SECRET_DEVELOPMENT_ONLY",
  // Cấu hình JWT
  jwt: {
    // Thời gian token hết hạn - 30 ngày
    maxAge: 30 * 24 * 60 * 60,
  },
  // Cấu hình session
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 ngày
  },
});

export { handler as GET, handler as POST }; 