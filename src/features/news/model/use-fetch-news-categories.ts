import { useQuery } from '@tanstack/react-query'
import { fetchNewsCategories } from '../api/fetch-news-categories'

/**
 * NC-02-A 取得所有媒體活動類別
 */
export const useFetchNewsCategories = () => {
  return useQuery({
    queryKey: ['news-categories'],
    queryFn: fetchNewsCategories
  })
}
