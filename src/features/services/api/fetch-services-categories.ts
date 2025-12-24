import { fetch } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type ServiceCategory } from '../model/type'

/**
 * SC-02 取得所有產品服務分類
 */
export const fetchServicesCategories = async () => {
  const ENDPOINT = '/service-categories/admin'
  return await fetch<void, ApiResponse<ServiceCategory[]>>(ENDPOINT)
}
