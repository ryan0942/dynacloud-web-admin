import { useMutation } from '@tanstack/react-query'
import { updateServiceCategory } from '../api/update-service-category'

/**
 * SC-04 更新產品服務分類
 */
export const useUpdateServiceCategory = () => {
  return useMutation({
    mutationFn: updateServiceCategory
  })
}
