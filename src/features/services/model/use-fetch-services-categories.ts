import { useQuery } from '@tanstack/react-query'
import { fetchServicesCategories } from '../api/fetch-services-categories'

/**
 * SC-02 取得所有產品服務分類
 */
export const useFetchServicesCategories = () => {
  return useQuery({
    queryKey: ['services-categories'],
    queryFn: fetchServicesCategories
  })
}
