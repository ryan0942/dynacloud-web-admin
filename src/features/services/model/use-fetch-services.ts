import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchServices } from '../api/fetch-services'
import { type FetchServicesParams } from './type'

/**
 * SE-02 取得所有產品服務
 */
export const useFetchServices = (params: FetchServicesParams) => {
  return useQuery({
    queryKey: ['services', params],
    queryFn: () => fetchServices(params),
    placeholderData: keepPreviousData
  })
}
