import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Kiểm tra xem các environment variable có tồn tại không
const hasCredentials = 
  process.env.GOOGLE_CLIENT_ID && 
  process.env.GOOGLE_CLIENT_SECRET;

export const authOptions: NextAuthOptions = {
    providers: [
        ...(hasCredentials 
          ? [GoogleProvider({
              clientId: process.env.GOOGLE_CLIENT_ID || "",
              clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            })]
          : []),
    ],
    pages: {
        signIn: "/login",
        error: "/auth/error",
    },
    callbacks: {
        async session({ session, token, user }) {
            return session;
        },
        async jwt({ token, user, account }) {
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    userId: user.id,
                };
            }
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "default_secret_replace_this_in_production",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 