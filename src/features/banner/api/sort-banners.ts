import { put } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type UpdateBannersOrderPayload } from '../model/type'

/**
 * [BA-04] 更新 Banners 排序
 */
export const sortBanners = async (payload: UpdateBannersOrderPayload) => {
  const ENDPOINT = '/banners/sort'
  return await put<UpdateBannersOrderPayload, ApiResponse<void>>(
    ENDPOINT,
    payload
  )
}
