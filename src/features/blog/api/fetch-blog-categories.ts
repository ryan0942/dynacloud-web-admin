import { fetch } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type BlogCategory } from '../model/type'

/**
 * BC-02-A 取得所有部落格類別
 */
export const fetchBlogCategories = async () => {
  const ENDPOINT = '/blog-categories/admin'
  return await fetch<void, ApiResponse<BlogCategory[]>>(ENDPOINT)
}
