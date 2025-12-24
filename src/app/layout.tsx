import './globals.css'

import { SidebarProvider } from '@/context/SidebarContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { ToastProvider } from '@/context/ToastContext'
import { Viewport } from 'next'
import { Noto_Sans_TC, Poppins } from 'next/font/google'
import { Providers } from './providers'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from './auth-provider'
import { ReactQueryClientProvider } from './query-provider'

import { getServerSession } from 'next-auth'
import { authOptions } from './authOptions'

const notoSansTC = Noto_Sans_TC({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin']
})
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin']
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body
        className={`${notoSansTC.className} ${poppins.className} dark:bg-gray-900`}
      >
        <AuthProvider session={session}>
          <ReactQueryClientProvider>
            <Providers>
              <ThemeProvider>
                <ToastProvider>
                  <SidebarProvider>{children}</SidebarProvider>
                </ToastProvider>
              </ThemeProvider>
            </Providers>
            <ReactQueryDevtools />
          </ReactQueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
