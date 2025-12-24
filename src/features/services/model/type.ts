/**
 * 狀態
 */
export enum ServiceStatus {
  Active = 'Active',
  Draft = 'Draft',
  Closed = 'Closed'
}
/**
 * 產品服務類別
 */
export type ServiceCategory = {
  id: string
  zh_name: string
  en_name: string
  createdAt: string
  updatedAt: string
}
/**
 * 產品服務Item
 */
export type Service = {
  id: string
  showInZh: boolean
  showInEn: boolean
  icon: string
  logo: string
  cover: string
  zh_title: string
  en_title: string
  zh_description: string
  en_description: string
  categoryId: string
  category: ServiceCategory
  status: ServiceStatus
  createdAt: string
  updatedAt: string
}
/**
 * 取得產品服務列表Params
 */
export type FetchServicesParams = {
  language?: 'zh' | 'en'
  page: number
  limit: number
  status: ServiceStatus
  categoryId: string
  query: string
}
/**
 * 建立產品服務Payload
 */
export type CreateServicePayload = {
  icon: string
  logo: string
  cover: string
  showInZh: boolean
  showInEn: boolean
  zh_title: string
  en_title: string
  zh_description: string
  en_description: string
  zh_content: string
  en_content: string
  categoryId: string
  status: ServiceStatus
}
/**
 * 建立產品服務分類Payload
 */
export type CreateServiceCategoryPayload = {
  zh_name: string
  en_name: string
}
/**
 * 單一產品服務
 */
export type ServiceDetail = {
  id: string
  showInZh: boolean
  showInEn: boolean
  icon: string
  logo: string
  cover: string
  zh_title: string
  en_title: string
  zh_description: string
  en_description: string
  zh_content: string
  en_content: string
  categoryId: string
  category: ServiceCategory
  status: ServiceStatus
  createdAt: string
  updatedAt: string
}
/**
 * 更新產品服務Payload
 */
export type UpdateServicePayload = {
  icon: string
  logo: string
  cover: string
  showInZh: boolean
  showInEn: boolean
  zh_title: string
  en_title: string
  zh_description: string
  en_description: string
  zh_content: string
  en_content: string
  categoryId: string
  status: ServiceStatus
}
