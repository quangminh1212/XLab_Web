import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // Thêm các provider khác nếu cần
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login', // Sửa từ '/auth/signin' thành '/login'
  },
  // Thêm các cấu hình khác nếu cần, ví dụ: callbacks, adapter, ...
}); 