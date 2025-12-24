import { useMutation } from '@tanstack/react-query'
import { updateService } from '../api/update-service'

/**
 * SE-04 更新產品服務
 */
export const useUpdateService = () => {
  return useMutation({
    mutationFn: updateService
  })
}
