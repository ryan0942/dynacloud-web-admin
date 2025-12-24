import { useMutation } from '@tanstack/react-query'
import { createCaseCategory } from '../api/create-case-category'

/**
 * CC-01 建立案例分類
 */
export const useCreateCaseCategory = () => {
  return useMutation({
    mutationFn: createCaseCategory
  })
}
