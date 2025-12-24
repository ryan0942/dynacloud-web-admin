import { put } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type CreateUpdateNewsPayload } from '../model/type'

/**
 * NE-04 更新媒體活動
 */
export const updateNews = async (
  payload: CreateUpdateNewsPayload & { id: string }
) => {
  const { id, ...rest } = payload
  const ENDPOINT = `/news/${id}`
  return await put<CreateUpdateNewsPayload, ApiResponse<void>>(ENDPOINT, rest)
}
