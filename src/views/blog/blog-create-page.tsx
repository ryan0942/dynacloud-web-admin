'use client'

import { useToast } from '@/context/ToastContext'
import {
  BlogStatus,
  type CreateUpdateBlogPayload
} from '@/features/blog/model/type'
import { useCreateBlog } from '@/features/blog/model/use-create-blog'
import { useFetchBlogCategories } from '@/features/blog/model/use-fetch-blog-categories'
import { useUploadFile } from '@/shared/hooks/use-upload'
import CKEditorField from '@/shared/ui/CKEditor'
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Input,
  Select,
  SelectItem,
  Tab,
  Tabs,
  Textarea
} from '@heroui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { MdUpload } from 'react-icons/md'

export default function BlogCreatePage() {
  const { success, error } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { mutate: createBlog, isPending } = useCreateBlog()
  const { mutateAsync: uploadFile } = useUploadFile()
  const { data: categoriesData } = useFetchBlogCategories()

  const coverInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<CreateUpdateBlogPayload>({
    showInZh: true,
    showInEn: false,
    cover: '',
    zh_title: '',
    en_title: '',
    zh_description: '',
    en_description: '',
    zh_content: '',
    en_content: '',
    zh_tags: '',
    en_tags: '',
    categoryId: '',
    status: BlogStatus.Draft
  })

  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  // 儲存 CKEditor 圖片的 blob URL 和對應的 File
  const [editorImages, setEditorImages] = useState<Map<string, File>>(new Map())

  // 當前選中的語言 Tab
  const [selectedTab, setSelectedTab] = useState<string>('zh')

  const categories = categoriesData?.result || []

  const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml'
  ]
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  const handleFileChange = (file: File | null) => {
    if (!file) return

    // 驗證檔案類型
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      alert('只支援 JPG, JPEG, PNG, WEBP, SVG 格式的圖片')
      return
    }

    // 驗證檔案大小
    if (file.size > MAX_FILE_SIZE) {
      alert('圖片檔案不能超過 5MB')
      return
    }

    // 建立 blob URL 預覽
    const blobUrl = URL.createObjectURL(file)

    // 清除舊的 blob URL
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview)
    }
    setCoverFile(file)
    setCoverPreview(blobUrl)
  }

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

    try {
      // 1. 上傳 cover 圖片
      let coverUrl = formData.cover

      if (coverFile) {
        const coverResult = await uploadFile(coverFile)
        if (coverResult.result?.url) {
          coverUrl = coverResult.result.url
        }
      }

      // 2. 提取中英文內容中的所有圖片 URL
      const zhImageUrls = extractImageUrls(formData.zh_content)
      const enImageUrls = extractImageUrls(formData.en_content)
      const allImageUrls = [...new Set([...zhImageUrls, ...enImageUrls])]

      // 3. 過濾出需要上傳的 blob URL
      const blobUrls = allImageUrls.filter((url) => url.startsWith('blob:'))

      // 4. 上傳所有 blob 圖片並建立 URL 映射表
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

      // 5. 替換內容中的 blob URL 為真實 URL
      let updatedZhContent = formData.zh_content
      let updatedEnContent = formData.en_content

      urlMap.forEach((realUrl, blobUrl) => {
        updatedZhContent = updatedZhContent.replaceAll(blobUrl, realUrl)
        updatedEnContent = updatedEnContent.replaceAll(blobUrl, realUrl)
      })

      // 6. 建立部落格
      createBlog(
        {
          ...formData,
          cover: coverUrl,
          zh_content: updatedZhContent,
          en_content: updatedEnContent
        },
        {
          onSuccess: (response) => {
            if (!response.success) {
              error(response.message || '建立失敗')
              return
            }
            queryClient.invalidateQueries({ queryKey: ['blog-list'] })
            // 清除 blob URLs
            if (coverPreview) URL.revokeObjectURL(coverPreview)
            // 清除編輯器圖片的 blob URLs
            editorImages.forEach((_, blobUrl) => {
              URL.revokeObjectURL(blobUrl)
            })
            success('建立成功')
            router.push('/blog/list')
          },
          onError: (errorMessage: Error) => {
            console.error('🚀 ~ handleSubmit ~ errorMessage:', errorMessage)
            error('建立失敗')
            setIsUploading(false)
          }
        }
      )
    } catch (error) {
      console.error('上傳失敗:', error)
      alert('上傳失敗，請重試')
      setIsUploading(false)
    }
  }

  const handleInputChange = (
    field: keyof CreateUpdateBlogPayload,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid = () => {
    // 至少要選擇一種語系
    if (!formData.showInZh && !formData.showInEn) return false

    // 共用欄位
    if (!formData.categoryId || !formData.status) return false

    // 如果選擇中文，中文相關欄位必填
    if (formData.showInZh) {
      if (
        !formData.zh_title ||
        !formData.zh_description ||
        !formData.zh_content
      ) {
        return false
      }
    }

    // 如果選擇英文，英文相關欄位必填
    if (formData.showInEn) {
      if (
        !formData.en_title ||
        !formData.en_description ||
        !formData.en_content
      ) {
        return false
      }
    }

    return true
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">新增部落格</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 共用欄位 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">基本資訊</h2>

          {/* 語系選擇 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              顯示語系 <span className="text-danger">*</span>
            </label>
            <div className="flex gap-6">
              <Checkbox
                isSelected={formData.showInZh}
                onValueChange={(checked) =>
                  setFormData((prev) => ({ ...prev, showInZh: checked }))
                }
              >
                中文
              </Checkbox>
              <Checkbox
                isSelected={formData.showInEn}
                onValueChange={(checked) =>
                  setFormData((prev) => ({ ...prev, showInEn: checked }))
                }
              >
                英文
              </Checkbox>
            </div>
            {!formData.showInZh && !formData.showInEn && (
              <p className="text-xs text-danger mt-1">請至少選擇一種語系</p>
            )}
          </div>

          {/* Cover 上傳 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              封面圖 (Cover)
            </label>
            <input
              ref={coverInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.svg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                handleFileChange(file)
              }}
            />
            <div className="flex gap-4 items-start">
              <Button
                color="default"
                variant="bordered"
                startContent={<MdUpload />}
                onPress={() => coverInputRef.current?.click()}
              >
                選擇圖片
              </Button>
              {coverPreview && (
                <Card className="w-32 h-32">
                  <CardBody className="p-0">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </CardBody>
                </Card>
              )}
            </div>
            <p className="text-xs text-default-400 mt-1">
              支援格式：JPG, JPEG, PNG, WEBP, SVG (最大 5MB)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="分類"
              placeholder="請選擇分類"
              className="w-full"
              selectedKeys={
                new Set(formData.categoryId ? [formData.categoryId] : [])
              }
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string
                if (selectedKey) {
                  handleInputChange('categoryId', selectedKey)
                }
              }}
              disallowEmptySelection
              isRequired
            >
              {categories.map((category) => (
                <SelectItem
                  key={category.id}
                  textValue={`${category.zh_name} (${category.en_name})`}
                >
                  {category.zh_name} ({category.en_name})
                </SelectItem>
              ))}
            </Select>

            <Select
              label="狀態"
              placeholder="請選擇狀態"
              className="w-full"
              selectedKeys={[formData.status]}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as BlogStatus
                handleInputChange('status', selectedKey)
              }}
              isRequired
            >
              <SelectItem key={BlogStatus.Draft}>草稿</SelectItem>
              <SelectItem key={BlogStatus.Active}>啟用</SelectItem>
              <SelectItem key={BlogStatus.Closed}>關閉</SelectItem>
            </Select>
          </div>
        </div>

        {/* 中英文分頁 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">內容資訊</h2>

          <Tabs
            aria-label="語言選項"
            color="primary"
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
          >
            {/* 中文頁籤 */}
            <Tab key="zh" title="中文">
              <div className="space-y-4 pt-4">
                <Input
                  label="中文標題"
                  placeholder="請輸入中文標題"
                  value={formData.zh_title}
                  onValueChange={(value) =>
                    handleInputChange('zh_title', value)
                  }
                  isRequired={formData.showInZh}
                />

                <Textarea
                  label="中文描述"
                  placeholder="請輸入中文描述"
                  value={formData.zh_description}
                  onValueChange={(value) =>
                    handleInputChange('zh_description', value)
                  }
                  minRows={3}
                  isRequired={formData.showInZh}
                />

                <Input
                  label="中文標籤"
                  placeholder="請輸入中文標籤（用逗號分隔）"
                  value={formData.zh_tags}
                  onValueChange={(value) => handleInputChange('zh_tags', value)}
                />

                <div>
                  <CKEditorField
                    title="中文內容"
                    value={formData.zh_content}
                    onChange={(value) => handleInputChange('zh_content', value)}
                    placeholder="請開始撰寫中文內容..."
                    minHeight="500px"
                    onImageUpload={handleEditorImageUpload}
                  />
                  {formData.showInZh && (
                    <p className="text-xs text-danger mt-1">* 必填</p>
                  )}
                </div>
              </div>
            </Tab>

            {/* 英文頁籤 */}
            <Tab key="en" title="English">
              <div className="space-y-4 pt-4">
                <Input
                  label="英文標題 (English Title)"
                  placeholder="Please enter English title"
                  value={formData.en_title}
                  onValueChange={(value) =>
                    handleInputChange('en_title', value)
                  }
                  isRequired={formData.showInEn}
                />

                <Textarea
                  label="英文描述 (English Description)"
                  placeholder="Please enter English description"
                  value={formData.en_description}
                  onValueChange={(value) =>
                    handleInputChange('en_description', value)
                  }
                  minRows={3}
                  isRequired={formData.showInEn}
                />

                <Input
                  label="英文標籤 (English Tags)"
                  placeholder="Please enter English tags (separated by comma)"
                  value={formData.en_tags}
                  onValueChange={(value) => handleInputChange('en_tags', value)}
                />

                <div>
                  <CKEditorField
                    title="英文內容 (English Content)"
                    value={formData.en_content}
                    onChange={(value) => handleInputChange('en_content', value)}
                    placeholder="Please start writing English content..."
                    minHeight="500px"
                    onImageUpload={handleEditorImageUpload}
                  />
                  {formData.showInEn && (
                    <p className="text-xs text-danger mt-1">* 必填</p>
                  )}
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>

        {/* 操作按鈕 */}
        <div className="flex justify-end gap-3 pt-4">
          <Button color="default" variant="light" onPress={() => router.back()}>
            取消
          </Button>
          <Button
            color="primary"
            type="submit"
            isLoading={isPending || isUploading}
            isDisabled={!isFormValid()}
          >
            建立
          </Button>
        </div>
      </form>
    </div>
  )
}
