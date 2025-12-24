import { delete as del } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'

/**
 * BL-05 刪除部落格
 */
export const deleteBlog = async (id: string) => {
  const ENDPOINT = `/blogs/${id}`
  return await del<void, ApiResponse<void>>(ENDPOINT)
}
