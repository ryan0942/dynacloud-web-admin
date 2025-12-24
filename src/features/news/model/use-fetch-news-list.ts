import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchNewsList } from '../api/fetch-news-list'
import { type FetchNewsParams } from './type'

/**
 * NE-02 取得媒體活動列表
 */
export const useFetchNewsList = (params: FetchNewsParams) => {
  return useQuery({
    queryKey: ['news-list', params],
    queryFn: () => fetchNewsList(params),
    placeholderData: keepPreviousData
  })
}
