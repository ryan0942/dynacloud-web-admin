import { post } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type CreateUpdateNewsCategoryPayload } from '../model/type'

/**
 * NC-01 建立媒體活動類別
 */
export const createNewsCategory = async (
  payload: CreateUpdateNewsCategoryPayload
) => {
  const ENDPOINT = '/news-categories'
  return await post<CreateUpdateNewsCategoryPayload, ApiResponse<void>>(
    ENDPOINT,
    payload
  )
}
