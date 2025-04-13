import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// Log chi tiết để debug - ghi đầy đủ thông tin cấu hình
console.log('NextAuth: Khởi tạo module...');
console.log('Google Client ID đầy đủ:', process.env.GOOGLE_CLIENT_ID);
console.log('NEXTAUTH_URL đầy đủ:', process.env.NEXTAUTH_URL);
console.log('AUTH_REDIRECT_PROXY_URL:', process.env.AUTH_REDIRECT_PROXY_URL);
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
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
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
    async signIn({ account, profile, user, credentials }) {
      console.log('NextAuth callback: signIn attempt', {
        provider: account?.provider,
        hasProfile: !!profile,
        hasUser: !!user,
        hasCredentials: !!credentials
      });
      
      if (account?.provider === 'google') {
        console.log('Google Sign In Details:', {
          accountId: account.providerAccountId,
          profileEmail: profile?.email,
          profileName: profile?.name,
          profileImage: profile?.image,
          scopes: account.scope?.split(' '),
          tokenType: account.token_type,
          hasRefreshToken: !!account.refresh_token,
          hasIdToken: !!account.id_token,
        });
      }
      
      if (account?.provider === 'credentials') {
        console.log('Credentials Sign In Details:', {
          providedEmail: credentials?.email,
        });
      }
      
      // Luôn cho phép đăng nhập để debug
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Log đầy đủ để debug
      console.log('NextAuth callback: redirect với thông tin chi tiết:', { 
        url, 
        baseUrl,
        startsWith_slash: url.startsWith('/'),
        startsWith_baseUrl: url.startsWith(baseUrl),
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        FULL_URL: url
      });
      
      // Đảm bảo redirect về application
      if (url.startsWith('/')) {
        const result = `${baseUrl}${url}`;
        console.log('NextAuth redirect result:', result);
        return result;
      } else if (url.startsWith(baseUrl)) {
        console.log('NextAuth redirect result:', url);
        return url;
      }
      console.log('NextAuth redirect fallback:', baseUrl);
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