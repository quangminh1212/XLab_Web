import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

// Log chi tiết để debug
console.log('NextAuth: Khởi tạo module...');
console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID?.substring(0, 10) + '...');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('DEBUG Mode:', process.env.NEXTAUTH_DEBUG === 'true' ? 'Enabled' : 'Disabled');

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
      console.log('NextAuth callback: session', {
        hasToken: !!token,
        hasUser: !!session?.user,
        user: session?.user?.email
      });
      
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      console.log('NextAuth callback: jwt', {
        hasToken: !!token,
        hasUser: !!user,
        hasAccount: !!account,
        provider: account?.provider,
        userId: user?.id,
        accountType: account?.type
      });
      
      // Initial sign in
      if (user && account) {
        token.id = user.id;
        token.provider = account.provider;
      }
      return token;
    },
    async signIn({ account, profile, user }) {
      console.log('NextAuth callback: signIn', {
        provider: account?.provider,
        profileEmail: profile?.email,
        userId: user?.id,
        userName: user?.name
      });
      
      if (account?.provider === "google" && profile?.email) {
        return true;
      }
      return false;
    },
    async redirect({ url, baseUrl }) {
      console.log('NextAuth callback: redirect', { url, baseUrl });
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  },
  debug: true,
  logger: {
    error(code, metadata) {
      console.error('NextAuth ERROR:', { code, metadata });
    },
    warn(code) {
      console.warn('NextAuth WARNING:', code);
    },
    debug(code, metadata) {
      console.log('NextAuth DEBUG:', { code, metadata });
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});

export { handler as GET, handler as POST }; 