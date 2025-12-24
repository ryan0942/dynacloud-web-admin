/**
 * 隱私政策
 */
export type PrivacyPolicy = {
  id: string
  zh_content: string
  en_content: string
  createdAt: string
  updatedAt: string
}

/**
 * 更新隱私政策Payload
 */
export type UpdatePrivacyPolicyPayload = {
  zh_content: string
  en_content: string
}
