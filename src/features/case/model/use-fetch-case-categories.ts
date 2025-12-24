import { useQuery } from '@tanstack/react-query'
import { fetchCaseCategories } from '../api/fetch-case-categories'

/**
 * CC-02-A 取得所有案例分類
 */
export const useFetchCaseCategories = () => {
  return useQuery({
    queryKey: ['case-categories'],
    queryFn: fetchCaseCategories
  })
}
