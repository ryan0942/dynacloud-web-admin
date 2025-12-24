import { useQuery } from '@tanstack/react-query'
import { fetchPrivacyPolicy } from '../api/fetch-privacy-policy'

/**
 * PP-01 取得隱私政策資訊
 */
export const useFetchPrivacyPolicy = () => {
  return useQuery({
    queryKey: ['privacy-policy'],
    queryFn: fetchPrivacyPolicy
  })
}
