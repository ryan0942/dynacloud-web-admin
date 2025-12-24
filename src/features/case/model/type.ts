/**
 * 建立更新案例分類Payload
 */
export type CreateUpdateCaseCategoryPayload = {
  zh_name: string
  en_name: string
}
/**
 * 案例分類
 */
export type CaseCategory = {
  id: string
  zh_name: string
  en_name: string
}
/**
 * 案例狀態
 */
export enum CaseStatus {
  Active = 'Active',
  Draft = 'Draft',
  Closed = 'Closed'
}
/**
 * 建立更新案例Payload
 */
export type CreateUpdateCasePayload = {
  showInZh: boolean
  showInEn: boolean
  zh_title: string
  en_title: string
  zh_description: string
  en_description: string
  cover: string
  company_logo: string
  zh_company_name: string
  en_company_name: string
  zh_company_description: string
  en_company_description: string
  zh_company_title: string
  en_company_title: string
  zh_tags: string
  en_tags: string
  zh_content: string
  en_content: string
  categoryId: string
  status: CaseStatus
}
/**
 * 取得案例列表Params
 */
export type FetchCaseParams = {
  language?: 'zh' | 'en'
  page: number
  limit: number
  status: CaseStatus
  categoryId: string
  query: string
}
/**
 * 案例列表Item
 */
export type Case = {
  id: string
  showInZh: boolean
  showInEn: boolean
  zh_title: string
  en_title: string
  zh_description: string
  en_description: string
  cover: string
  company_logo: string
  zh_company_name: string
  en_company_name: string
  zh_company_description: string
  en_company_description: string
  zh_company_title: string
  en_company_title: string
  zh_tags: string
  en_tags: string
  categoryId: string
  category: {
    id: string
    zh_name: string
    en_name: string
  }
  status: CaseStatus
  createdAt: string
  updatedAt: string
}
/**
 * 取得單一案例
 */
export type CaseDetail = {
  id: string
  showInZh: boolean
  showInEn: boolean
  zh_title: string
  en_title: string
  zh_description: string
  en_description: string
  cover: string
  company_logo: string
  zh_company_name: string
  en_company_name: string
  zh_company_description: string
  en_company_description: string
  zh_company_title: string
  en_company_title: string
  zh_tags: string
  en_tags: string
  zh_content: string
  en_content: string
  categoryId: string
  category: {
    id: string
    zh_name: string
    en_name: string
  }
  status: CaseStatus
  createdAt: string
  updatedAt: string
}
