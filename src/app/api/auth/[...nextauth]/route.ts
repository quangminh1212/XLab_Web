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

// Logger cải tiến để ghi log chi tiết trong quá trình authentication
const logger = {
  error: (code: string, ...message: any) => {
    console.error(`[NextAuth Error] [${code}]`, ...message)
    // Thêm log chi tiết nếu có stack trace
    if (message[0] instanceof Error) {
      console.error(`[NextAuth Error] [${code}] Stack:`, message[0].stack)
    }
  },
  warn: (code: string, ...message: any) => {
    console.warn(`[NextAuth Warning] [${code}]`, ...message)
  },
  debug: (code: string, ...message: any) => {
    console.log(`[NextAuth Debug] [${code}]`, ...message)
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
          console.log('[NextAuth] Credentials đầy đủ:', { 
            email: credentials?.email,
            passwordProvided: !!credentials?.password 
          })
          
          // Kiểm tra xem credentials đã được cung cấp chưa
          if (!credentials?.email || !credentials?.password) {
            console.warn('[NextAuth] Missing credentials -', { 
              email: !!credentials?.email,
              password: !!credentials?.password 
            })
            return null
          }
          
          // Giả lập xác thực thành công
          if (credentials?.email && credentials?.password) {
            console.log('[NextAuth] Authentication successful for:', credentials.email)
            
            // Log kết quả xác thực
            const user = {
              id: '1',
              name: 'Admin User',
              email: credentials.email
            }
            console.log('[NextAuth] User object created:', JSON.stringify(user))
            
            return user
          }
          
          console.log('[NextAuth] Authentication failed: Invalid credentials')
          return null
        } catch (error) {
          console.error('[NextAuth] Authentication error:', error)
          // Log stack trace nếu có
          if (error instanceof Error) {
            console.error('[NextAuth] Error stack:', error.stack)
          }
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
      console.log('[NextAuth] JWT callback triggered')
      console.log('[NextAuth] JWT input:', { 
        tokenExists: !!token,
        userExists: !!user,
        userId: user?.id
      })
      
      // Thêm thông tin từ user vào token nếu có
      if (user) {
        console.log('[NextAuth] Adding user data to token')
        token.id = user.id
      }
      
      // Log kết quả token (không bao gồm các field nhạy cảm)
      console.log('[NextAuth] JWT token created:', { 
        id: token.id,
        name: token.name,
        email: token.email?.substring(0, 3) + '...',
        expires: token.exp 
      })
      
      return token
    },
    async session({ session, token }) {
      console.log('[NextAuth] Session callback triggered')
      console.log('[NextAuth] Session input:', { 
        sessionExists: !!session,
        tokenExists: !!token 
      })
      
      // Thêm thông tin từ token vào session
      if (token && session.user) {
        console.log('[NextAuth] Adding token data to session')
        session.user.id = token.id as string
      }
      
      // Log session đã được tạo (không bao gồm các field nhạy cảm)
      console.log('[NextAuth] Session created:', { 
        userId: session.user?.id,
        userName: session.user?.name,
        expires: session.expires 
      })
      
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