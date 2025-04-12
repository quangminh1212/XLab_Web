import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Cấu hình NextAuth đơn giản nhất có thể
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: "909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  debug: true,
  secret: "121200",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 