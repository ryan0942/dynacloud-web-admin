import { delete as del } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'

/**
 * CC-05 刪除案例分類
 */
export const deleteCaseCategory = async (id: string) => {
  const ENDPOINT = `/case-categories/${id}`
  return await del<void, ApiResponse<void>>(ENDPOINT)
}
