import { fetch } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type CaseDetail } from '../model/type'

/**
 * CA-03 取得單一案例
 */
export const fetchCase = async (id: string) => {
  const ENDPOINT = `/cases/admin/${id}`
  return await fetch<void, ApiResponse<CaseDetail>>(ENDPOINT)
}
