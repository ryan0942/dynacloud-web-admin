import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 取得 session token (根據 authOptions 中的配置名稱)
  // 在 production 環境下，NextAuth 可能會使用 __Secure- 前綴
  const sessionToken =
    request.cookies.get('next-auth.session-token') ||
    request.cookies.get('__Secure-next-auth.session-token')
  const isAuthenticated = !!sessionToken

  // 定義公開路徑（不需要認證即可訪問）
  const publicPaths = ['/signin']

  // 檢查是否為公開路徑
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  // 情況 1: 已登入用戶訪問登入頁 → 重定向到首頁
  if (isAuthenticated && isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // 情況 2: 未登入用戶訪問受保護頁面 → 重定向到登入頁
  if (!isAuthenticated && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    return NextResponse.redirect(url)
  }

  // 其他情況：允許訪問
  return NextResponse.next()
}

// 配置 matcher，排除靜態資源和 API 路由
export const config = {
  matcher: [
    /*
     * 匹配所有路徑，除了：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public 資料夾下的檔案 (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*|icon-.*\\.png).*)'
  ]
}
