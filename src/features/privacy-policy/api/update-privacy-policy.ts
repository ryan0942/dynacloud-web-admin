import { put } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type UpdatePrivacyPolicyPayload } from '../model/type'

/**
 * [PP-02] 管理員更新隱私政策資訊
 */
export const updatePrivacyPolicy = async (
  payload: UpdatePrivacyPolicyPayload
) => {
  const ENDPOINT = '/privacy-policy'
  return await put<UpdatePrivacyPolicyPayload, ApiResponse<void>>(
    ENDPOINT,
    payload
  )
}
