/**
 * 管理員取得公司資訊 Response
 */
export type CompanyInfoResponse = {
  id: string
  zh_address: string
  en_address: string
  zh_phone: string
  en_phone: string
  zh_email: string
  en_email: string
  zh_opening_time: string
  en_opening_time: string
  createdAt: string
  updatedAt: string
}

/**
 * 更新公司資訊 Payload
 */
export type UpdateCompanyInfoPayload = {
  zh_address: string
  en_address: string
  zh_phone: string
  en_phone: string
  zh_email: string
  en_email: string
  zh_opening_time: string
  en_opening_time: string
}
