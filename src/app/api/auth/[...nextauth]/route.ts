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
          access_type: "offline",
          response_type: "code"
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
      console.log("Session callback:", { session, token });
      return session;
    },
    async jwt({ token, user, account }: { token: any; user: any; account: any }) {
      // Initial sign in
      if (user && account) {
        token.id = user.id;
        token.provider = account.provider;
      }
      console.log("JWT callback:", { token, hasUser: !!user, hasAccount: !!account });
      return token;
    },
    async signIn({ account, profile }) {
      console.log("SignIn callback:", { accountProvider: account?.provider, hasProfile: !!profile, email: profile?.email });
      if (account?.provider === "google" && profile?.email) {
        // Có thể thêm logic kiểm tra người dùng ở đây nếu cần
        return true;
      }
      return false;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback:", { url, baseUrl });
      // Đảm bảo URL là tuyệt đối
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Cho phép callback đến các subdomains của host
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 