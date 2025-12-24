import { useMutation } from '@tanstack/react-query'
import { updateBanner } from '../api/update-banner'

/**
 * [BA-05] 更新 Banner
 */
export const useUpdateBanner = () => {
  return useMutation({
    mutationFn: updateBanner
  })
}
