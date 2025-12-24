import { useMutation } from '@tanstack/react-query'
import { updateBlog } from '../api/update-blog'

/**
 * BL-04 更新部落格
 */
export const useUpdateBlog = () => {
  return useMutation({
    mutationFn: updateBlog
  })
}
