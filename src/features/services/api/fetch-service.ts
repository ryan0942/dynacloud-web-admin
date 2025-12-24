import { fetch } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type ServiceDetail } from '../model/type'

/**
 * SE-03 取得單一產品服務
 */
export const fetchService = async (id: string) => {
  const ENDPOINT = `/services/admin/${id}`
  return await fetch<void, ApiResponse<ServiceDetail>>(ENDPOINT)
}
