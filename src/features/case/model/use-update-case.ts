import { useMutation } from '@tanstack/react-query'
import { updateCase } from '../api/update-case'

/**
 * CA-04 更新案例
 */
export const useUpdateCase = () => {
  return useMutation({
    mutationFn: updateCase
  })
}
