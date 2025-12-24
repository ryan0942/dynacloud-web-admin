import { put } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type CreateUpdateCaseCategoryPayload } from '../model/type'

/**
 * CC-04 更新案例分類
 */
export const updateCaseCategory = async (
  payload: CreateUpdateCaseCategoryPayload & { id: string }
) => {
  const { id, ...rest } = payload
  const ENDPOINT = `/case-categories/${id}`
  return await put<CreateUpdateCaseCategoryPayload, ApiResponse<void>>(
    ENDPOINT,
    rest
  )
}
