import { fetch } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type PrivacyPolicy } from '../model/type'

/**
 * [PP-01] 管理員取得隱私政策資訊
 */
export const fetchPrivacyPolicy = async () => {
  const ENDPOINT = '/privacy-policy/admin'
  return await fetch<void, ApiResponse<PrivacyPolicy>>(ENDPOINT)
}
