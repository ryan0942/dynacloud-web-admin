import { useMutation } from '@tanstack/react-query'
import { deleteCase } from '../api/delete-case'

/**
 * CA-05 刪除案例
 */
export const useDeleteCase = () => {
  return useMutation({
    mutationFn: deleteCase
  })
}
