import { post } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type CreatePartnerPayload } from '../model/type'

/**
 * [CU-01] 建立合作夥伴
 */
export const createPartner = async (payload: CreatePartnerPayload) => {
  const ENDPOINT = '/customers'
  return await post<CreatePartnerPayload, ApiResponse<void>>(ENDPOINT, payload)
}
