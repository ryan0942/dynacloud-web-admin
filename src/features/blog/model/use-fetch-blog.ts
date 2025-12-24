import { useQuery } from '@tanstack/react-query'
import { fetchBlog } from '../api/fetch-blog'

/**
 * BL-03 取得單一部落格
 */
export const useFetchBlog = (id: string) => {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: () => fetchBlog(id)
  })
}
