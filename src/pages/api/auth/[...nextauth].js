import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
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
    // Thêm CredentialsProvider cho môi trường phát triển
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Tạo user giả cho môi trường phát triển
        if (credentials?.email && credentials?.password) {
          return {
            id: "1",
            name: "Test User",
            email: credentials.email,
            image: "https://i.pravatar.cc/150?img=1"
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
      if (token && session.user) {
        session.user.id = token.id;
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
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET || "YOUR_SECRET_HERE",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
}); 