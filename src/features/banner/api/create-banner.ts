import { post } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type CreateBannerPayload } from '../model/type'

/**
 * [BA-01] 建立 Banner
 */
export const createBanner = async (payload: CreateBannerPayload) => {
  const ENDPOINT = '/banners'
  return await post<CreateBannerPayload, ApiResponse<void>>(ENDPOINT, payload)
}
