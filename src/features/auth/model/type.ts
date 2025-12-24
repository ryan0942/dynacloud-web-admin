/**
 * 登入 payload
 */
export type LoginPayload = {
  account: string
  password: string
}
/**
 * 管理員資訊
 */
export type AdminInfo = {
  id: string
  name: string
  avatar: string
  account: string
}
/**
 * 更新管理員資訊 payload
 */
export type UpdateAdminInfoPayload = {
  name: string
  account: string
  avatar: string
}
/**
 * 更新管理員密碼 Payload
 */
export type UpdateAdminPasswordPayload = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}
