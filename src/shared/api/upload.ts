import { post } from '../lib/http'
import { ApiResponse } from '../model/types'

/**
 * [UP-01] 上傳檔案
 */
export const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const ENDPOINT = '/files/upload'
  return post<FormData, ApiResponse<{ url: string }>>(ENDPOINT, formData)
}
