import { useMutation } from '@tanstack/react-query'
import { sortPartners } from '../api/sort-partners'

/**
 * [CU-04] 更新合作夥伴排序
 */
export const useSortPartners = () => {
  return useMutation({
    mutationFn: sortPartners
  })
}
