import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// Log chi tiết để debug
console.log('NextAuth: Khởi tạo module...');
console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID?.substring(0, 10) + '...');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('NEXT_PUBLIC_NEXTAUTH_URL:', process.env.NEXT_PUBLIC_NEXTAUTH_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
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
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        // This is a placeholder for your actual authentication logic
        // In a real app, you would validate credentials against your database
        // For now, just accepting any login to test NextAuth flow
        const user = {
          id: "1",
          name: "Test User",
          email: credentials.email,
        };
        
        return user;
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
        hasUser: !!session?.user
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
        provider: account?.provider
      });
      
      // Initial sign in
      if (user && account) {
        token.id = user.id;
        token.provider = account.provider;
      }
      return token;
    },
    async signIn({ account, profile, user }) {
      console.log('NextAuth callback: signIn attempt', {
        provider: account?.provider,
        hasProfile: !!profile,
        hasUser: !!user
      });
      
      // Luôn cho phép đăng nhập để debug
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log('NextAuth callback: redirect', { url, baseUrl });
      // Đảm bảo redirect về application
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      } else if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    }
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});

export { handler as GET, handler as POST }; 