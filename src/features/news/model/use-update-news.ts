import { useMutation } from '@tanstack/react-query'
import { updateNews } from '../api/update-news'

/**
 * NE-04 更新媒體活動
 */
export const useUpdateNews = () => {
  return useMutation({
    mutationFn: updateNews
  })
}
