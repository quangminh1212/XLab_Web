import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

// Cấu hình NextAuth với chi tiết đầy đủ
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
  secret: "121200",
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
  callbacks: {
    async signIn({ user, account, profile, email }) {
      console.log("[auth] SignIn callback:", { 
        user: user?.email, 
        hasAccount: !!account, 
        hasProfile: !!profile 
      });
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("[auth] Redirect callback:", { url, baseUrl });
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 