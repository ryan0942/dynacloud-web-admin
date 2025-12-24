import { useMutation } from '@tanstack/react-query'
import { createServiceCategory } from '../api/create-service-category'

/**
 * SC-01 建立產品服務分類
 */
export const useCreateServiceCategory = () => {
  return useMutation({
    mutationFn: createServiceCategory
  })
}
