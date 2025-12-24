import { fetch } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type BlogDetail } from '../model/type'

/**
 * BL-03 取得單一部落格
 */
export const fetchBlog = async (id: string) => {
  const ENDPOINT = `/blogs/admin/${id}`
  return await fetch<void, ApiResponse<BlogDetail>>(ENDPOINT)
}
