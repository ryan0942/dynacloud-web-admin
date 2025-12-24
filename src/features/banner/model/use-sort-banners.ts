import { useMutation } from '@tanstack/react-query'
import { sortBanners } from '../api/sort-banners'

/**
 * [BA-04] 更新 Banners 排序
 */
export const useSortBanners = () => {
  return useMutation({
    mutationFn: sortBanners
  })
}
