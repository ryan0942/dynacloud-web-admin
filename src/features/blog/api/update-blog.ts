import { put } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type CreateUpdateBlogPayload } from '../model/type'

/**
 * BL-04 更新部落格
 */
export const updateBlog = async (
  payload: CreateUpdateBlogPayload & { id: string }
) => {
  const { id, ...rest } = payload
  const ENDPOINT = `/blogs/${id}`
  return await put<CreateUpdateBlogPayload, ApiResponse<void>>(ENDPOINT, rest)
}
