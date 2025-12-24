import { fetch } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type CompanyInfoResponse } from '../model/type'

/**
 * [CO-01] 管理員取得公司資訊
 */
export const fetchCompanyInfo = async () => {
  const ENDPOINT = '/company-info/admin'
  return fetch<void, ApiResponse<CompanyInfoResponse>>(ENDPOINT)
}
