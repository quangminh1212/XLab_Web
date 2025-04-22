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
      phone?: string | null;
      memberSince?: string | null;
      customName?: boolean;
    }
  }
}

// Sử dụng trực tiếp Google Client ID và Client Secret
const GOOGLE_CLIENT_ID = "909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || GOOGLE_CLIENT_SECRET,
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

        if (token.customName) session.user.customName = token.customName as boolean;
        if (token.phone) session.user.phone = token.phone as string;
        if (token.memberSince) session.user.memberSince = token.memberSince as string;

        if (token.customName && token.name) {
          session.user.name = token.name as string;
        }
      }
      return session;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user && account) {
        token.id = user.id;
        token.provider = account.provider;

        if (!token.memberSince) {
          const today = new Date();
          token.memberSince = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
        }
      }

      if (trigger === "update" && session) {
        if (session.name) {
          token.name = session.name;
          token.customName = true;
        }
        if (session.phone) token.phone = session.phone;
      }

      return token;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        return true;
      }
      return false;
    },
  },
  debug: false,
  secret: process.env.NEXTAUTH_SECRET || "your-random-secret-key-here-please-change-it",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});

export { handler as GET, handler as POST }; 