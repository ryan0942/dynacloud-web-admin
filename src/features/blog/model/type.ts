/**
 * 建立更新部落格類別Payload
 */
export type CreateUpdateBlogCategoryPayload = {
  zh_name: string
  en_name: string
}
/**
 * 部落格類別
 */
export type BlogCategory = {
  id: string
  zh_name: string
  en_name: string
}
/**
 * 部落格狀態
 */
export enum BlogStatus {
  Active = 'Active',
  Draft = 'Draft',
  Closed = 'Closed'
}
/**
 * 建立更新部落格Payload
 */
export type CreateUpdateBlogPayload = {
  showInZh: boolean
  showInEn: boolean
  zh_title: string
  en_title: string
  zh_description: string
  en_description: string
  cover: string
  categoryId: string
  zh_content: string
  en_content: string
  zh_tags: string
  en_tags: string
  status: BlogStatus
}
/**
 * 取得部落格列表Params
 */
export type FetchBlogParams = {
  language?: 'zh' | 'en'
  page: number
  limit: number
  status: BlogStatus
  categoryId: string
  query: string
}
/**
 * 部落格列表Item
 */
export type Blog = {
  id: string
  showInZh: boolean
  showInEn: boolean
  zh_title: string
  en_title: string
  zh_description: string
  en_description: string
  cover: string
  categoryId: string
  category: {
    id: string
    zh_name: string
    en_name: string
  }
  zh_content: string
  en_content: string
  zh_tags: string
  en_tags: string
  status: BlogStatus
  createdAt: string
  updatedAt: string
}
/**
 * 取得單一部落格
 */
export type BlogDetail = {
  id: string
  showInZh: boolean
  showInEn: boolean
  zh_title: string
  en_title: string
  zh_description: string
  en_description: string
  cover: string
  categoryId: string
  category: {
    id: string
    zh_name: string
    en_name: string
  }
  zh_content: string
  en_content: string
  zh_tags: string
  en_tags: string
  status: BlogStatus
  createdAt: string
  updatedAt: string
}
