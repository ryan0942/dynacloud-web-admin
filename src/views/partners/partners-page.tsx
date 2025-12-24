'use client'

import { useToast } from '@/context/ToastContext'
import type {
  CreatePartnerPayload,
  Partner,
  UpdatePartnerPayload
} from '@/features/partners/model/type'
import { useCreatePartner } from '@/features/partners/model/use-create-partner'
import { useDeletePartner } from '@/features/partners/model/use-delete-partner'
import { useFetchPartners } from '@/features/partners/model/use-fetch-partners'
import { useUpdatePartner } from '@/features/partners/model/use-update-partner'
import { useSortPartners } from '@/features/partners/model/use-sort-partners'
import { SortablePartnerCard } from '@/features/partners/ui'
import { useUploadFile } from '@/shared/hooks/use-upload'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Tab,
  Tabs,
  useDisclosure
} from '@heroui/react'
import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useRef, useState, useMemo } from 'react'
import { MdAdd, MdDelete, MdEdit, MdUpload } from 'react-icons/md'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from '@dnd-kit/sortable'

const MAX_PARTNERS = 10
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml'
]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export default function PartnersPage() {
  const { success, error } = useToast()
  const queryClient = useQueryClient()
  const { data: partnersData, isLoading } = useFetchPartners()
  const { mutate: createPartner, isPending: isCreating } = useCreatePartner()
  const { mutate: updatePartner, isPending: isUpdating } = useUpdatePartner()
  const { mutate: deletePartner, isPending: isDeleting } = useDeletePartner()
  const { mutate: sortPartners, isPending: isSorting } = useSortPartners()
  const { mutateAsync: uploadFile } = useUploadFile()

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose
  } = useDisclosure()
  const logoInputRef = useRef<HTMLInputElement>(null)

  const [isUploading, setIsUploading] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [deletingPartner, setDeletingPartner] = useState<Partner | null>(null)
  const [formData, setFormData] = useState<CreatePartnerPayload>({
    zh_name: '',
    en_name: '',
    logo: '',
    url: null
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  // 排序模式
  const [isSortMode, setIsSortMode] = useState(false)
  // 本地排序後的 partners (只在排序模式中使用者拖拉後才有值)
  const [localSortedPartners, setLocalSortedPartners] = useState<
    Partner[] | null
  >(null)

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const partners = partnersData?.result || []

  // 計算要顯示的排序列表：如果使用者有拖拉過就用本地狀態，否則用 API 資料
  const sortedPartners = useMemo(() => {
    if (localSortedPartners !== null) {
      return localSortedPartners
    }
    return partnersData?.result || []
  }, [localSortedPartners, partnersData?.result])

  const handleAddNew = () => {
    if (partners.length >= MAX_PARTNERS) {
      error(`最多只能新增 ${MAX_PARTNERS} 個合作夥伴`)
      return
    }

    setEditingPartner(null)
    setFormData({
      zh_name: '',
      en_name: '',
      logo: '',
      url: null
    })
    setLogoFile(null)
    setLogoPreview('')
    onOpen()
  }

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner)
    setFormData({
      zh_name: partner.zh_name,
      en_name: partner.en_name,
      logo: partner.logo,
      url: partner.url
    })
    setLogoFile(null)
    setLogoPreview(partner.logo)
    onOpen()
  }

  const handleOpenDeleteModal = (partner: Partner) => {
    setDeletingPartner(partner)
    onDeleteModalOpen()
  }

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setDeletingPartner(null)
      onDeleteModalClose()
    }
  }

  const handleConfirmDelete = () => {
    if (!deletingPartner) return

    deletePartner(deletingPartner.id, {
      onSuccess: (response) => {
        if (!response.success) {
          error(response.message || '刪除失敗')
          return
        }
        queryClient.invalidateQueries({ queryKey: ['partners'] })
        success('刪除成功')
        handleCloseDeleteModal()
      },
      onError: () => {
        error('刪除失敗')
      }
    })
  }

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
    if (logoPreview && logoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview)
    }

    setLogoFile(file)
    setLogoPreview(blobUrl)
  }

  const handleSubmit = async () => {
    // 驗證必填欄位
    if (!formData.zh_name || !formData.en_name) {
      error('請填寫所有必填欄位')
      return
    }

    // 新增時必須選擇 logo
    if (!editingPartner && !logoFile) {
      error('請選擇 Logo 圖片')
      return
    }

    setIsUploading(true)

    try {
      // 上傳 logo 圖片（只上傳 blob URL 的圖片）
      let logoUrl = formData.logo

      if (logoFile && logoPreview.startsWith('blob:')) {
        const logoResult = await uploadFile(logoFile)
        if (logoResult.result?.url) {
          logoUrl = logoResult.result.url
        } else {
          throw new Error('圖片上傳失敗')
        }
      }

      const payload: CreatePartnerPayload | UpdatePartnerPayload = {
        zh_name: formData.zh_name,
        en_name: formData.en_name,
        logo: logoUrl,
        url: formData.url || null
      }

      if (editingPartner) {
        // 更新
        updatePartner(
          { id: editingPartner.id, ...payload },
          {
            onSuccess: (response) => {
              if (!response.success) {
                error(response.message || '更新失敗')
                return
              }
              queryClient.invalidateQueries({ queryKey: ['partners'] })
              success('更新成功')
              handleCloseModal()
            },
            onError: () => {
              error('更新失敗')
              setIsUploading(false)
            }
          }
        )
      } else {
        // 新增
        createPartner(payload, {
          onSuccess: (response) => {
            if (!response.success) {
              error(response.message || '新增失敗')
              return
            }
            queryClient.invalidateQueries({ queryKey: ['partners'] })
            success('新增成功')
            handleCloseModal()
          },
          onError: () => {
            error('新增失敗')
            setIsUploading(false)
          }
        })
      }
    } catch (err) {
      console.error('上傳失敗:', err)
      error('上傳失敗，請重試')
      setIsUploading(false)
    }
  }

  const handleCloseModal = () => {
    // 清除 blob URL
    if (logoPreview && logoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview)
    }
    setIsUploading(false)
    onClose()
  }

  const handleInputChange = (
    field: keyof CreatePartnerPayload,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // 拖拉結束處理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const currentItems = localSortedPartners ?? partnersData?.result ?? []
      const oldIndex = currentItems.findIndex((item) => item.id === active.id)
      const newIndex = currentItems.findIndex((item) => item.id === over.id)
      setLocalSortedPartners(arrayMove(currentItems, oldIndex, newIndex))
    }
  }

  // 更新排序
  const handleUpdateSort = () => {
    const orders = sortedPartners.map((partner, index) => ({
      id: partner.id,
      sortOrder: index + 1
    }))

    sortPartners(
      { orders },
      {
        onSuccess: (response) => {
          if (!response.success) {
            error(response.message || '更新排序失敗')
            return
          }
          success('更新排序成功')
          queryClient.invalidateQueries({ queryKey: ['partners'] })
          setLocalSortedPartners(null)
          setIsSortMode(false)
        },
        onError: (err: Error) => {
          console.error(err)
          error(`更新排序失敗：${err.message}`)
        }
      }
    )
  }

  // 取消排序模式
  const handleCancelSort = () => {
    setLocalSortedPartners(null)
    setIsSortMode(false)
  }

  // 載入中狀態
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">合作夥伴管理</h1>
          <p className="text-sm text-default-500 mt-1">
            目前 {partners.length} / {MAX_PARTNERS} 個合作夥伴
          </p>
        </div>
        <div className="flex gap-2">
          {isSortMode ? (
            <>
              <Button
                color="default"
                variant="flat"
                onPress={handleCancelSort}
                isDisabled={isSorting}
              >
                取消
              </Button>
              <Button
                color="primary"
                onPress={handleUpdateSort}
                isLoading={isSorting}
              >
                更新排序
              </Button>
            </>
          ) : (
            <>
              <Button
                color="secondary"
                variant="flat"
                onPress={() => setIsSortMode(true)}
                isDisabled={partners.length < 2}
              >
                排序模式
              </Button>
              <Button
                color="primary"
                startContent={<MdAdd />}
                onPress={handleAddNew}
                isDisabled={partners.length >= MAX_PARTNERS}
              >
                新增合作夥伴
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 合作夥伴列表 */}
      {partners.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-default-500">尚無合作夥伴</p>
        </div>
      ) : isSortMode ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedPartners.map((p) => p.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {sortedPartners.map((partner) => (
                <SortablePartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {partners.map((partner) => (
            <Card key={partner.id} className="group">
              <CardBody className="p-4">
                <div className="relative aspect-square w-full mb-3 bg-default-100 rounded-lg overflow-hidden">
                  <Image
                    src={partner.logo}
                    alt={partner.zh_name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <h3 className="font-semibold text-sm mb-1 truncate">
                  {partner.zh_name}
                </h3>
                <p className="text-xs text-default-500 truncate">
                  {partner.en_name}
                </p>
                {partner.url && (
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline truncate block mt-1"
                  >
                    {partner.url}
                  </a>
                )}
              </CardBody>
              <CardFooter className="gap-2 pt-0">
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  startContent={<MdEdit />}
                  onPress={() => handleEdit(partner)}
                  className="flex-1"
                >
                  編輯
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  startContent={<MdDelete />}
                  onPress={() => handleOpenDeleteModal(partner)}
                  className="flex-1"
                >
                  刪除
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* 新增/編輯 Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        scrollBehavior="inside"
        onClose={handleCloseModal}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {editingPartner ? '編輯合作夥伴' : '新增合作夥伴'}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  {/* Logo 上傳 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Logo <span className="text-danger">*</span>
                    </label>
                    <input
                      ref={logoInputRef}
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
                        onPress={() => logoInputRef.current?.click()}
                      >
                        選擇圖片
                      </Button>
                      {logoPreview && (
                        <Card className="w-32 h-32">
                          <CardBody className="p-0">
                            <div className="relative w-full h-full">
                              <Image
                                src={logoPreview}
                                alt="Logo preview"
                                fill
                                className="object-contain p-2"
                              />
                            </div>
                          </CardBody>
                        </Card>
                      )}
                    </div>
                    <p className="text-xs text-default-400 mt-1">
                      支援格式：JPG, JPEG, PNG, WEBP, SVG (最大 5MB)
                    </p>
                  </div>

                  {/* 中英文分頁 */}
                  <Tabs aria-label="語言選項" color="primary">
                    {/* 中文頁籤 */}
                    <Tab key="zh" title="中文">
                      <div className="space-y-4 pt-4">
                        <Input
                          label="中文名稱"
                          placeholder="請輸入中文名稱"
                          value={formData.zh_name}
                          onValueChange={(value) =>
                            handleInputChange('zh_name', value)
                          }
                          isRequired
                        />
                      </div>
                    </Tab>

                    {/* 英文頁籤 */}
                    <Tab key="en" title="English">
                      <div className="space-y-4 pt-4">
                        <Input
                          label="英文名稱 (English Name)"
                          placeholder="Please enter English name"
                          value={formData.en_name}
                          onValueChange={(value) =>
                            handleInputChange('en_name', value)
                          }
                          isRequired
                        />
                      </div>
                    </Tab>
                  </Tabs>

                  {/* 網址 */}
                  <Input
                    label="網址 (選填)"
                    placeholder="https://example.com"
                    type="url"
                    value={formData.url || ''}
                    onValueChange={(value) => handleInputChange('url', value)}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isLoading={isCreating || isUpdating || isUploading}
                  isDisabled={isCreating || isUpdating || isUploading}
                >
                  {editingPartner ? '更新' : '新增'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* 刪除確認 Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>確認刪除</ModalHeader>
              <ModalBody>
                {deletingPartner && (
                  <div className="space-y-2">
                    <p>確定要刪除以下合作夥伴嗎？</p>
                    <div className="p-3 bg-default-100 rounded-lg">
                      <p className="font-semibold">{deletingPartner.zh_name}</p>
                      <p className="text-sm text-default-500">
                        {deletingPartner.en_name}
                      </p>
                    </div>
                    <p className="text-sm text-danger">此操作無法復原</p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                  isDisabled={isDeleting}
                >
                  取消
                </Button>
                <Button
                  color="danger"
                  onPress={handleConfirmDelete}
                  isLoading={isDeleting}
                  isDisabled={isDeleting}
                >
                  確認刪除
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
