import { put } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type UpdateAdminInfoPayload } from '../model/type'

/**
 * AD-02 更新管理員資訊
 */
export const updateAdminInfo = async (payload: UpdateAdminInfoPayload) => {
  const ENDPOINT = '/admin/me'
  return await put<UpdateAdminInfoPayload, ApiResponse<void>>(ENDPOINT, payload)
}
