import { useMutation } from '@tanstack/react-query'
import { updatePartner } from '../api/update-partner'

/**
 * [CU-05] 更新合作夥伴
 */
export const useUpdatePartner = () => {
  return useMutation({
    mutationFn: updatePartner
  })
}
