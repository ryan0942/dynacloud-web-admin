import { fetch } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type AboutInfoResponse } from '../model/type'

/**
 * [AB-01] 管理員取得關於我們資訊
 */
export const fetchAbout = async () => {
  const ENDPOINT = '/about/admin'
  return await fetch<void, ApiResponse<AboutInfoResponse>>(ENDPOINT)
}
