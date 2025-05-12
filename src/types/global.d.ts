import { User } from 'next-auth';

// Mở rộng User type cho NextAuth
declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    isAdmin?: boolean;
    role?: 'USER' | 'ADMIN' | 'STORE_OWNER';
    stores?: Array<{ id: string, name: string }>;
  }

  interface Session {
    user: User;
  }
} 