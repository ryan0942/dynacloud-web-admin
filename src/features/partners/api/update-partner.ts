import { put } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type UpdatePartnerPayload } from '../model/type'

/**
 * [CU-05] 更新合作夥伴
 */
export const updatePartner = async (
  payload: UpdatePartnerPayload & { id: string }
) => {
  const { id, ...rest } = payload
  const ENDPOINT = `/customers/${id}`
  return await put<UpdatePartnerPayload, ApiResponse<void>>(ENDPOINT, rest)
}
