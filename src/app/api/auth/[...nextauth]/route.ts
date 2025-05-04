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

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: "909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com",
      clientSecret: "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",
      authorization: {
        params: {
          prompt: "select_account"
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
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      console.log('Session callback:', { session, token });
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      console.log('JWT callback:', { token, user, account });
      // Initial sign in
      if (user && account) {
        token.id = user.id;
        token.provider = account.provider;
      }
      return token;
    },
    async signIn({ account, profile }) {
      console.log('SignIn callback:', { account, profile });
      if (account?.provider === "google" && profile?.email) {
        return true;
      }
      if (account?.provider === "credentials") {
        return true;
      }
      return false;
    },
  },
  debug: true,
  secret: "your_random_string_here",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});

console.log('NextAuth configuration loaded.');

export { handler as GET, handler as POST }; 