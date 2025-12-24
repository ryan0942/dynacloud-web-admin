import { useQuery } from '@tanstack/react-query'
import { fetchCompanyInfo } from '../api/fetch-company-info'

/**
 * CO-01 管理員取得公司資訊
 */
export const useFetchCompanyInfo = () => {
  return useQuery({
    queryKey: ['company-info'],
    queryFn: fetchCompanyInfo
  })
}
