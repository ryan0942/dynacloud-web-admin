import { useMutation } from '@tanstack/react-query'
import { createBanner } from '../api/create-banner'

/**
 * [BA-01] 建立 Banner
 */
export const useCreateBanner = () => {
  return useMutation({
    mutationFn: createBanner
  })
}
