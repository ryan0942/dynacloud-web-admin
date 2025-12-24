import { type AdminInfo } from '@/features/auth/model/type'
import { fetch } from '../lib/http'
import { type ApiResponse } from '../model/types'

/**
 * [AD-01]取得管理員資訊
 */
export const fetchAdminInfo = async () => {
  return fetch<AdminInfo, ApiResponse<AdminInfo>>('/admin/me')
}
