/**
 * 管理員取得關於我們資訊 Response
 */
export type AboutInfoResponse = {
  id: string
  zh_content: string
  en_content: string
  createdAt: string
  updatedAt: string
}

/**
 * 更新關於我們資訊 Payload
 */
export type UpdateAboutInfoPayload = {
  zh_content: string
  en_content: string
}
