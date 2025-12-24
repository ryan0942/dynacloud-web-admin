import { useQuery } from '@tanstack/react-query'
import { fetchAbout } from '../api/fetch-about'

/**
 * AB-01 取得關於我們資訊
 */
export const useFetchAbout = () => {
  return useQuery({
    queryKey: ['about'],
    queryFn: fetchAbout
  })
}
