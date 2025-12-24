/**
 * 合作夥伴
 */
export type Partner = {
  id: string
  zh_name: string
  en_name: string
  logo: string
  url: string | null
  createdAt: string
  updatedAt: string
}
/**
 * 建立合作夥伴 Payload
 */
export type CreatePartnerPayload = {
  zh_name: string
  en_name: string
  logo: string
  url: string | null
}

/**
 * 更新合作夥伴 Payload
 */
export type UpdatePartnerPayload = {
  zh_name: string
  en_name: string
  logo: string
  url: string | null
}
/**
 * 更新合作夥伴排序 Payload
 */
export type UpdatePartnersOrderPayload = {
  orders: {
    id: string
    sortOrder: number
  }[]
}
