import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Tạo handler với cấu hình đơn giản nhất
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: "909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com",
      clientSecret: "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"
    })
  ],
  secret: "121200",
  debug: true
});

export { handler as GET, handler as POST }; 