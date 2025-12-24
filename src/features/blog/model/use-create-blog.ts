import { useMutation } from '@tanstack/react-query'
import { createBlog } from '../api/create-blog'

/**
 * BL-01 建立部落格
 */
export const useCreateBlog = () => {
  return useMutation({
    mutationFn: createBlog
  })
}
