'use client'
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'

export function AuthProvider({
  children,
  session
}: {
  children: React.ReactNode
  session: Session | null
}) {
  return (
    <SessionProvider
      session={session}
      refetchInterval={3600} // 每 1 小時檢查一次
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  )
}
