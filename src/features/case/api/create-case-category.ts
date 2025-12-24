import { post } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type CreateUpdateCaseCategoryPayload } from '../model/type'

/**
 * CC-01 建立案例分類
 */
export const createCaseCategory = async (
  payload: CreateUpdateCaseCategoryPayload
) => {
  const ENDPOINT = '/case-categories'
  return await post<CreateUpdateCaseCategoryPayload, ApiResponse<void>>(
    ENDPOINT,
    payload
  )
}
