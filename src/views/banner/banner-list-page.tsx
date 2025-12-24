'use client'

import { useToast } from '@/context/ToastContext'
import { type Banner } from '@/features/banner/model/type'
import { useDeleteBanner } from '@/features/banner/model/use-delete-banner'
import { useFetchBanners } from '@/features/banner/model/use-fetch-banners'
import { useSortBanners } from '@/features/banner/model/use-sort-banners'
import {
  BannerCard,
  CreateBannerModal,
  DeleteBannerModal,
  EditBannerModal,
  SortableBannerCard
} from '@/features/banner/ui'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable'
import {
  Button,
  Card,
  CardBody,
  Select,
  SelectItem,
  useDisclosure
} from '@heroui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

type LanguageFilter = 'all' | 'zh' | 'en'

export default function BannerListPage() {
  // 語系篩選
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>('all')

  const { data, isLoading, isError, error } = useFetchBanners()
  const { mutate: deleteBanner, isPending: isDeleting } = useDeleteBanner()
  const { mutate: sortBanners, isPending: isSorting } = useSortBanners()
  const queryClient = useQueryClient()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose
  } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose
  } = useDisclosure()

  // 要編輯的 Banner
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  // 要刪除的 Banner ID
  const [deletingBannerId, setDeletingBannerId] = useState<string | null>(null)
  // 排序模式
  const [isSortMode, setIsSortMode] = useState(false)
  // 本地排序後的 banners (只在排序模式中使用者拖拉後才有值)
  const [localSortedBanners, setLocalSortedBanners] = useState<Banner[] | null>(
    null
  )

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  // 根據語系篩選 banners
  const filteredBanners = useMemo(() => {
    const allBanners = data?.result || []
    if (languageFilter === 'all') return allBanners
    if (languageFilter === 'zh') return allBanners.filter((b) => b.showInZh)
    if (languageFilter === 'en') return allBanners.filter((b) => b.showInEn)
    return allBanners
  }, [data?.result, languageFilter])

  // 計算要顯示的排序列表：如果使用者有拖拉過就用本地狀態，否則用篩選後的資料
  const sortedBanners = useMemo(() => {
    if (localSortedBanners !== null) {
      return localSortedBanners
    }
    return filteredBanners
  }, [localSortedBanners, filteredBanners])

  // 新增成功後刷新列表
  const handleCreateSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['banners'] })
  }

  // 更新成功後刷新列表
  const handleUpdateSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['banners'] })
  }

  // 打開編輯彈窗
  const handleEditClick = (bannerId: string) => {
    const banner = banners.find((b) => b.id === bannerId)
    if (banner) {
      setEditingBanner(banner)
      onEditOpen()
    }
  }

  // 關閉編輯彈窗
  const handleEditClose = () => {
    setEditingBanner(null)
    onEditClose()
  }

  // 打開刪除確認彈窗
  const handleDeleteClick = (bannerId: string) => {
    setDeletingBannerId(bannerId)
    onDeleteOpen()
  }

  // 確認刪除
  const handleConfirmDelete = () => {
    if (!deletingBannerId) return

    deleteBanner(
      { id: deletingBannerId },
      {
        onSuccess: (response) => {
          if (!response.success) {
            toast.error(response.message || '刪除輪播失敗')
            return
          }
          toast.success('刪除輪播成功')
          queryClient.invalidateQueries({ queryKey: ['banners'] })
          onDeleteClose()
          setDeletingBannerId(null)
        },
        onError: (error: Error) => {
          console.error(error)
          toast.error(`刪除輪播失敗：${error.message}`)
        }
      }
    )
  }

  // 關閉刪除彈窗
  const handleDeleteClose = () => {
    if (!isDeleting) {
      onDeleteClose()
      setDeletingBannerId(null)
    }
  }

  // 拖拉結束處理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const currentItems = localSortedBanners ?? filteredBanners
      const oldIndex = currentItems.findIndex((item) => item.id === active.id)
      const newIndex = currentItems.findIndex((item) => item.id === over.id)
      setLocalSortedBanners(arrayMove(currentItems, oldIndex, newIndex))
    }
  }

  // 更新排序
  const handleUpdateSort = () => {
    const allBanners = data?.result || []

    // 如果是「全部」篩選，直接按順序重新編號
    if (languageFilter === 'all') {
      const orders = sortedBanners.map((banner, index) => ({
        id: banner.id,
        sortOrder: index + 1
      }))

      sortBanners(
        { orders },
        {
          onSuccess: (response) => {
            if (!response.success) {
              toast.error(response.message || '更新排序失敗')
              return
            }
            toast.success('更新排序成功')
            queryClient.invalidateQueries({ queryKey: ['banners'] })
            setLocalSortedBanners(null)
            setIsSortMode(false)
          },
          onError: (error: Error) => {
            console.error(error)
            toast.error(`更新排序失敗：${error.message}`)
          }
        }
      )
      return
    }

    // 篩選特定語系時，需要計算相對順序
    // 策略：將拖拉後的順序映射到原本的 sortOrder 位置
    const filteredIds = new Set(sortedBanners.map((b) => b.id))

    // 取得篩選中 banner 原本佔用的 sortOrder 位置（排序後）
    const originalSortOrders = allBanners
      .filter((b) => filteredIds.has(b.id))
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((b) => b.sortOrder)

    // 將新順序的 banner 分配到原本的 sortOrder 位置
    const orders = sortedBanners.map((banner, index) => ({
      id: banner.id,
      sortOrder: originalSortOrders[index]
    }))

    sortBanners(
      { orders },
      {
        onSuccess: (response) => {
          if (!response.success) {
            toast.error(response.message || '更新排序失敗')
            return
          }
          toast.success('更新排序成功')
          queryClient.invalidateQueries({ queryKey: ['banners'] })
          setLocalSortedBanners(null)
          setIsSortMode(false)
        },
        onError: (error: Error) => {
          console.error(error)
          toast.error(`更新排序失敗：${error.message}`)
        }
      }
    )
  }

  // 取消排序模式
  const handleCancelSort = () => {
    setLocalSortedBanners(null)
    setIsSortMode(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-b-primary mx-auto mb-4"></div>
          <p className="text-default-500">載入中...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardBody>
            <p className="text-danger text-center">
              載入失敗：{error?.message || '未知錯誤'}
            </p>
          </CardBody>
        </Card>
      </div>
    )
  }

  const banners = filteredBanners

  return (
    <>
      <div className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            輪播列表
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            {/* 語系篩選 */}
            <Select
              label="語系篩選"
              labelPlacement="outside-left"
              selectedKeys={[languageFilter]}
              onChange={(e) => {
                setLanguageFilter(e.target.value as LanguageFilter)
                // 切換篩選時重置排序模式
                if (isSortMode) {
                  setLocalSortedBanners(null)
                  setIsSortMode(false)
                }
              }}
              className="w-50"
              size="sm"
              classNames={{
                label: 'text-sm whitespace-nowrap'
              }}
            >
              <SelectItem key="all">全部</SelectItem>
              <SelectItem key="zh">中文</SelectItem>
              <SelectItem key="en">英文</SelectItem>
            </Select>

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
                  isDisabled={banners.length < 2}
                >
                  排序模式
                </Button>
                <Button color="primary" onPress={onOpen}>
                  新增 Banner
                </Button>
              </>
            )}
          </div>
        </div>

        {banners.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-default-500">暫無輪播資料</p>
            </CardBody>
          </Card>
        ) : isSortMode ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedBanners.map((b) => b.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {sortedBanners.map((banner) => (
                  <SortableBannerCard key={banner.id} banner={banner} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {banners.map((banner) => (
              <BannerCard
                key={banner.id}
                banner={banner}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* 新增 Banner 彈窗 */}
      <CreateBannerModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={handleCreateSuccess}
      />

      {/* 編輯 Banner 彈窗 */}
      <EditBannerModal
        isOpen={isEditOpen}
        banner={editingBanner}
        onClose={handleEditClose}
        onSuccess={handleUpdateSuccess}
      />

      {/* 刪除確認彈窗 */}
      <DeleteBannerModal
        isOpen={isDeleteOpen}
        isDeleting={isDeleting}
        onClose={handleDeleteClose}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
