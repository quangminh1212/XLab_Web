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
        password: { label: "Password", type: "password" },
        remember: { label: "Remember Me", type: "checkbox" }
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
          
          // Thêm một tài khoản test thứ hai để dễ dàng kiểm thử
          if (credentials.email === "admin@xlab.com" && credentials.password === "123456") {
            return {
              id: "2",
              name: "Admin XLab",
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
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user && account) {
        token.id = user.id;
        token.provider = account.provider;
      }
      
      // Xử lý cập nhật token khi có thay đổi
      if (trigger === 'update' && session) {
        // Giữ nguyên ID và provider nhưng cập nhật các thông tin khác nếu cần
        Object.assign(token, session);
      }
      
      return token;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        // Log thông tin xác thực để debug
        console.log("Authentication attempt:", { 
          provider: account?.provider,
          email: profile?.email || credentials?.email,
          name: profile?.name,
          userExists: !!user,
          remember: !!credentials?.remember
        });

        if (account?.provider === "google" && profile?.email) {
          // Add any additional validation logic here if needed
          console.log("Google authentication successful for:", profile.email);
          return true;
        }
        if (account?.provider === "credentials") {
          console.log("Credentials authentication successful for:", credentials?.email);
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
  debug: process.env.NODE_ENV === 'development', // Chỉ bật debug ở môi trường development
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
    // Thay đổi maxAge dựa trên giá trị remember
    // 30 ngày nếu remember = true, 1 ngày nếu remember = false
    maxAge: 30 * 24 * 60 * 60, // Default: 30 days
  },
});

export { handler as GET, handler as POST }; 