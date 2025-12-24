import { useMutation } from '@tanstack/react-query'
import { deleteService } from '../api/delete-service'

/**
 * SE-05 刪除產品服務
 */
export const useDeleteService = () => {
  return useMutation({
    mutationFn: deleteService
  })
}
