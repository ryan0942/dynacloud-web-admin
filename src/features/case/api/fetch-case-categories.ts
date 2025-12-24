import { fetch } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type CaseCategory } from '../model/type'

/**
 * CC-02-A 取得所有案例分類
 */
export const fetchCaseCategories = async () => {
  const ENDPOINT = '/case-categories/admin'
  return await fetch<void, ApiResponse<CaseCategory[]>>(ENDPOINT)
}
