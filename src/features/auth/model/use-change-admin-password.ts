import { useMutation } from '@tanstack/react-query'
import { changeAdminPassword } from '../api/change-admin-password'

/**
 * AD-03 更新管理員密碼
 */
export const useChangeAdminPassword = () => {
  return useMutation({
    mutationFn: changeAdminPassword
  })
}
