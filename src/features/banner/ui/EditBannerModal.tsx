'use client'

import { useToast } from '@/context/ToastContext'
import { useUploadFile } from '@/shared/hooks/use-upload'
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem
} from '@heroui/react'
import { useEffect, useState } from 'react'
import {
  type Banner,
  BannerType,
  type UpdateBannerPayload
} from '../model/type'
import { useUpdateBanner } from '../model/use-update-banner'

interface EditBannerModalProps {
  isOpen: boolean
  banner: Banner | null
  onClose: () => void
  onSuccess?: () => void
}

interface FormData {
  type: BannerType
  showInZh: boolean
  showInEn: boolean
  // 共用媒體檔案（圖片或影片只需上傳一個）
  file: File | null
  previewUrl: string
  // 各語系連結
  zhLink: string
  enLink: string
  // 共用
  duration: number
}

interface FormErrors {
  language: string
  file: string
  zhLink: string
  enLink: string
  duration: string
}

const initialFormData: FormData = {
  type: BannerType.IMAGE,
  showInZh: true,
  showInEn: false,
  file: null,
  previewUrl: '',
  zhLink: '',
  enLink: '',
  duration: 5
}

const initialErrors: FormErrors = {
  language: '',
  file: '',
  zhLink: '',
  enLink: '',
  duration: ''
}

