import { useMutation } from '@tanstack/react-query'
import { createNewsCategory } from '../api/create-news-category'

/**
 * NC-01 建立媒體活動類別
 */
export const useCreateNewsCategory = () => {
  return useMutation({
    mutationFn: createNewsCategory
  })
}
