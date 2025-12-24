import { fetch } from '@/shared/lib/http'
import { type PaginationApiResponse } from '@/shared/model/types'
import { type FetchNewsParams, type News } from '../model/type'

/**
 * NE-02 取得媒體活動列表
 */
export const fetchNewsList = async (params: FetchNewsParams) => {
  const ENDPOINT = '/news/admin'
  return await fetch<FetchNewsParams, PaginationApiResponse<News[]>>(
    ENDPOINT,
    params
  )
}
