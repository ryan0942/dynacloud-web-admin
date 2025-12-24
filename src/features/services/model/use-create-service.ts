import { useMutation } from '@tanstack/react-query'
import { createService } from '../api/create-service'

/**
 * SE-01 建立產品服務
 */
export const useCreateService = () => {
  return useMutation({
    mutationFn: createService
  })
}
