import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// Extend the Session interface
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string;
    }
  }
}

const handler = NextAuth({
  providers: [
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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          // Trong thực tế, bạn sẽ kiểm tra thông tin đăng nhập với cơ sở dữ liệu
          if (credentials?.email && credentials?.password === "password") {
            const username = credentials.email.split('@')[0];
            return {
              id: "1",
              name: username.charAt(0).toUpperCase() + username.slice(1),
              email: credentials.email,
              image: "/images/avatar-placeholder.svg"
            }
          }
          return null;
        } catch (error) {
          console.error("Lỗi xác thực:", error);
          return null;
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
        session.user.provider = token.provider as string;
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
    async signIn({ account, profile, credentials }) {
      try {
        if (account?.provider === "google" && profile?.email) {
          return true;
        }
        if (account?.provider === "credentials" && credentials?.email) {
          return true;
        }
        return false;
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        return false;
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-xlab-web-app",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});

export { handler as GET, handler as POST };