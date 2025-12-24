import customFetch from './custom-fetch'

type QueryParameters = Record<string, unknown>

function buildQueryString(params?: QueryParameters): string {
  if (!params) return ''
  const esc = encodeURIComponent
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${esc(k)}=${esc(String(v))}`)
    .join('&')
  return query ? `?${query}` : ''
}

/**
 * GET 方法
 * @param url     相對路徑，例如 '/api/course/ai_training_1'
 * @param params  可選的 query 參數物件
 * @param init    可選的 RequestInit（可以額外帶 header、mode、credentials…）
 */
async function getRequest<T, U>(
  url: string,
  params?: T,
  init?: RequestInit
): Promise<U> {
  const qs = buildQueryString(params as unknown as QueryParameters)
  // _fullUrl_ 只用相對路徑，最終會在後端 Proxy 裡面轉發到真正的外部 API
  const fullUrl = `${url}${qs}`

  // 統一把 method='GET' 傳給 customFetch
  return customFetch(fullUrl, {
    ...init,
    method: 'GET'
  }) as Promise<U>
}

/**
 * POST 方法
 * @param url   相對路徑
 * @param data  request body 物件
 * @param init  可選的 RequestInit
 */
async function postRequest<T, U>(
  url: string,
  data?: T,
  init?: RequestInit
): Promise<U> {
  // 檢查是否為 FormData
  const isFormData = data instanceof FormData

  const headers = isFormData
    ? init?.headers || {}
    : init?.headers
      ? { ...init.headers, 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/json' }

  return customFetch(url, {
    ...init,
    method: 'POST',
    headers,
    body: isFormData ? data : data ? JSON.stringify(data) : undefined
  }) as Promise<U>
}

/**
 * PUT 方法
 * @param url   相對路徑
 * @param data  request body 物件
 */
async function putRequest<T, U>(url: string, data?: T): Promise<U> {
  const headers = { 'Content-Type': 'application/json' }

  return customFetch(url, {
    method: 'PUT',
    headers,
    body: data ? JSON.stringify(data) : undefined
  }) as Promise<U>
}

/**
 * DELETE 方法（不帶 body，只帶 query params）
 * @param url     相對路徑
 * @param params  可選的 query 參數物件
 */
async function deleteRequest<T, U>(url: string, params?: T): Promise<U> {
  const qs = buildQueryString(params as unknown as QueryParameters)
  const fullUrl = `${url}${qs}`

  return customFetch(fullUrl, {
    method: 'DELETE'
  }) as Promise<U>
}

export {
  deleteRequest as delete,
  getRequest as fetch,
  postRequest as post,
  putRequest as put
}
