import { useMutation } from '@tanstack/react-query'
import { updateCaseCategory } from '../api/update-case-category'

/**
 * CC-04 更新案例分類
 */
export const useUpdateCaseCategory = () => {
  return useMutation({
    mutationFn: updateCaseCategory
  })
}
