import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchBlogList } from '../api/fetch-blog-list'
import { type FetchBlogParams } from './type'

/**
 * BL-02 取得部落格列表
 */
export const useFetchBlogList = (params: FetchBlogParams) => {
  return useQuery({
    queryKey: ['blog-list', params],
    queryFn: () => fetchBlogList(params),
    placeholderData: keepPreviousData
  })
}
