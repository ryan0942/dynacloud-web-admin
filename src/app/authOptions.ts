import { login } from '@/shared/api/login'
import type { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

interface UserWithToken {
  token: string
  [key: string]: unknown
}

export const authOptions: AuthOptions = {
  useSecureCookies: process.env.NODE_ENV === 'production',

  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      }
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      }
    },
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      }
    }
  },

  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      id: 'login',
      name: '帳號密碼',
      credentials: {
        account: { label: 'account', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const payload = {
          account: credentials?.account || '',
          password: credentials?.password || ''
        }
        const res = await login(payload)

        try {
          if (res.success) {
            return {
              id: 'admin',
              token: res.result.access_token
            }
          }
          return null
        } catch (error) {
          console.error('登入失敗:', error)
          return null
        }
      }
    })
  ],

  session: {
    strategy: 'jwt',
    maxAge: 86400 // 1天
  },

  jwt: {
    maxAge: 86400 // 1天
  },

  callbacks: {
    async jwt({ token, user }) {
      // 步驟 1：登入成功時保存 token
      if (user) {
        token.token = (user as unknown as UserWithToken).token
        delete token.userInfo
      }

      // 步驟 2：只要 token 存在，就嘗試從 JWT 解碼獲取 userInfo
      if (token.token && !token.userInfo) {
        try {
          const res = await fetch(`${process.env.SERVICE_URL}/admin/me`, {
            headers: {
              authorization: `Bearer ${token.token}`
            }
          })
          const data = await res.json()
          token.userInfo = data.result
        } catch (error) {
          console.error('❌ JWT 解碼失敗:', error)
        }
      }

      return token
    },

    async session({ session, token }) {
      // 直接使用已經在 jwt callback 中解碼的資訊
      session.user.token = token.token
      session.user.userInfo = token.userInfo

      return session
    }
  },

  pages: {
    signIn: '/signin',
    error: '/signin'
  }
}
