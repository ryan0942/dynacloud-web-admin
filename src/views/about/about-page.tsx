'use client'

import { useToast } from '@/context/ToastContext'
import type { UpdateAboutInfoPayload } from '@/features/about/model/type'
import { useFetchAbout } from '@/features/about/model/use-fetch-about'
import { useUpdateAbout } from '@/features/about/model/use-update-about'
import { useUploadFile } from '@/shared/hooks/use-upload'
import CKEditorField from '@/shared/ui/CKEditor'
import { Button, Spinner, Tab, Tabs } from '@heroui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

export default function AboutPage() {
  const { success, error } = useToast()
  const queryClient = useQueryClient()
  const { data: aboutData, isLoading } = useFetchAbout()
  const { mutate: updateAbout, isPending } = useUpdateAbout()
  const { mutateAsync: uploadFile } = useUploadFile()

  // 追蹤是否已經被使用者修改過
  const [isUserModified, setIsUserModified] = useState(false)

  // 從 API 資料計算初始值
  const zhContent = aboutData?.result?.zh_content
  const enContent = aboutData?.result?.en_content
  const initialFormData = useMemo<UpdateAboutInfoPayload>(() => {
    if (zhContent !== undefined && enContent !== undefined) {
      return {
        zh_content: zhContent,
        en_content: enContent
      }
    }
    return { zh_content: '', en_content: '' }
  }, [zhContent, enContent])

  const [formData, setFormData] = useState<UpdateAboutInfoPayload>({
    zh_content: '',
    en_content: ''
  })

  // 當 API 資料載入且使用者尚未修改時，使用 API 資料
  const displayFormData = isUserModified ? formData : initialFormData

  const [isUploading, setIsUploading] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // 儲存 CKEditor 圖片的 blob URL 和對應的 File
  const [editorImages, setEditorImages] = useState<Map<string, File>>(new Map())

  const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml'
  ]
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  // CKEditor 圖片上傳處理
  const handleEditorImageUpload = async (
    file: File
  ): Promise<{ default: string }> => {
    // 驗證檔案類型
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      throw new Error('只支援 JPG, JPEG, PNG, WEBP, SVG 格式的圖片')
    }

    // 驗證檔案大小
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('圖片檔案不能超過 5MB')
    }

    // 建立 blob URL
    const blobUrl = URL.createObjectURL(file)

    // 儲存 blob URL 和對應的 File
    setEditorImages((prev) => {
      const newMap = new Map(prev)
      newMap.set(blobUrl, file)
      return newMap
    })

    // 標記表單為 dirty
    setIsDirty(true)

    return { default: blobUrl }
  }

  // 從內容中提取所有圖片 URL
  const extractImageUrls = (content: string): string[] => {
    const urls: string[] = []
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const images = doc.querySelectorAll('img')

    images.forEach((img) => {
      const src = img.getAttribute('src')
      if (src) {
        urls.push(src)
      }
    })

    return urls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    // 使用目前顯示的資料
    const currentFormData = isUserModified ? formData : initialFormData

    try {
      // 1. 提取中英文內容中的所有圖片 URL
      const zhImageUrls = extractImageUrls(currentFormData.zh_content)
      const enImageUrls = extractImageUrls(currentFormData.en_content)
      const allImageUrls = [...new Set([...zhImageUrls, ...enImageUrls])]

      // 2. 過濾出需要上傳的 blob URL
      const blobUrls = allImageUrls.filter((url) => url.startsWith('blob:'))

      // 3. 上傳所有 blob 圖片並建立 URL 映射表
      const urlMap = new Map<string, string>()

      for (const blobUrl of blobUrls) {
        const file = editorImages.get(blobUrl)
        if (file) {
          const result = await uploadFile(file)
          if (result.result?.url) {
            urlMap.set(blobUrl, result.result.url)
          }
        }
      }

      // 4. 替換內容中的 blob URL 為真實 URL
      let updatedZhContent = currentFormData.zh_content
      let updatedEnContent = currentFormData.en_content

      urlMap.forEach((realUrl, blobUrl) => {
        updatedZhContent = updatedZhContent.replaceAll(blobUrl, realUrl)
        updatedEnContent = updatedEnContent.replaceAll(blobUrl, realUrl)
      })

      // 5. 更新關於我們
      updateAbout(
        {
          zh_content: updatedZhContent,
          en_content: updatedEnContent
        },
        {
          onSuccess: (response) => {
            if (!response.success) {
              error(response.message || '更新失敗')
              return
            }
            queryClient.invalidateQueries({ queryKey: ['about'] })

            // 清除編輯器圖片的 blob URLs
            editorImages.forEach((_, blobUrl) => {
              URL.revokeObjectURL(blobUrl)
            })
            setEditorImages(new Map())

            success('更新成功')
            setIsDirty(false)
            setIsUploading(false)
          },
          onError: (errorMessage: Error) => {
            console.error('🚀 ~ handleSubmit ~ errorMessage:', errorMessage)
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

  const handleContentChange = (
    field: keyof UpdateAboutInfoPayload,
    value: string
  ) => {
    // 標記使用者已修改
    if (!isUserModified) {
      setIsUserModified(true)
      // 首次修改時，複製 initialFormData 到 formData
      setFormData({ ...initialFormData, [field]: value })
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
    setIsDirty(true)
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
  if (!aboutData?.result) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-default-500">找不到關於我們資料</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">關於我們</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 中英文分頁 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">內容資訊</h2>

          <Tabs aria-label="語言選項" color="primary">
            {/* 中文頁籤 */}
            <Tab key="zh" title="中文">
              <div className="space-y-4 pt-4">
                <div>
                  <CKEditorField
                    title="中文內容"
                    value={displayFormData.zh_content}
                    onChange={(value) =>
                      handleContentChange('zh_content', value)
                    }
                    placeholder="請開始撰寫中文內容..."
                    minHeight="500px"
                    onImageUpload={handleEditorImageUpload}
                  />
                  <p className="text-xs text-danger mt-1">* 必填</p>
                </div>
              </div>
            </Tab>

            {/* 英文頁籤 */}
            <Tab key="en" title="English">
              <div className="space-y-4 pt-4">
                <div>
                  <CKEditorField
                    title="英文內容 (English Content)"
                    value={displayFormData.en_content}
                    onChange={(value) =>
                      handleContentChange('en_content', value)
                    }
                    placeholder="Please start writing English content..."
                    minHeight="500px"
                    onImageUpload={handleEditorImageUpload}
                  />
                  <p className="text-xs text-danger mt-1">* 必填</p>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>

        {/* 操作按鈕 */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            color="primary"
            type="submit"
            isLoading={isPending || isUploading}
            isDisabled={!isDirty || isPending || isUploading}
          >
            更新
          </Button>
        </div>
      </form>
    </div>
  )
}
