import { delete as del } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'

/**
 * NC-05 刪除媒體活動類別
 */
export const deleteNewsCategory = async (id: string) => {
  const ENDPOINT = `/news-categories/${id}`
  return await del<void, ApiResponse<void>>(ENDPOINT)
}
