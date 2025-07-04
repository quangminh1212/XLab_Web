// Export authOptions from the NextAuth configuration
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';

// Extend the Session interface
declare module 'next-auth' {
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
    };
  }
}

// Danh sách các email có quyền admin
const ADMIN_EMAILS = ['xlab.rnd@gmail.com'];

// Đảm bảo NEXTAUTH_URL được đặt đúng - luôn sử dụng URL tuyệt đối
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Secret key cho NextAuth - yêu cầu phải có trong .env.local
const AUTH_SECRET = process.env.NEXTAUTH_SECRET;
if (!AUTH_SECRET && process.env.NODE_ENV !== 'development') {
  console.warn('NEXTAUTH_SECRET is not set. Using fallback for development only.');
}

// Google OAuth credentials - yêu cầu phải có trong .env.local
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
if ((!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) && process.env.NODE_ENV !== 'development') {
  console.warn('Google OAuth credentials are not set. Using fallback for development only.');
}

// Throttling cache for session tracking
const sessionTrackingCache = new Map<string, number>();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID || 'fallback-client-id',
      clientSecret: GOOGLE_CLIENT_SECRET || 'fallback-client-secret',
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
    signOut: '/',
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.sub;
        if (token.picture) {
          session.user.image = token.picture as string;
        }
        if (token.email && ADMIN_EMAILS.includes(token.email as string)) {
          session.user.isAdmin = true;
        } else {
          session.user.isAdmin = false;
        }
        if (session.user.email) {
          const lastTrackTime = sessionTrackingCache.get(session.user.email) || 0;
          const now = Date.now();
          const trackInterval = 5 * 60 * 1000; // 5 minutes
          if (now - lastTrackTime > trackInterval) {
            sessionTrackingCache.set(session.user.email, now);
            import('@/lib/sessionTracker').then(({ trackUserSession }) => {
              trackUserSession().catch((err) => {
                if (process.env.NODE_ENV === 'development') {
                  console.error('Session tracking error:', err);
                }
              });
            });
          }
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  secret: AUTH_SECRET || 'fallback-secret-for-build',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: false,
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? `__Secure-next-auth.session-token`
          : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
    callbackUrl: {
      name:
        process.env.NODE_ENV === 'production'
          ? `__Secure-next-auth.callback-url`
          : `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? `__Host-next-auth.csrf-token`
          : `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
};