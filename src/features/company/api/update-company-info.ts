import { put } from '@/shared/lib/http'
import { type ApiResponse } from '@/shared/model/types'
import { type UpdateCompanyInfoPayload } from '../model/type'

/**
 * CO-02 更新公司資訊
 */
export const updateCompanyInfo = async (payload: UpdateCompanyInfoPayload) => {
  const ENDPOINT = '/company-info'
  return await put<UpdateCompanyInfoPayload, ApiResponse<void>>(
    ENDPOINT,
    payload
  )
}
