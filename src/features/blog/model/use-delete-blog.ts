import { useMutation } from '@tanstack/react-query'
import { deleteBlog } from '../api/delete-blog'

/**
 * BL-05 刪除部落格
 */
export const useDeleteBlog = () => {
  return useMutation({
    mutationFn: deleteBlog
  })
}
