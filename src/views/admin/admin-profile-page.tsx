'use client'

import { useToast } from '@/context/ToastContext'
import type {
  UpdateAdminInfoPayload,
  UpdateAdminPasswordPayload
} from '@/features/auth/model/type'
import { useChangeAdminPassword } from '@/features/auth/model/use-change-admin-password'
import { useUpdateAdminInfo } from '@/features/auth/model/use-update-admin-info'
import { useAdminInfo } from '@/shared/hooks/use-admin-info'
import { useUploadFile } from '@/shared/hooks/use-upload'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Spinner
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  MdPerson,
  MdUpload,
  MdVisibility,
  MdVisibilityOff
} from 'react-icons/md'
import { z } from 'zod'

// 管理員資訊驗證 schema
const adminInfoSchema = z.object({
  name: z.string().min(1, '請輸入姓名'),
  account: z.string().min(1, '請輸入帳號'),
  avatar: z.string()
})

// 密碼變更驗證 schema
const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, '請輸入舊密碼'),
    newPassword: z.string().min(6, '新密碼至少需要 6 個字元'),
    confirmPassword: z.string().min(1, '請確認新密碼')
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '新密碼與確認密碼不符',
    path: ['confirmPassword']
  })

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml'
]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export default function AdminProfilePage() {
  const { success, error } = useToast()
  const queryClient = useQueryClient()
  const { data: adminData, isLoading } = useAdminInfo()
  const { mutate: updateAdminInfo, isPending: isUpdatingInfo } =
    useUpdateAdminInfo()
  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangeAdminPassword()
  const { mutateAsync: uploadFile } = useUploadFile()

  const avatarInputRef = useRef<HTMLInputElement>(null)

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  // 密碼顯示狀態
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false)
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false)

  // 管理員資訊表單
  const {
    control: infoControl,
    handleSubmit: handleInfoSubmit,
    reset: resetInfo,
    setValue: setInfoValue,
    formState: { errors: infoErrors, isDirty: isInfoDirty }
  } = useForm<UpdateAdminInfoPayload>({
    resolver: zodResolver(adminInfoSchema),
    defaultValues: {
      name: '',
      account: '',
      avatar: ''
    }
  })

  // 密碼變更表單
  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isDirty: isPasswordDirty }
  } = useForm<UpdateAdminPasswordPayload>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  // 當管理員資料載入後，填充表單
  useEffect(() => {
    if (adminData?.result) {
      resetInfo({
        name: adminData.result.name,
        account: adminData.result.account,
        avatar: adminData.result.avatar
      })
      setAvatarPreview(adminData.result.avatar)
    }
  }, [adminData, resetInfo])

  const handleFileChange = (file: File | null) => {
    if (!file) return

    // 驗證檔案類型
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      error('只支援 JPG, JPEG, PNG, WEBP, SVG 格式的圖片')
      return
    }

    // 驗證檔案大小
    if (file.size > MAX_FILE_SIZE) {
      error('圖片檔案不能超過 5MB')
      return
    }

    // 建立 blob URL 預覽
    const blobUrl = URL.createObjectURL(file)

    // 清除舊的 blob URL
    if (avatarPreview && avatarPreview.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview)
    }

    setAvatarFile(file)
    setAvatarPreview(blobUrl)
    // 更新表單欄位，讓 isDirty 變為 true
    setInfoValue('avatar', blobUrl, { shouldDirty: true })
  }

  const onInfoSubmit = async (data: UpdateAdminInfoPayload) => {
    setIsUploading(true)

    try {
      // 上傳頭像圖片（只上傳 blob URL 的圖片）
      let avatarUrl = data.avatar

      if (avatarFile && avatarPreview.startsWith('blob:')) {
        const avatarResult = await uploadFile(avatarFile)
        if (avatarResult.result?.url) {
          avatarUrl = avatarResult.result.url
          queryClient.invalidateQueries()
        } else {
          throw new Error('圖片上傳失敗')
        }
      }

      updateAdminInfo(
        {
          name: data.name,
          account: data.account,
          avatar: avatarUrl
        },
        {
          onSuccess: (response) => {
            if (!response.success) {
              error(response.message || '更新失敗')
              return
            }
            queryClient.invalidateQueries()
            success('更新成功')
            // 清除 blob URL
            if (avatarPreview && avatarPreview.startsWith('blob:')) {
              URL.revokeObjectURL(avatarPreview)
            }
            setAvatarFile(null)
            setIsUploading(false)
            // 重置表單狀態
            resetInfo({
              name: data.name,
              account: data.account,
              avatar: avatarUrl
            })
          },
          onError: () => {
            error('更新失敗')
            setIsUploading(false)
          }
        }
      )
    } catch (err) {
      console.error('上傳失敗:', err)
      error('上傳失敗，請重試')
      setIsUploading(false)
    }
  }

  const onPasswordSubmit = (data: UpdateAdminPasswordPayload) => {
    changePassword(data, {
      onSuccess: (response) => {
        if (!response.success) {
          error(response.message || '密碼變更失敗')
          return
        }
        success('密碼變更成功')
        resetPassword()
      },
      onError: () => {
        error('密碼變更失敗')
      }
    })
  }

  // 載入中狀態
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  // 沒有資料
  if (!adminData?.result) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-default-500">找不到管理員資料</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
          個人資料設定
        </h1>
        <p className="text-default-500 mt-2">管理您的帳號資訊和安全設定</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 修改資訊卡片 */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex gap-3 bg-linear-to-r from-primary/10 to-primary/5 pb-4">
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold">基本資料</h2>
              <p className="text-xs text-default-500">更新您的個人資訊</p>
            </div>
          </CardHeader>
          <CardBody className="gap-6 py-6">
            <form
              onSubmit={handleInfoSubmit(onInfoSubmit)}
              className="space-y-6"
            >
              {/* 頭像上傳區域 */}
              <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-gradient-to-br from-default-50 to-default-100 border-2 border-dashed border-default-300">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.svg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    handleFileChange(file)
                  }}
                />
                <div className="relative group">
                  {avatarPreview ? (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden bg-default-100 ring-4 ring-primary/20 shadow-lg">
                      <Image
                        src={avatarPreview}
                        alt="Avatar preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <MdUpload className="text-3xl text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-default-200 flex items-center justify-center ring-4 ring-default-300 shadow-lg">
                      <MdPerson className="text-6xl text-default-400" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <Button
                    color="primary"
                    variant="flat"
                    startContent={<MdUpload />}
                    onPress={() => avatarInputRef.current?.click()}
                    size="lg"
                  >
                    {avatarPreview ? '更換頭像' : '上傳頭像'}
                  </Button>
                  <p className="text-xs text-default-400 mt-2">
                    JPG, PNG, WEBP, SVG (最大 5MB)
                  </p>
                </div>
                {infoErrors.avatar && (
                  <p className="text-xs text-danger">
                    {infoErrors.avatar.message}
                  </p>
                )}
              </div>

              {/* 姓名 */}
              <Controller
                name="name"
                control={infoControl}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="姓名"
                    placeholder="請輸入姓名"
                    isRequired
                    isInvalid={!!infoErrors.name}
                    errorMessage={infoErrors.name?.message}
                  />
                )}
              />

              {/* 帳號 */}
              <Controller
                name="account"
                control={infoControl}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="帳號"
                    placeholder="請輸入帳號"
                    isRequired
                    isInvalid={!!infoErrors.account}
                    errorMessage={infoErrors.account?.message}
                  />
                )}
              />

              {/* 提交按鈕 */}
              <div className="pt-4">
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isUpdatingInfo || isUploading}
                  isDisabled={!isInfoDirty || isUpdatingInfo || isUploading}
                  className="w-full"
                  size="lg"
                >
                  {isUpdatingInfo || isUploading ? '更新中...' : '儲存變更'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* 修改密碼卡片 */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex gap-3 bg-linear-to-r from-danger/10 to-danger/5 pb-4">
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold">變更密碼</h2>
              <p className="text-xs text-default-500">更新您的登入密碼</p>
            </div>
          </CardHeader>
          <CardBody className="gap-6 py-6">
            <form
              onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              className="space-y-6 flex flex-col h-full"
            >
              <div className="space-y-1 mb-2">
                <p className="text-sm text-default-600">
                  為了您的帳戶安全，請定期更換密碼
                </p>
                <ul className="text-xs text-default-500 list-disc list-inside space-y-1">
                  <li>密碼長度至少 6 個字元</li>
                  <li>建議使用英文字母、數字和符號組合</li>
                </ul>
              </div>
              {/* 舊密碼 */}
              <Controller
                name="oldPassword"
                control={passwordControl}
                render={({ field }) => (
                  <Input
                    {...field}
                    type={isOldPasswordVisible ? 'text' : 'password'}
                    label="舊密碼"
                    placeholder="請輸入舊密碼"
                    isRequired
                    isInvalid={!!passwordErrors.oldPassword}
                    errorMessage={passwordErrors.oldPassword?.message}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={() =>
                          setIsOldPasswordVisible(!isOldPasswordVisible)
                        }
                      >
                        {isOldPasswordVisible ? (
                          <MdVisibilityOff className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <MdVisibility className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                  />
                )}
              />

              {/* 新密碼 */}
              <Controller
                name="newPassword"
                control={passwordControl}
                render={({ field }) => (
                  <Input
                    {...field}
                    type={isNewPasswordVisible ? 'text' : 'password'}
                    label="新密碼"
                    placeholder="請輸入新密碼（至少 6 個字元）"
                    isRequired
                    isInvalid={!!passwordErrors.newPassword}
                    errorMessage={passwordErrors.newPassword?.message}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={() =>
                          setIsNewPasswordVisible(!isNewPasswordVisible)
                        }
                      >
                        {isNewPasswordVisible ? (
                          <MdVisibilityOff className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <MdVisibility className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                  />
                )}
              />

              {/* 確認新密碼 */}
              <Controller
                name="confirmPassword"
                control={passwordControl}
                render={({ field }) => (
                  <Input
                    {...field}
                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                    label="確認新密碼"
                    placeholder="請再次輸入新密碼"
                    isRequired
                    isInvalid={!!passwordErrors.confirmPassword}
                    errorMessage={passwordErrors.confirmPassword?.message}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={() =>
                          setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                        }
                      >
                        {isConfirmPasswordVisible ? (
                          <MdVisibilityOff className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <MdVisibility className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                  />
                )}
              />

              {/* 提交按鈕 */}
              <div className="pt-4 mt-auto">
                <Button
                  color="danger"
                  type="submit"
                  isLoading={isChangingPassword}
                  isDisabled={!isPasswordDirty || isChangingPassword}
                  className="w-full"
                  size="lg"
                >
                  {isChangingPassword ? '變更中...' : '變更密碼'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
