import { delete as del } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'

/**
 * SC-05 刪除產品服務分類
 */
export const deleteServiceCategory = async (id: string) => {
  const ENDPOINT = `/service-categories/${id}`
  return await del<void, ApiResponse<void>>(ENDPOINT)
}
