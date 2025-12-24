import { useMutation } from '@tanstack/react-query'
import { updateNewsCategory } from '../api/update-news-category'

/**
 * NC-04 更新媒體活動類別
 */
export const useUpdateNewsCategory = () => {
  return useMutation({
    mutationFn: updateNewsCategory
  })
}
