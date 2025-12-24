import { useMutation } from '@tanstack/react-query'
import { createNews } from '../api/create-news'

/**
 * NC-01 建立媒體活動
 */
export const useCreateNews = () => {
  return useMutation({
    mutationFn: createNews
  })
}
