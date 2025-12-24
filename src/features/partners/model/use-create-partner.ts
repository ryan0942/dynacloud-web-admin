import { useMutation } from '@tanstack/react-query'
import { createPartner } from '../api/create-partner'

/**
 * CU-01 建立合作夥伴
 */
export const useCreatePartner = () => {
  return useMutation({
    mutationFn: createPartner
  })
}
