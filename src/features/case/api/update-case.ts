import { put } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type CreateUpdateCasePayload } from '../model/type'

/**
 * CA-04 更新案例
 */
export const updateCase = async (
  payload: CreateUpdateCasePayload & { id: string }
) => {
  const { id, ...rest } = payload
  const ENDPOINT = `/cases/${id}`
  return await put<CreateUpdateCasePayload, ApiResponse<void>>(ENDPOINT, rest)
}
