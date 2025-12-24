import { fetch } from '@/shared/lib/http'
import { type PaginationApiResponse } from '@/shared/model/types'
import { type FetchBlogParams, type Blog } from '../model/type'

/**
 * BL-02 取得部落格列表
 */
export const fetchBlogList = async (params: FetchBlogParams) => {
  const ENDPOINT = '/blogs/admin'
  return await fetch<FetchBlogParams, PaginationApiResponse<Blog[]>>(
    ENDPOINT,
    params
  )
}
