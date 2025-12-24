import { post } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type CreateUpdateBlogCategoryPayload } from '../model/type'

/**
 * BC-01 建立部落格類別
 */
export const createBlogCategory = async (
  payload: CreateUpdateBlogCategoryPayload
) => {
  const ENDPOINT = '/blog-categories'
  return await post<CreateUpdateBlogCategoryPayload, ApiResponse<void>>(
    ENDPOINT,
    payload
  )
}
