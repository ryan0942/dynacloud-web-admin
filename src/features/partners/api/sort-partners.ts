import { put } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type UpdatePartnersOrderPayload } from '../model/type'

/**
 * [CU-05] 更新合作夥伴排序
 */
export const sortPartners = async (payload: UpdatePartnersOrderPayload) => {
  const ENDPOINT = '/customers/sort'
  return await put<UpdatePartnersOrderPayload, ApiResponse<void>>(
    ENDPOINT,
    payload
  )
}
