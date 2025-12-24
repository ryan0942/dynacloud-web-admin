import { fetchAdminInfo } from '@/shared/api/fetch-admin-info'
import { useQuery } from '@tanstack/react-query'

/**
 * AD-01 取得管理員資訊
 */
export const useAdminInfo = () => {
  return useQuery({
    queryKey: ['admin-info'],
    queryFn: fetchAdminInfo
  })
}
