import { put } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type UpdateAboutInfoPayload } from '../model/type'

/**
 * [AB-02] 管理員更新關於我們資訊
 */
export const updateAbout = async (payload: UpdateAboutInfoPayload) => {
  const ENDPOINT = '/about'
  return await put<UpdateAboutInfoPayload, ApiResponse<void>>(ENDPOINT, payload)
}
