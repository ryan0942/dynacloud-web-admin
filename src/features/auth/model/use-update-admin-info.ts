import { useMutation } from '@tanstack/react-query'
import { updateAdminInfo } from '../api/update-admin-info'

/**
 * AD-02 更新管理員資訊
 */
export const useUpdateAdminInfo = () => {
  return useMutation({
    mutationFn: updateAdminInfo
  })
}