export function EditBannerModal({
  isOpen,
  banner,
  onClose,
  onSuccess
}: EditBannerModalProps) {
  const { mutate: updateBanner, isPending: isUpdating } = useUpdateBanner()
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile()
  const toast = useToast()

  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>(initialErrors)

  // 當 banner 改變時，重置表單為 banner 的值
  useEffect(() => {
    if (banner && isOpen) {
      queueMicrotask(() => {
        // 取得媒體 URL（優先使用中文，沒有則用英文）
        const mediaUrl =
          banner.type === BannerType.VIDEO
            ? banner.zh_url || banner.en_url
            : banner.zh_image || banner.en_image

        setFormData({
          type: banner.type,
          showInZh: banner.showInZh,
          showInEn: banner.showInEn,
          file: null,
          previewUrl: mediaUrl || '',
          zhLink: banner.zh_link || '',
          enLink: banner.en_link || '',
          duration: banner.duration
        })
        setErrors(initialErrors)
      })
    }
  }, [banner, isOpen])

  // 清理 blob URL
  useEffect(() => {
    return () => {
      if (formData.previewUrl?.startsWith('blob:'))
        URL.revokeObjectURL(formData.previewUrl)
    }
  }, [formData.previewUrl])

  const resetForm = () => {
    if (formData.previewUrl?.startsWith('blob:'))
      URL.revokeObjectURL(formData.previewUrl)
    setFormData(initialFormData)
    setErrors(initialErrors)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  // 處理文件
  const processFile = (file: File) => {
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    if (formData.type === BannerType.IMAGE && !isImage) {
      setErrors({ ...errors, file: '請選擇圖片文件' })
      return
    }
    if (formData.type === BannerType.VIDEO && !isVideo) {
      setErrors({ ...errors, file: '請選擇影片文件' })
      return
    }

    const fileSizeInMB = file.size / 1024 / 1024
    const maxSize = formData.type === BannerType.IMAGE ? 5 : 20
    if (fileSizeInMB > maxSize) {
      setErrors({
        ...errors,
        file: `文件大小不能超過 ${maxSize}MB（當前：${fileSizeInMB.toFixed(2)}MB）`
      })
      return
    }

    // 清理舊的 blob URL
    if (formData.previewUrl?.startsWith('blob:'))
      URL.revokeObjectURL(formData.previewUrl)

    const blobUrl = URL.createObjectURL(file)
    setFormData({
      ...formData,
      file: file,
      previewUrl: blobUrl
    })
    setErrors({ ...errors, file: '' })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const validateForm = () => {
    if (!banner) return false
    const newErrors: FormErrors = { ...initialErrors }

    // 至少勾選一個語系
    if (!formData.showInZh && !formData.showInEn) {
      newErrors.language = '請至少選擇一個語系'
    }

    // 類型是否切換
    const typeChanged = formData.type !== banner.type

    // 如果類型切換了，必須上傳新文件
    // 如果原本沒有媒體，必須上傳
    const originalMedia =
      banner.type === BannerType.VIDEO
        ? banner.zh_url || banner.en_url
        : banner.zh_image || banner.en_image
    const needNewFile = typeChanged || !originalMedia

    if (needNewFile && !formData.file) {
      newErrors.file = `請上傳${formData.type === BannerType.IMAGE ? '圖片' : '影片'}`
    }

    // 播放時長
    if (formData.duration <= 0) {
      newErrors.duration = '播放時長必須大於 0'
    }

    setErrors(newErrors)
    return Object.values(newErrors).every((e) => !e)
  }

  const handleSubmit = async () => {
    if (!validateForm() || !banner) return

    try {
      let mediaUrl: string | null = null

      // 類型是否切換
      const typeChanged = formData.type !== banner.type

      // 處理媒體
      if (formData.file) {
        // 有新文件，上傳
        const response = await uploadFile(formData.file)
        mediaUrl = response.result.url
      } else if (!typeChanged) {
        // 沒有新文件，且類型沒變，使用原本的
        mediaUrl =
          banner.type === BannerType.VIDEO
            ? banner.zh_url || banner.en_url
            : banner.zh_image || banner.en_image
      }

      // 構建 payload - 同一個 URL 給中英文使用
      const payload: UpdateBannerPayload = {
        id: banner.id,
        type: formData.type,
        showInZh: formData.showInZh,
        showInEn: formData.showInEn,
        zh_image:
          formData.type === BannerType.IMAGE && formData.showInZh
            ? mediaUrl
            : null,
        zh_url:
          formData.type === BannerType.VIDEO && formData.showInZh
            ? mediaUrl
            : null,
        zh_link: formData.showInZh ? formData.zhLink || null : null,
        en_image:
          formData.type === BannerType.IMAGE && formData.showInEn
            ? mediaUrl
            : null,
        en_url:
          formData.type === BannerType.VIDEO && formData.showInEn
            ? mediaUrl
            : null,
        en_link: formData.showInEn ? formData.enLink || null : null,
        duration: formData.duration,
        sortOrder: banner.sortOrder
      }

      updateBanner(payload, {
        onSuccess: (response) => {
          if (!response.success) {
            toast.error(response.message || '更新輪播失敗')
            return
          }
          toast.success('更新輪播成功')
          onSuccess?.()
          handleClose()
        },
        onError: (error: Error) => {
          toast.error(`更新失敗：${error.message}`)
        }
      })
    } catch (error) {
      toast.error(`上傳失敗：${(error as Error).message}`)
    }
  }

  const renderFileUpload = () => {
    const file = formData.file
    const previewUrl = formData.previewUrl
    const error = errors.file
    const inputId = 'file-upload-edit'

    // 判斷是否需要必填
    const typeChanged = banner && formData.type !== banner.type
    const originalMedia = banner
      ? banner.type === BannerType.VIDEO
        ? banner.zh_url || banner.en_url
        : banner.zh_image || banner.en_image
      : null
    const isRequired = typeChanged || !originalMedia

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {formData.type === BannerType.IMAGE ? '圖片' : '影片'}
          {isRequired ? (
            <span className="text-danger ml-1">*</span>
          ) : (
            <span className="text-default-400 ml-1 text-xs">
              （選填，不上傳則保留原檔）
            </span>
          )}
        </label>

        {previewUrl ? (
          <div className="border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-900">
              {formData.type === BannerType.IMAGE ? (
                <img
                  src={previewUrl}
                  alt="預覽"
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  src={previewUrl}
                  controls
                  className="w-full h-full object-contain"
                >
                  您的瀏覽器不支援影片播放
                </video>
              )}
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-8 h-8 text-success-500 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    {file ? (
                      <>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[150px]">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        目前使用的文件
                      </p>
                    )}
                  </div>
                </div>
                <input
                  id={inputId}
                  type="file"
                  accept={
                    formData.type === BannerType.IMAGE ? 'image/*' : 'video/*'
                  }
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  onPress={() => document.getElementById(inputId)?.click()}
                >
                  更換
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => document.getElementById(inputId)?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
              error
                ? 'border-danger bg-danger-50 dark:bg-danger-500/10'
                : 'border-gray-300 dark:border-gray-700 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <input
              id={inputId}
              type="file"
              accept={
                formData.type === BannerType.IMAGE ? 'image/*' : 'video/*'
              }
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-1">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold text-primary">點擊上傳</span>{' '}
                或拖曳
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formData.type === BannerType.IMAGE
                  ? '圖片，最大 5MB'
                  : '影片，最大 20MB'}
              </p>
            </div>
          </div>
        )}

        {error && (
          <p className="text-danger text-xs mt-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }

  // 處理類型切換
  const handleTypeChange = (newType: BannerType) => {
    // 清理 blob URLs
    if (formData.previewUrl?.startsWith('blob:'))
      URL.revokeObjectURL(formData.previewUrl)

    setFormData({
      ...formData,
      type: newType,
      file: null,
      previewUrl: ''
    })
    setErrors({ ...errors, file: '' })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">編輯 Banner</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            {/* Banner 類型 */}
            <Select
              label="Banner 類型"
              placeholder="選擇 Banner 類型"
              selectedKeys={[formData.type]}
              onChange={(e) => handleTypeChange(e.target.value as BannerType)}
            >
              <SelectItem key={BannerType.IMAGE}>圖片</SelectItem>
              <SelectItem key={BannerType.VIDEO}>影片</SelectItem>
            </Select>

            {/* 檔案上傳 */}
            {renderFileUpload()}

            {/* 語系選擇 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                顯示語系
                <span className="text-danger ml-1">*</span>
                <span className="text-default-400 ml-2 text-xs">
                  （至少選擇一個）
                </span>
              </label>
              <div className="flex gap-4">
                <Checkbox
                  isSelected={formData.showInZh}
                  onValueChange={(checked) => {
                    setFormData({ ...formData, showInZh: checked })
                    setErrors({ ...errors, language: '' })
                  }}
                >
                  中文
                </Checkbox>
                <Checkbox
                  isSelected={formData.showInEn}
                  onValueChange={(checked) => {
                    setFormData({ ...formData, showInEn: checked })
                    setErrors({ ...errors, language: '' })
                  }}
                >
                  英文
                </Checkbox>
              </div>
              {errors.language && (
                <p className="text-danger text-xs mt-1">{errors.language}</p>
              )}
            </div>

            {/* 中文連結 */}
            {formData.showInZh && (
              <Input
                label="中文連結（選填）"
                placeholder="請輸入點擊後跳轉的連結"
                value={formData.zhLink}
                onChange={(e) =>
                  setFormData({ ...formData, zhLink: e.target.value })
                }
                isInvalid={!!errors.zhLink}
                errorMessage={errors.zhLink}
              />
            )}

            {/* 英文連結 */}
            {formData.showInEn && (
              <Input
                label="英文連結（選填）"
                placeholder="Enter the redirect link"
                value={formData.enLink}
                onChange={(e) =>
                  setFormData({ ...formData, enLink: e.target.value })
                }
                isInvalid={!!errors.enLink}
                errorMessage={errors.enLink}
              />
            )}

            {/* 播放時長 */}
            <Input
              type="number"
              label="播放時長（秒）"
              placeholder="請輸入播放時長"
              value={formData.duration.toString()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration: parseInt(e.target.value) || 0
                })
              }
              isInvalid={!!errors.duration}
              errorMessage={errors.duration}
              isRequired
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={handleClose}>
            取消
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isUploading || isUpdating}
          >
            {isUploading ? '上傳中...' : isUpdating ? '更新中...' : '儲存'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
