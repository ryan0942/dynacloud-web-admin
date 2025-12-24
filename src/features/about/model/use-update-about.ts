import { useMutation } from '@tanstack/react-query'
import { updateAbout } from '../api/update-about'

/**
 * AB-02 更新關於我們資訊
 */
export const useUpdateAbout = () => {
  return useMutation({
    mutationFn: updateAbout
  })
}
