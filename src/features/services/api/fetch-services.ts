import { fetch } from '@/shared/lib/http'
import { type PaginationApiResponse } from '@/shared/model/types'
import { type FetchServicesParams, type Service } from '../model/type'

/**
 * SE-02 取得所有產品服務
 */
export const fetchServices = async (params: FetchServicesParams) => {
  const ENDPOINT = '/services/admin'
  return await fetch<FetchServicesParams, PaginationApiResponse<Service[]>>(
    ENDPOINT,
    params
  )
}
