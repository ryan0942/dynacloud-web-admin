import { useQuery } from '@tanstack/react-query'
import { fetchCase } from '../api/fetch-case'

/**
 * CA-03 取得單一案例
 */
export const useFetchCase = (id: string) => {
  return useQuery({
    queryKey: ['case', id],
    queryFn: () => fetchCase(id)
  })
}
