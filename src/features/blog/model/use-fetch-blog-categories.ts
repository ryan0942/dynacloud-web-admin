import { useQuery } from '@tanstack/react-query'
import { fetchBlogCategories } from '../api/fetch-blog-categories'

/**
 * BC-02-A 取得所有部落格類別
 */
export const useFetchBlogCategories = () => {
  return useQuery({
    queryKey: ['blog-categories'],
    queryFn: fetchBlogCategories
  })
}
