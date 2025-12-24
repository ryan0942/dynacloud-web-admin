/**
 * 建立更新媒體活動類別Payload
 */
export type CreateUpdateNewsCategoryPayload = {
  zh_name: string
  en_name: string
}
/**
 * 媒體活動類別
 */
export type NewsCategory = {
  id: string
  zh_name: string
  en_name: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}
/**
 * 媒體活動狀態
 */
export enum NewsStatus {
  Active = 'Active',
  Draft = 'Draft',
  Closed = 'Closed'
}
/**
 * 建立媒體活動Payload
 */
export type CreateUpdateNewsPayload = {
  showInZh: boolean
  showInEn: boolean
  zh_title: string
  en_title: string
  cover: string
  zh_description: string
  en_description: string
  categoryId: string
  zh_content: string
  en_content: string
  zh_tags: string
  en_tags: string
  startDateTime: string
  endDateTime: string
  status: NewsStatus
}
/**
 * 媒體活動列表Item
 */
export type News = {
  id: string
  showInZh: boolean
  showInEn: boolean
  zh_title: string
  en_title: string
  cover: string
  zh_description: string
  en_description: string
  categoryId: string
  category: NewsCategory
  zh_content: string
  en_content: string
  zh_tags: string
  en_tags: string
  startDateTime: string
  endDateTime: string
  status: NewsStatus
  createdAt: string
  updatedAt: string
}
/**
 * 取得媒體活動列表Params
 */
export type FetchNewsParams = {
  language?: 'zh' | 'en'
  page: number
  limit: number
  status: NewsStatus
  categoryId: string
  query: string
}
/**
 * 單一媒體活動
 */
export type NewsDetail = {
  id: string
  showInZh: boolean
  showInEn: boolean
  zh_title: string
  en_title: string
  cover: string
  zh_description: string
  en_description: string
  categoryId: string
  category: NewsCategory
  zh_content: string
  en_content: string
  zh_tags: string
  en_tags: string
  startDateTime: string
  endDateTime: string
  status: NewsStatus
  createdAt: string
  updatedAt: string
}
