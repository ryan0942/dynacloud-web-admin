import { useMutation } from '@tanstack/react-query'
import { createCase } from '../api/create-case'

/**
 * CA-01 建立案例
 */
export const useCreateCase = () => {
  return useMutation({
    mutationFn: createCase
  })
}
