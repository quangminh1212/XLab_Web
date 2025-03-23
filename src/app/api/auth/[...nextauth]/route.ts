import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

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

// Cấu hình với logger rõ ràng hơn
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("[NextAuth] Authorize called with credentials", 
          credentials ? { email: credentials.email } : "no credentials");

        // Cho phép đăng nhập với bất kỳ thông tin nào trong môi trường phát triển
        if (credentials?.email) {
          // Demo account
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
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      console.log("[NextAuth] Session callback", { sessionUser: session?.user, token });
      
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      console.log("[NextAuth] JWT callback", { 
        tokenSub: token?.sub,
        userId: user?.id,
        accountType: account?.provider
      });
      
      // Initial sign in
      if (user && account) {
        token.id = user.id;
        token.provider = account.provider;
      }
      return token;
    },
  },
  logger: {
    error(code, metadata) {
      console.error(`[NextAuth] [Error] ${code}:`, metadata);
    },
    warn(code) {
      console.warn(`[NextAuth] [Warning] ${code}`);
    },
    debug(code, metadata) {
      console.log(`[NextAuth] ${code}:`, metadata);
    }
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET || "TEST_SECRET_DO_NOT_USE_IN_PRODUCTION",
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});

export { handler as GET, handler as POST }; 