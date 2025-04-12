import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

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

// Cấu hình GoogleProvider
const googleClientId = "909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com";
const googleClientSecret = "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"; 

console.log("[Route] Khởi tạo NextAuth với Google OAuth");
console.log("[Route] Client ID:", googleClientId.substring(0, 15) + "...");
console.log("[Route] Client Secret có giá trị:", !!googleClientSecret);

// Khai báo cấu hình NextAuth
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.password === "password") {
          return {
            id: "1",
            name: credentials.email.split('@')[0],
            email: credentials.email,
            image: "/images/avatar-placeholder.svg"
          }
        }
        return null;
      }
    }),
  ],
  callbacks: {
    async signIn({ account, profile, credentials }) {
      console.log("[NextAuth] SignIn callback:", { 
        provider: account?.provider,
        email: profile?.email || credentials?.email
      });
      return true;
    },
    async jwt({ token, user, account }) {
      if (user && account) {
        token.id = user.id as string;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        if (token.provider) {
          session.user.provider = token.provider as string;
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("[NextAuth] Redirect callback:", { url, baseUrl });
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  },
  debug: true,
  secret: "121200",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
};

// Tạo handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };