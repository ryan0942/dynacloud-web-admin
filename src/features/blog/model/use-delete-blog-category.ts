import { useMutation } from '@tanstack/react-query'
import { deleteBlogCategory } from '../api/delete-blog-category'

/**
 * BC-05 刪除部落格類別
 */
export const useDeleteBlogCategory = () => {
  return useMutation({
    mutationFn: deleteBlogCategory
  })
}
