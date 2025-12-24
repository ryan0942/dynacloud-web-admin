import { put } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type CreateServiceCategoryPayload } from '../model/type'

/**
 * SC-04 更新產品服務分類
 */
export const updateServiceCategory = async (
  payload: CreateServiceCategoryPayload & { id: string }
) => {
  const { id, ...rest } = payload
  const ENDPOINT = `/service-categories/${id}`
  return await put<CreateServiceCategoryPayload, ApiResponse<void>>(
    ENDPOINT,
    rest
  )
}
