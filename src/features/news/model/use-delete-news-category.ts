import { useMutation } from '@tanstack/react-query'
import { deleteNewsCategory } from '../api/delete-news-category'

/**
 * NC-05 刪除媒體活動類別
 */
export const useDeleteNewsCategory = () => {
  return useMutation({
    mutationFn: deleteNewsCategory
  })
}
