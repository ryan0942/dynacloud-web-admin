import { put } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type UpdateBannerPayload } from '../model/type'

/**
 * [BA-05] 更新 Banner
 */
export const updateBanner = async (payload: UpdateBannerPayload) => {
  const ENDPOINT = `/banners/${payload.id}`
  return await put<UpdateBannerPayload, ApiResponse<void>>(ENDPOINT, payload)
}
