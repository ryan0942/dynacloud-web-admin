import { post } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type CreateServiceCategoryPayload } from '../model/type'

/**
 * SC-01 建立產品服務分類
 */
export const createServiceCategory = async (
  payload: CreateServiceCategoryPayload
) => {
  const ENDPOINT = '/service-categories'
  return await post<CreateServiceCategoryPayload, ApiResponse<void>>(
    ENDPOINT,
    payload
  )
}
