import { fetch } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type NewsDetail } from '../model/type'

/**
 * NE-03 取得單一媒體活動
 */
export const fetchNews = async (id: string) => {
  const ENDPOINT = `/news/admin/${id}`
  return await fetch<void, ApiResponse<NewsDetail>>(ENDPOINT)
}
