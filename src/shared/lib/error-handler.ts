import { type ApiResponse } from '../model/types'

export class HttpError extends Error {
  public readonly name = 'HttpError'

  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
    public readonly response?: ApiResponse<unknown>
  ) {
    super(message)
  }
}

export class NetworkError extends Error {
  public readonly name = 'NetworkError'

  constructor(
    message: string,
    public readonly originalError?: Error
  ) {
    super(message)
  }
}

export class TimeoutError extends Error {
  public readonly name = 'TimeoutError'

  constructor(message: string = 'Request timeout') {
    super(message)
  }
}

/**
 * 建立符合 ApiResponse 格式的錯誤回應
 * @param statusCode HTTP 狀態碼
 * @param code 錯誤代碼（可選）
 * @param customMessage 自定義錯誤訊息（可選）
 * @returns ApiResponse 格式的錯誤回應
 */
export function createErrorResponse<T = null>(
  statusCode: number,
  _code?: string,
  customMessage?: string
): ApiResponse<T> {
  const defaultMessage = getI18ErrorMessageByStatus(statusCode)

  return {
    code: statusCode,
    success: false,
    result: null as T,
    message: customMessage || defaultMessage || '發生未知錯誤'
  }
}

// 根據 HTTP 狀態碼取得國際化錯誤訊息
function getI18ErrorMessageByStatus(status: number): string {
  const messageMap: Record<number, string> = {
    400: '請求參數無效',
    401: '請重新登入驗證身份',
    403: '您沒有權限執行此操作',
    404: '找不到所請求的資源',
    405: '不支援的請求方法',
    409: '資源衝突，請重新整理後再試',
    422: '資料驗證失敗',
    429: '請求過於頻繁，請稍後再試',
    500: '伺服器發生錯誤，請稍後再試',
    502: '服務閘道錯誤',
    503: '服務暫時無法使用，請稍後再試',
    504: '閘道逾時'
  }

  return messageMap[status] || '發生未知的伺服器錯誤'
}
