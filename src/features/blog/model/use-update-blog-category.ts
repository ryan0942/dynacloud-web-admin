import { useMutation } from '@tanstack/react-query'
import { updateBlogCategory } from '../api/update-blog-category'

/**
 * BC-04 更新部落格類別
 */
export const useUpdateBlogCategory = () => {
  return useMutation({
    mutationFn: updateBlogCategory
  })
}
