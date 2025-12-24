import { post } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type CreateServicePayload } from '../model/type'

/**
 * SE-01 建立產品服務
 */
export const createService = async (payload: CreateServicePayload) => {
  const ENDPOINT = '/services'
  return await post<CreateServicePayload, ApiResponse<void>>(ENDPOINT, payload)
}
