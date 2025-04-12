import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Mở rộng đối tượng Session mặc định của NextAuth
   */
  interface Session {
    user: {
      /** ID người dùng đã xác thực */
      id?: string;
      /** Access token từ OAuth provider */
      accessToken?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  /**
   * Mở rộng đối tượng JWT
   */
  interface JWT {
    /** Access token từ OAuth provider */
    accessToken?: string;
    /** ID người dùng đã xác thực */
    id?: string;
  }
} 