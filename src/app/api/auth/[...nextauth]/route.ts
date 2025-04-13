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

// Kiểm tra và hiển thị thông tin debug
const isDebugEnabled = process.env.AUTH_DEBUG === 'true';
const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
const nextAuthUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
const authRedirectProxyUrl = process.env.AUTH_REDIRECT_PROXY_URL || nextAuthUrl;

// Log thông tin debug nếu được bật
if (isDebugEnabled) {
  console.log("NextAuth: Khởi tạo module...");
  console.log("Google Client ID đầy đủ:", googleClientId);
  console.log("NEXTAUTH_URL đầy đủ:", nextAuthUrl);
  console.log("AUTH_REDIRECT_PROXY_URL:", authRedirectProxyUrl);
  console.log("NEXT_PUBLIC_NEXTAUTH_URL:", process.env.NEXT_PUBLIC_NEXTAUTH_URL);
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("DEBUG Mode:", isDebugEnabled ? "Enabled" : "Disabled");
  
  if (!googleClientId || googleClientId.trim() === "") {
    console.error("CẢNH BÁO: GOOGLE_CLIENT_ID chưa được cấu hình!");
  }
  
  if (!googleClientSecret || googleClientSecret.trim() === "") {
    console.error("CẢNH BÁO: GOOGLE_CLIENT_SECRET chưa được cấu hình!");
  }
}

// Khắc phục và log lỗi cho đường dẫn callback
// Kiểm tra xem có lỗi nào xảy ra khi nhận callback từ Google không
const logCallbackErrorDetails = (error: any) => {
  if (isDebugEnabled) {
    console.error("Lỗi trong xử lý callback", error);
    
    // Chi tiết về lỗi
    if (error.response) {
      console.error("Chi tiết response:", {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data,
      });
    }
    
    // Thông tin lỗi
    console.error("Chi tiết lỗi:", {
      message: error.message,
      stack: error.stack,
    });
  }
};

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      },
      // Chỉ định tùy chỉnh callbackUrl để khớp với cấu hình Google Cloud Console
      httpOptions: {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
    // Đặt callback tùy chỉnh để phù hợp với cấu hình trong Google Cloud Console
    // Đường dẫn này cần match với Authorized Redirect URI trong console Google
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
        if (isDebugEnabled) {
          console.log("NextAuth: signIn callback được gọi với:", { 
            provider: account?.provider, 
            email: profile?.email 
          });
        }
        
        if (account?.provider === "google" && profile?.email) {
          if (isDebugEnabled) {
            console.log("NextAuth: Đăng nhập Google thành công với email:", profile.email);
          }
          return true;
        }
        
        if (isDebugEnabled) {
          console.log("NextAuth: Đăng nhập thất bại:", { 
            provider: account?.provider, 
            hasProfile: !!profile,
            hasEmail: !!profile?.email 
          });
        }
        return false;
      } catch (error) {
        console.error("NextAuth: Lỗi trong signIn callback:", error);
        // Ghi log chi tiết
        logCallbackErrorDetails(error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Log thông tin debug về redirect
      if (isDebugEnabled) {
        console.log("NextAuth callback: redirect với thông tin chi tiết:", {
          url,
          baseUrl,
          startsWith_slash: url.startsWith('/'),
          startsWith_baseUrl: url.startsWith(baseUrl),
          NEXTAUTH_URL: process.env.NEXTAUTH_URL,
          FULL_URL: url
        });
      }
      
      // Đơn giản hóa logic redirect để luôn chuyển về trang chủ sau khi đăng nhập
      return baseUrl;
    }
  },
  // Cấu hình URL cho NextAuth
  // Cần đảm bảo các đường dẫn đúng với cấu hình Authorized redirect URIs
  // trong Google Cloud Console
  useSecureCookies: false, // Tắt đi khi chạy trên localhost HTTP
  debug: isDebugEnabled,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  logger: {
    error(code, metadata) {
      console.error(`NextAuth ERROR [${code}]:`, metadata);
      
      // Log thêm thông tin để debug
      if (code === "CALLBACK_OAUTH_ERROR") {
        console.error("Chi tiết lỗi OAuth:", {
          ...metadata,
          googleClientId: googleClientId?.substring(0, 10) + "..." || "không có",
          authUrl: nextAuthUrl,
        });
      }
    },
    warn(code) {
      console.warn(`NextAuth WARNING [${code}]`);
    },
    debug(code, metadata) {
      if (isDebugEnabled) {
        console.log(`NextAuth DEBUG [${code}]:`, metadata);
      }
    },
  },
});

export { handler as GET, handler as POST }; 