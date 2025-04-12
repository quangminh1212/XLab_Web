import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";

console.log("NextAuth Config:", {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID?.substring(0, 10) + "..." || "MISSING",
  GOOGLE_CLIENT_SECRET_EXISTS: !!process.env.GOOGLE_CLIENT_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "MISSING",
});

// Cập nhật interface Session
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

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Mô phỏng kiểm tra đăng nhập
        if (credentials?.email && credentials.password === "password") {
          const username = credentials.email.split('@')[0];
          return {
            id: "1",
            name: username.charAt(0).toUpperCase() + username.slice(1),
            email: credentials.email,
            image: "/images/avatar-placeholder.svg"
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ account, profile }) {
      // Log thông tin đăng nhập
      console.log("SignIn Callback:", { 
        provider: account?.provider,
        email: profile?.email 
      });
      
      return true;
    },
    async jwt({ token, user, account }) {
      // Cập nhật token khi đăng nhập lần đầu
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      // Truyền thông tin từ token vào session
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  debug: false,
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };