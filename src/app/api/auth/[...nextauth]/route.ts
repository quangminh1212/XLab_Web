import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

// Cấu hình NextAuth với một số tùy chọn bổ sung
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: "909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com",
      clientSecret: "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",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: true,
  secret: "121200",
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    // Thêm để log các quá trình và debug
    async signIn({ user, account, profile }) {
      if (user && account) {
        console.log("SignIn callback - User:", user.email);
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback", { url, baseUrl });
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async session({ session }) {
      console.log("Session callback - có session:", !!session);
      return session;
    },
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 