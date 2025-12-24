import { fetch } from '@/shared/lib/http'
import { type PaginationApiResponse } from '@/shared/model/types'
import { type FetchCaseParams, type Case } from '../model/type'

/**
 * CA-02 取得案例列表
 */
export const fetchCaseList = async (params: FetchCaseParams) => {
  const ENDPOINT = '/cases/admin'
  return await fetch<FetchCaseParams, PaginationApiResponse<Case[]>>(
    ENDPOINT,
    params
  )
}
