import { useMutation } from '@tanstack/react-query'
import { deleteServiceCategory } from '../api/delete-service-category'

/**
 * SC-05 刪除產品服務分類
 */
export const useDeleteServiceCategory = () => {
  return useMutation({
    mutationFn: deleteServiceCategory
  })
}
