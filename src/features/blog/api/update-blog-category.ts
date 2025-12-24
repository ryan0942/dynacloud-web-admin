import { put } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type CreateUpdateBlogCategoryPayload } from '../model/type'

/**
 * BC-04 更新部落格類別
 */
export const updateBlogCategory = async (
  payload: CreateUpdateBlogCategoryPayload & { id: string }
) => {
  const { id, ...rest } = payload
  const ENDPOINT = `/blog-categories/${id}`
  return await put<CreateUpdateBlogCategoryPayload, ApiResponse<void>>(
    ENDPOINT,
    rest
  )
}
