import { useMutation } from '@tanstack/react-query'
import { uploadFile } from '../api/upload'

/**
 * [UP-01] 上傳檔案
 */
export const useUploadFile = () => {
  return useMutation({
    mutationFn: uploadFile
  })
}
