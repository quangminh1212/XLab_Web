import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          // This is just a mock implementation
          // In a real app, you would validate against your database
          if (credentials.email === "test@example.com" && credentials.password === "password") {
            return {
              id: "1",
              name: "Test User",
              email: credentials.email,
              image: null
            };
          }
          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
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
    async signIn({ account, profile, user, credentials }) {
      try {
        // Log thông tin xác thực để debug
        console.log("Authentication attempt:", { 
          provider: account?.provider,
          email: profile?.email,
          name: profile?.name,
          userExists: !!user
        });

        if (account?.provider === "google" && profile?.email) {
          // Add any additional validation logic here if needed
          console.log("Google authentication successful for:", profile.email);
          return true;
        }
        if (account?.provider === "credentials") {
          return true;
        }
        console.log("Authentication failed for provider:", account?.provider);
        return false;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },
  },
  debug: true, // Bật chế độ debug
  logger: {
    error(code, metadata) {
      console.error("NextAuth ERROR:", { code, metadata });
    },
    warn(code) {
      console.warn("NextAuth WARNING:", code);
    },
    debug(code, metadata) {
      console.log("NextAuth DEBUG:", { code, metadata });
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "secret-key-at-least-32-characters-long123",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});

export { handler as GET, handler as POST }; 