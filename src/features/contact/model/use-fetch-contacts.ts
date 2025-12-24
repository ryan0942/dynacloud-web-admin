import { useQuery } from '@tanstack/react-query'
import { fetchContacts } from '../api/fetch-contacts'
import { type FetchContactParams } from './type'

/**
 * CT-02 管理員取得聯絡表單
 */
export const useFetchContacts = (params: FetchContactParams) => {
  return useQuery({
    queryKey: ['contacts', params],
    queryFn: () => fetchContacts(params)
  })
}
