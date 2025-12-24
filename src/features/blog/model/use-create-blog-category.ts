import { useMutation } from '@tanstack/react-query'
import { createBlogCategory } from '../api/create-blog-category'

/**
 * BC-01 建立部落格類別
 */
export const useCreateBlogCategory = () => {
  return useMutation({
    mutationFn: createBlogCategory
  })
}
