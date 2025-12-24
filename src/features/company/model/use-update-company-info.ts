import { useMutation } from '@tanstack/react-query'
import { updateCompanyInfo } from '../api/update-company-info'

/**
 * CO-02 更新公司資訊
 */
export const useUpdateCompanyInfo = () => {
  return useMutation({
    mutationFn: updateCompanyInfo
  })
}
