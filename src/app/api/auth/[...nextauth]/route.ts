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

console.log('NextAuth: Đang khởi tạo với Google Client ID:', process.env.GOOGLE_CLIENT_ID?.substring(0, 10) + '...');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);

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
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      console.log('NextAuth callback: session', { hasToken: !!token, hasUser: !!session.user });
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      console.log('NextAuth callback: jwt', { hasUser: !!user, hasAccount: !!account, provider: account?.provider });
      // Initial sign in
      if (user && account) {
        token.id = user.id;
        token.provider = account.provider;
      }
      return token;
    },
    async signIn({ account, profile }) {
      console.log('NextAuth callback: signIn', { provider: account?.provider, hasProfile: !!profile, email: profile?.email });
      if (account?.provider === "google" && profile?.email) {
        return true;
      }
      return false;
    },
  },
  debug: true, // Bật chế độ debug để xem các log
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});

export { handler as GET, handler as POST }; 