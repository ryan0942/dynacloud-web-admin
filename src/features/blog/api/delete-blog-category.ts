import { delete as del } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'

/**
 * BC-05 刪除部落格類別
 */
export const deleteBlogCategory = async (id: string) => {
  const ENDPOINT = `/blog-categories/${id}`
  return await del<void, ApiResponse<void>>(ENDPOINT)
}
