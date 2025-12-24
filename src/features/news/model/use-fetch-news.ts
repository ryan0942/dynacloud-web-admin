import { useQuery } from '@tanstack/react-query'
import { fetchNews } from '../api/fetch-news'

/**
 * NE-03 取得單一媒體活動
 */
export const useFetchNews = (id: string) => {
  return useQuery({
    queryKey: ['news', id],
    queryFn: () => fetchNews(id)
  })
}
