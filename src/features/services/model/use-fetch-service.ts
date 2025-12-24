import { useQuery } from '@tanstack/react-query'
import { fetchService } from '../api/fetch-service'

/**
 * SE-03 取得單一產品服務
 */
export const useFetchService = (id: string) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => fetchService(id)
  })
}
