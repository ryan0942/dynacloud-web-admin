import { type LoginPayload } from '@/features/auth/model/type'
import { post } from '../lib/http'
import { type ApiResponse } from '../model/types'

/**
 * [AC-01]登入
 */
export const login = async (payload: LoginPayload) => {
  return post<LoginPayload, ApiResponse<{ access_token: string }>>(
    '/auth/login',
    payload
  )
}
