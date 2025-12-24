import { post } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type CreateUpdateNewsPayload } from '../model/type'

/**
 * NE-01 建立媒體活動
 */
export const createNews = async (payload: CreateUpdateNewsPayload) => {
  const ENDPOINT = '/news'
  return await post<CreateUpdateNewsPayload, ApiResponse<void>>(
    ENDPOINT,
    payload
  )
}
