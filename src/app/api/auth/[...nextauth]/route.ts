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

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "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",
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
      if (account?.provider === "google" && profile?.email) {
        console.log("Đăng nhập Google thành công:", profile.email);
        return true;
      }
      return false;
    },
    async redirect({ url, baseUrl }) {
      // Cho phép redirect về trang chủ hoặc các URL cùng origin
      if (url.startsWith(baseUrl) || url.startsWith("/")) {
        console.log("Chuyển hướng đến:", url);
        return url;
      }
      console.log("Chuyển hướng đến baseUrl:", baseUrl);
      return baseUrl;
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET || "121200",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  logger: {
    error(code, metadata) {
      console.error({ type: 'inside_nextauth', code, metadata });
    },
    warn(code) {
      console.warn({ type: 'inside_nextauth', code });
    },
    debug(code, metadata) {
      console.log({ type: 'inside_nextauth', code, metadata });
    },
  },
});

export { handler as GET, handler as POST }; 