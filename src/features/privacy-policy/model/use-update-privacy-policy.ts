import { useMutation } from '@tanstack/react-query'
import { updatePrivacyPolicy } from '../api/update-privacy-policy'

/**
 * PP-02 更新隱私政策資訊
 */
export const useUpdatePrivacyPolicy = () => {
  return useMutation({
    mutationFn: updatePrivacyPolicy
  })
}
