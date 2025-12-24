import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchCaseList } from '../api/fetch-case-list'
import { type FetchCaseParams } from './type'

/**
 * CA-02 取得案例列表
 */
export const useFetchCaseList = (params: FetchCaseParams) => {
  return useQuery({
    queryKey: ['case-list', params],
    queryFn: () => fetchCaseList(params),
    placeholderData: keepPreviousData
  })
}
