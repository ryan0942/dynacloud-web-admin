import { put } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type UpdateAdminPasswordPayload } from '../model/type'

/**
 * AD-03 更新管理員密碼
 */
export const changeAdminPassword = async (
  payload: UpdateAdminPasswordPayload
) => {
  const ENDPOINT = '/admin/me/password'
  return await put<UpdateAdminPasswordPayload, ApiResponse<void>>(
    ENDPOINT,
    payload
  )
}
