import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { SessionStrategy } from "next-auth/core/types";

// Extend the Session interface
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phone?: string | null;
      memberSince?: string | null;
      customName?: boolean;
      isAdmin?: boolean;
    }
  }
}

// Đảm bảo NEXTAUTH_URL được đặt
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
// Không bật debug trong môi trường production
const DEBUG_ENABLED = process.env.NODE_ENV === 'development';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "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",
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
    signOut: "/",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub;
        if (token.email === 'xlab.rnd@gmail.com') {
          session.user.isAdmin = true;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "voZ7iiSzvDrGjrG0m0qkkw60XkANsAg9xf/rGiA4bfA=",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Sửa cấu hình cookie để đảm bảo hoạt động đúng với Google
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 // 30 days
      }
    },
    callbackUrl: {
      name: process.env.NODE_ENV === "production" ? `__Secure-next-auth.callback-url` : `next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      }
    },
    csrfToken: {
      name: process.env.NODE_ENV === "production" ? `__Host-next-auth.csrf-token` : `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      }
    }
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 