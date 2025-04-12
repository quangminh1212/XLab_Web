import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: "909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  debug: true,
  secret: "121200",
}); 