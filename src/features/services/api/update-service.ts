import { put } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type UpdateServicePayload } from '../model/type'

/**
 * SE-04 更新產品服務
 */
export const updateService = async (
  payload: UpdateServicePayload & { id: string }
) => {
  const { id, ...rest } = payload
  const ENDPOINT = `/services/${id}`
  return await put<UpdateServicePayload, ApiResponse<void>>(ENDPOINT, rest)
}
