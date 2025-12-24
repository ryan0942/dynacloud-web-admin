// app/authOptions.ts
import type { DefaultSession } from 'next-auth'
import NextAuth from 'next-auth'

import { authOptions } from '@/app/authOptions'
// ** Types
import { type AdminInfo } from '@/features/auth/model/type'

declare module 'next-auth/jwt' {
  interface JWT {
    token?: string
    refreshToken?: string
    userInfo?: AdminInfo
  }
}

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      token?: string
      userInfo?: AdminInfo
    }
  }
}

const handler = NextAuth(authOptions)

// App Router 下，需同時匯出 GET 與 POST
export { handler as GET, handler as POST }
