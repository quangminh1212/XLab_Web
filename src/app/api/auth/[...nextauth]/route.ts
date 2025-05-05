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
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
    signOut: "/",
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string;

        if (token.customName) session.user.customName = token.customName as boolean;
        if (token.phone) session.user.phone = token.phone as string;
        if (token.memberSince) session.user.memberSince = token.memberSince as string;
        if (token.isAdmin) session.user.isAdmin = Boolean(token.isAdmin);

        console.log('Session data after processing:', {
          id: session.user.id,
          email: session.user.email,
          isAdmin: session.user.isAdmin
        });

        if (token.customName && token.name) {
          session.user.name = token.name as string;
        }
      }
      return session;
    },
    async jwt({ token, user, account, trigger, session }: {
      token: JWT;
      user?: any;
      account?: any;
      trigger?: string;
      session?: any;
    }) {
      if (user && account) {
        token.id = user.id;
        token.provider = account.provider;

        if (user.email) {
          token.email = user.email;
        }

        if (token.email === 'xlab.rnd@gmail.com') {
          console.log('Setting admin rights for', token.email);
          token.isAdmin = true;
        } else {
          token.isAdmin = false;
        }

        if (!token.memberSince) {
          const today = new Date();
          token.memberSince = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
        }
      }

      // Đảm bảo email hiện tại trong token vẫn được kiểm tra admin
      // Trong trường hợp token.isAdmin chưa được thiết lập
      if (token.email === 'xlab.rnd@gmail.com' && token.isAdmin === undefined) {
        console.log('Re-setting admin rights for', token.email);
        token.isAdmin = true;
      }

      console.log('JWT token data:', {
        id: token.id,
        email: token.email,
        isAdmin: token.isAdmin
      });

      if (trigger === "update" && session) {
        if (session.name) {
          token.name = session.name;
          token.customName = true;
        }
        if (session.phone) token.phone = session.phone;
      }

      return token;
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log('Sign in callback executed', { provider: account?.provider });
      if (account?.provider === "google" && profile?.email) {
        return true;
      }
      return false;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback executed', { url, baseUrl });
      
      // Xử lý chuyển hướng sau khi đăng nhập
      if (url.startsWith(baseUrl)) {
        if (url.includes('/api/auth/signin') || url.includes('/api/auth/callback')) {
          return `${baseUrl}/`;
        }
        return url;
      } else if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      return baseUrl;
    },
  },
  events: {
    async signIn(message) {
      console.log('User signed in event', message);
    },
    async signOut(message) {
      console.log('User signed out event', message);
    },
    async session(message) {
      console.log('Session accessed event', message);
    },
  },
  debug: DEBUG_ENABLED,
  secret: process.env.NEXTAUTH_SECRET || "voZ7iiSzvDrGjrG0m0qkkw60XkANsAg9xf/rGiA4bfA=",
  session: {
    strategy: "jwt" as SessionStrategy,
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