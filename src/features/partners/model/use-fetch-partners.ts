import { useQuery } from '@tanstack/react-query'
import { fetchPartners } from '../api/fetch-partners'

/**
 * CU-02 取得合作夥伴
 */
export const useFetchPartners = () => {
  return useQuery({
    queryKey: ['partners'],
    queryFn: fetchPartners
  })
}
