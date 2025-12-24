import { fetch } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type Partner } from '../model/type'

/**
 * [CU-02] 取得合作夥伴
 */
export const fetchPartners = async () => {
  const ENDPOINT = '/customers/admin'
  return await fetch<void, ApiResponse<Partner[]>>(ENDPOINT)
}
