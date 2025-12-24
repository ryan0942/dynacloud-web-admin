import { fetch } from '@/shared/lib/http'
import { type PaginationApiResponse } from '@/shared/model/types'
import { type Contact, type FetchContactParams } from '../model/type'

/**
 * [CT-02] 管理員取得聯絡表單
 */
export const fetchContacts = async (params: FetchContactParams) => {
  const ENDPOINT = '/contact'
  return await fetch<FetchContactParams, PaginationApiResponse<Contact[]>>(
    ENDPOINT,
    params
  )
}
