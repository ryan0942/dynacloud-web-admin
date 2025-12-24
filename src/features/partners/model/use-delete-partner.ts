import { useMutation } from '@tanstack/react-query'
import { deletePartner } from '../api/delete-partner'

/**
 * CU-05 刪除合作夥伴
 */
export const useDeletePartner = () => {
  return useMutation({
    mutationFn: deletePartner
  })
}
