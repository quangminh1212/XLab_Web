import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

// Cấu hình NextAuth với một số tùy chọn bổ sung
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn callback được gọi:", { user, account });
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback được gọi:", { url, baseUrl });
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, account, user }) {
      console.log("JWT callback được gọi:", { token, account });
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback được gọi:", { session, token });
      if (token && session.user) {
        session.user = {
          ...session.user,
          id: token.id as string
        };
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 