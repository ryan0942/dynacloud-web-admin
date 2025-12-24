import { delete as del } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'

/**
 * SE-05 刪除產品服務
 */
export const deleteService = async (id: string) => {
  const ENDPOINT = `/services/${id}`
  return await del<void, ApiResponse<void>>(ENDPOINT)
}
