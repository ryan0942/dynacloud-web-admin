/**
 * 聯絡我們
 */
export type Contact = {
  id: string
  name: string
  email: string
  phone: string
  message: string
  createdAt: string
  updatedAt: string
}

/**
 * 取得聯絡我們列表 Params
 */
export type FetchContactParams = {
  page: number
  limit: number
  query: string
}
