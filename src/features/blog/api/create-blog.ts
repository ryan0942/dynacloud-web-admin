import { post } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type CreateUpdateBlogPayload } from '../model/type'

/**
 * BL-01 建立部落格
 */
export const createBlog = async (payload: CreateUpdateBlogPayload) => {
  const ENDPOINT = '/blogs'
  return await post<CreateUpdateBlogPayload, ApiResponse<void>>(
    ENDPOINT,
    payload
  )
}
