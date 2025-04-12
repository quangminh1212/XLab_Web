import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Thông tin xác thực cố định
const CLIENT_ID = "909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com";
const CLIENT_SECRET = "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";

console.log("[NextAuth route.js] Khởi tạo với client_id:", CLIENT_ID.substring(0, 15) + "...");

// Cấu hình đơn giản nhất có thể
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    }),
  ],
  debug: true,
  secret: "121200",
});

export { handler as GET, handler as POST }; 