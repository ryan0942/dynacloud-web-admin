export enum BannerType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}
/**
 * Banner 資料
 */
export type Banner = {
  id: string
  showInZh: boolean
  showInEn: boolean
  zh_image: string | null
  zh_url: string | null
  zh_link: string | null
  en_image: string | null
  en_url: string | null
  en_link: string | null
  duration: number
  sortOrder: number
  type: BannerType
  createdAt: string
  updatedAt: string
}
/**
 * 建立 Banner 資料 payload
 */
export type CreateBannerPayload = Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>
/**
 * 更新 Banner 資料 payload
 */
export type UpdateBannerPayload = Omit<Banner, 'createdAt' | 'updatedAt'>
/**
 * 更新 Banners 排序 Payload
 */
export type UpdateBannersOrderPayload = {
  orders: {
    id: string
    sortOrder: number
  }[]
}
