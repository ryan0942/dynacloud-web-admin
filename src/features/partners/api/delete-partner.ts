import { delete as del } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'

/**
 * [CU-05] 刪除合作夥伴
 */
export const deletePartner = async (id: string) => {
  const ENDPOINT = `/customers/${id}`
  return await del<void, ApiResponse<void>>(ENDPOINT)
}
