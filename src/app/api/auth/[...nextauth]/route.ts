import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

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

// Logger để ghi log trong quá trình authentication
const logger = {
  error: (code: string, ...message: any) => {
    console.error(code, ...message)
  },
  warn: (code: string, ...message: any) => {
    console.warn(code, ...message)
  },
  debug: (code: string, ...message: any) => {
    console.log(code, ...message)
  }
}

// Tạo và xuất handler NextAuth
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          // Log thông tin credentials nhận được (không bao gồm mật khẩu trong production)
          console.log('[NextAuth] Authorization attempt for email:', credentials?.email)
          
          // Giả lập xác thực thành công
          if (credentials?.email && credentials?.password) {
            console.log('[NextAuth] Authentication successful for:', credentials.email)
            
            return {
              id: '1',
              name: 'Admin User',
              email: credentials.email
            }
          }
          
          console.log('[NextAuth] Authentication failed: Invalid credentials')
          return null
        } catch (error) {
          console.error('[NextAuth] Authentication error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('[NextAuth] JWT callback, user:', user ? 'present' : 'not present')
      
      // Thêm thông tin từ user vào token nếu có
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      console.log('[NextAuth] Session callback, token:', token ? 'present' : 'not present')
      
      // Thêm thông tin từ token vào session
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/error',
  },
  debug: process.env.NODE_ENV === 'development',
  logger,
})

export { handler as GET, handler as POST } 