import { useQuery } from '@tanstack/react-query'
import { fetchBanners } from '../api/fetch-banners'

/**
 * [BA-02] 取得 Banner 列表
 */
export const useFetchBanners = (params?: { language?: 'zh' | 'en' }) => {
  return useQuery({
    queryKey: ['banners', params?.language],
    queryFn: () => fetchBanners(params)
  })
}
