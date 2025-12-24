import { delete as del } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'

/**
 * CA-05 刪除案例
 */
export const deleteCase = async (id: string) => {
  const ENDPOINT = `/cases/${id}`
  return await del<void, ApiResponse<void>>(ENDPOINT)
}
