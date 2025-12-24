import { useMutation } from '@tanstack/react-query'
import { deleteCaseCategory } from '../api/delete-case-category'

/**
 * CC-05 刪除案例分類
 */
export const useDeleteCaseCategory = () => {
  return useMutation({
    mutationFn: deleteCaseCategory
  })
}
