import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

console.log('Loading NextAuth configuration...');

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

// Ensure we're using environment variables everywhere
const googleClientId = process.env.GOOGLE_CLIENT_ID || "909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "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";
const nextAuthSecret = process.env.NEXTAUTH_SECRET || "K2P5fgz9WJdLsY7mXn4A6BcRtVxZqH8DbE3NpQuT";
const nextAuthUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

if (!googleClientId || !googleClientSecret) {
  console.warn('Missing Google OAuth credentials in environment variables!');
}

console.log('NextAuth configuration loaded.');

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
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
        // Thực hiện xác thực người dùng ở đây
        // Đây chỉ là mẫu, bạn cần thay thế bằng logic xác thực thực tế
        if (credentials?.email && credentials?.password) {
          return {
            id: "1",
            name: "Test User",
            email: credentials.email,
          };
        }
        return null;
      }
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
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
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        return true;
      }
      if (account?.provider === "credentials") {
        return true;
      }
      return false;
    },
    async redirect({ url, baseUrl }) {
      // Đảm bảo URL chuyển hướng hợp lệ
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      } else if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    }
  },
  debug: true,
  secret: nextAuthSecret,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});

export { handler as GET, handler as POST }; 