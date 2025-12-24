import { put } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type CreateUpdateNewsCategoryPayload } from '../model/type'

/**
 * NC-04 更新媒體活動類別
 */
export const updateNewsCategory = async (
  payload: CreateUpdateNewsCategoryPayload & { id: string }
) => {
  const { id, ...rest } = payload
  const ENDPOINT = `/news-categories/${id}`
  return await put<CreateUpdateNewsCategoryPayload, ApiResponse<void>>(
    ENDPOINT,
    rest
  )
}
