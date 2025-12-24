import { useMutation } from '@tanstack/react-query'
import { deleteBanner } from '../api/delete-banner'

/**
 * [BA-05] 刪除 Banner
 */
export const useDeleteBanner = () => {
  return useMutation({
    mutationFn: deleteBanner
  })
}
