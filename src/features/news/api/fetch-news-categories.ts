import { fetch } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type NewsCategory } from '../model/type'

/**
 * NC-02-A 取得所有媒體活動類別
 */
export const fetchNewsCategories = async () => {
  const ENDPOINT = '/news-categories/admin'
  return await fetch<void, ApiResponse<NewsCategory[]>>(ENDPOINT)
}
