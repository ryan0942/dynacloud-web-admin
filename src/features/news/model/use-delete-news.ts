import { useMutation } from '@tanstack/react-query'
import { deleteNews } from '../api/delete-news'

/**
 * NE-05 刪除媒體活動
 */
export const useDeleteNews = () => {
  return useMutation({
    mutationFn: deleteNews
  })
}
