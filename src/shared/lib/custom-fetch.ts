'use server'
import { authOptions } from '@/app/authOptions'
import { type ApiResponse } from '@/shared/model/types'
import { getServerSession } from 'next-auth'
import { env } from './environment'
import { createErrorResponse } from './error-handler'

export default async function customFetch<T = unknown>(
  url: string,
  requestInit?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const session = await getServerSession(authOptions)
    const token = session?.user?.token || ''

    // 基础 headers
    const baseHeaders: Record<string, string> = {
      Accept: 'application/json'
    }

    // 合并传入的 headers（传入的优先级更高）
    const incomingHeaders =
      (requestInit?.headers as Record<string, string>) || {}
    const mergedHeaders = {
      ...baseHeaders,
      ...incomingHeaders
    }

    // 只有在没有 Content-Type 时才添加默认值
    // 这样 FormData 就不会被覆盖
    if (
      !mergedHeaders['Content-Type'] &&
      !mergedHeaders['content-type'] &&
      requestInit?.body &&
      !(requestInit.body instanceof FormData)
    ) {
      mergedHeaders['Content-Type'] = 'application/json'
    }

    const nextHeaders = token
      ? { ...mergedHeaders, Authorization: `Bearer ${token}` }
      : mergedHeaders

    const fetchOptions: RequestInit = {
      ...requestInit,
      headers: nextHeaders,
      signal: AbortSignal.timeout(+env.SERVICE_TIMEOUT || 15000)
    }
    const response = await fetch(`${env.SERVICE_URL}${url}`, fetchOptions)

    // 檢查回應的 Content-Type
    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return createErrorResponse<T>(
        response.status,
        'INVALID_CONTENT_TYPE',
        `預期 JSON 回應，但收到 ${contentType || 'unknown'}`
      )
    }

    let json: ApiResponse<T>
    try {
      json = await response.json()
    } catch {
      return createErrorResponse<T>(
        response.status,
        'JSON_PARSE_ERROR',
        '無法解析回應為 JSON 格式'
      )
    }

    // ** 錯誤處理流程
    if (!response.ok) {
      // 優先使用後端返回的 message，如果沒有才使用前端 mapping
      const backendMessage = json.message

      if (backendMessage) {
        // 後端有返回 message，直接使用
        return {
          code: response.status,
          success: false,
          result: null as T,
          message: backendMessage
        }
      }

      // 後端沒有返回 message，使用前端 mapping
      return createErrorResponse<T>(
        response.status,
        getErrorCodeByStatus(response.status)
      )
    }

    return json
  } catch (error) {
    // 處理 AbortSignal 超時錯誤
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      return createErrorResponse<T>(504, 'TIMEOUT', `請求超時，請稍後再試`)
    }

    // 處理 AbortSignal 取消錯誤
    if (error instanceof DOMException && error.name === 'AbortError') {
      return createErrorResponse<T>(0, 'ABORTED', `請求已被取消`)
    }

    // 處理網路連線錯誤
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return createErrorResponse<T>(
        0,
        'NETWORK_ERROR',
        `網路連線失敗，請檢查您的網路連線`
      )
    }

    // 處理其他未知錯誤
    return createErrorResponse<T>(
      500,
      'UNKNOWN_ERROR',
      `發生未知錯誤，請稍後再試`
    )
  }
}

// 根據 HTTP 狀態碼取得錯誤代碼
function getErrorCodeByStatus(status: number): string {
  const statusMap: Record<number, string> = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    405: 'METHOD_NOT_ALLOWED',
    409: 'CONFLICT',
    422: 'VALIDATION_ERROR',
    429: 'RATE_LIMITED',
    500: 'INTERNAL_SERVER_ERROR',
    502: 'BAD_GATEWAY',
    503: 'SERVICE_UNAVAILABLE',
    504: 'GATEWAY_TIMEOUT'
  }
  return statusMap[status] || 'UNKNOWN_HTTP_ERROR'
}
