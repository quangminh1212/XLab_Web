import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

// Sử dụng định nghĩa từ src/types/next-auth.d.ts

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "select_account",
        }
      }
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
    newUser: "/register",
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user, account }: { token: any; user: any; account: any }) {
      // Initial sign in
      if (user && account) {
        token.id = user.id;
        token.provider = account.provider;
      }
      return token;
    },
    async signIn({ account, profile }) {
      console.log('SignIn callback called with account provider:', account?.provider);
      if (account?.provider === "google" && profile?.email) {
        return true;
      }
      return false;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback called with:', { url, baseUrl });
      
      // Nếu URL liên quan đến auth API, chuyển hướng đến callback được cấu hình trong Google Console
      if (url.includes('/api/auth') && url.includes('/callback')) {
        return 'http://localhost:3000/auth';
      }
      
      // Trả về URL chỉ định hoặc URL gốc nếu không có
      return url || baseUrl;
    },
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 