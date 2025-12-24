import { post } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type CreateUpdateCasePayload } from '../model/type'

/**
 * CA-01 建立案例
 */
export const createCase = async (payload: CreateUpdateCasePayload) => {
  const ENDPOINT = '/cases'
  return await post<CreateUpdateCasePayload, ApiResponse<void>>(
    ENDPOINT,
    payload
  )
}
