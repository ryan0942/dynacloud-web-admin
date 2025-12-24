import { delete as del } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'

/**
 * NE-05 刪除媒體活動
 */
export const deleteNews = async (id: string) => {
  const ENDPOINT = `/news/${id}`
  return await del<void, ApiResponse<void>>(ENDPOINT)
}
