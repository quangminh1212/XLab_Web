import NextAuth, { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { z } from 'zod'

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

// Tạo custom logger cho NextAuth nhưng tuân thủ đúng interface
const logger = {
  error(code, metadata) {
    console.error(`[NextAuth] [ERROR] [${code}]`, metadata)
  },
  warn(code) {
    console.warn(`[NextAuth] [WARN] [${code}]`)
  },
  debug(code, metadata) {
    console.log(`[NextAuth] [DEBUG] [${code}]`, metadata)
  }
}

// Schema xác thực đầu vào
const loginSchema = z.object({
  email: z.string().email({ message: 'Định dạng email không hợp lệ' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 kí tự' })
})

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  logger: logger,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mật khẩu', type: 'password' }
      },
      async authorize(credentials) {
        // Thêm logging khi authorize được gọi
        console.log('[NextAuth] [DEBUG] authorize', { 
          credentialsProvided: !!credentials,
          email: credentials?.email ? `${credentials.email.substring(0, 3)}...` : 'missing'
        })
        
        if (!credentials) {
          console.warn('[NextAuth] [WARN] authorize: Credentials not provided')
          return null
        }
        
        try {
          // Xác thực dữ liệu đầu vào
          const result = loginSchema.safeParse(credentials)
          
          if (!result.success) {
            console.warn('[NextAuth] [WARN] authorize: Validation failed', result.error.errors)
            return null
          }
          
          // Mô phỏng đăng nhập thành công cho môi trường dev
          // Trong môi trường thực tế, cần triển khai kiểm tra password với DB
          if (process.env.NODE_ENV === 'development') {
            console.log('[NextAuth] [DEBUG] authorize: Dev mode login, skipping password check')
            
            // Test user
            if (credentials.email === 'test@example.com' && credentials.password === 'password') {
              console.log('[NextAuth] [DEBUG] authorize: Test user authenticated')
              
              return {
                id: '1',
                name: 'Test User',
                email: credentials.email,
                role: 'user'
              }
            }
            
            // Admin user
            if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
              console.log('[NextAuth] [DEBUG] authorize: Admin user authenticated')
              
              return {
                id: '2',
                name: 'Admin User',
                email: credentials.email,
                role: 'admin'
              }
            }
          }
          
          // Đây là nơi xác thực thực tế sẽ được thực hiện (database, API, etc.)
          
          console.warn('[NextAuth] [WARN] authorize: Invalid credentials provided')
          return null
        } catch (error) {
          console.error('[NextAuth] [ERROR] authorize', error)
          return null
        }
      }
    }),
    // Google Provider (nếu có cấu hình)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log('[NextAuth] [DEBUG] jwt callback', { 
        tokenExists: !!token,
        userProvided: !!user,
        accountProvided: !!account
      })
      
      // Truyền bổ sung dữ liệu từ user vào token
      if (user) {
        console.log('[NextAuth] [DEBUG] jwt callback: Adding user data to token')
        
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: (user as any).role || 'user'
        }
      }
      
      return token
    },
    async session({ session, token, user }) {
      console.log('[NextAuth] [DEBUG] session callback', { 
        sessionExists: !!session, 
        tokenExists: !!token,
        userProvided: !!user
      })
      
      // Truyền dữ liệu từ token vào session
      if (token && token.user) {
        console.log('[NextAuth] [DEBUG] session callback: Adding token data to session')
        session.user = {
          ...session.user,
          ...(token.user as any)
        }
      }
      
      return session
    },
    async redirect({ url, baseUrl }) {
      console.log('[NextAuth] [DEBUG] redirect callback', { url, baseUrl })
      
      // Đảm bảo redirect URL hợp lệ
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      } else if (new URL(url).origin === baseUrl) {
        return url
      }
      
      return baseUrl
    }
  },
  pages: {
    signIn: '/login',
    error: '/login?error=true',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-for-development-only'
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 