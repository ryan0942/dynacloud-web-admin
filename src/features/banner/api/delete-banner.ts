import { delete as del } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'

/**
 * [BA-05] 刪除 Banner
 */
export const deleteBanner = async (payload: { id: string }) => {
  const ENDPOINT = `/banners/${payload.id}`
  return await del<void, ApiResponse<void>>(ENDPOINT)
}
