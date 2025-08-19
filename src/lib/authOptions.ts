import { NextAuthOptions } from 'next-auth';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';

// Extend the Session interface (same augmentation used in route)
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

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'xlab.rnd@gmail.com')
  .split(',')
  .map((e) => e.trim())
  .filter(Boolean);
const AUTH_SECRET = process.env.NEXTAUTH_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Throttling cache for session tracking (kept here to reuse in callbacks)
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
    async jwt({ token, user }) {
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
      name: process.env.NODE_ENV === 'production' ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
    callbackUrl: {
      name: process.env.NODE_ENV === 'production' ? `__Secure-next-auth.callback-url` : `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production' ? `__Host-next-auth.csrf-token` : `next-auth.csrf-token`,
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

