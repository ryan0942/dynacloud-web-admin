import { fetch } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type Banner } from '../model/type'

/**
 * [BA-02] 取得 Banner 列表
 */
export const fetchBanners = async (params?: { language?: 'zh' | 'en' }) => {
  const ENDPOINT = '/banners/admin'
  return await fetch<{ language?: 'zh' | 'en' }, ApiResponse<Banner[]>>(
    ENDPOINT,
    params?.language ? { language: params.language } : {}
  )
}
