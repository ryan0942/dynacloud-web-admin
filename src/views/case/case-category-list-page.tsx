'use client'

import { useToast } from '@/context/ToastContext'
import type { CaseCategory } from '@/features/case/model/type'
import { useCreateCaseCategory } from '@/features/case/model/use-create-case-category'
import { useDeleteCaseCategory } from '@/features/case/model/use-delete-case-category'
import { useFetchCaseCategories } from '@/features/case/model/use-fetch-case-categories'
import { useUpdateCaseCategory } from '@/features/case/model/use-update-case-category'
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Tooltip,
  useDisclosure
} from '@heroui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { MdDelete, MdEdit } from 'react-icons/md'

export default function CaseCategoryListPage() {
  const { data, isLoading, error } = useFetchCaseCategories()
  const { success, error: errorToast } = useToast()
  const { mutate: createCategory, isPending: isCreating } =
    useCreateCaseCategory()
  const { mutate: updateCategory, isPending: isUpdating } =
    useUpdateCaseCategory()
  const { mutate: deleteCategory, isPending: isDeleting } =
    useDeleteCaseCategory()
  const queryClient = useQueryClient()

  // 表單 Modal
  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
    onOpenChange: onFormOpenChange
  } = useDisclosure()

  // 刪除確認 Modal
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
    onOpenChange: onDeleteOpenChange
  } = useDisclosure()

  const [editingCategory, setEditingCategory] = useState<CaseCategory | null>(
    null
  )
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null
  )
  const [formData, setFormData] = useState({
    zh_name: '',
    en_name: ''
  })

  const categories = useMemo(() => {
    if (!data?.result) return []
    return Array.isArray(data.result) ? data.result : []
  }, [data])

  const isEditMode = editingCategory !== null

  // 打開新增 Modal
  const handleOpenCreate = () => {
    setEditingCategory(null)
    setFormData({ zh_name: '', en_name: '' })
    onFormOpen()
  }

  // 打開編輯 Modal
  const handleOpenEdit = (category: CaseCategory) => {
    setEditingCategory(category)
    setFormData({
      zh_name: category.zh_name,
      en_name: category.en_name
    })
    onFormOpen()
  }

  // 打開刪除確認 Modal
  const handleOpenDelete = (categoryId: string) => {
    setDeletingCategoryId(categoryId)
    onDeleteOpen()
  }

  // 提交表單（新增或編輯）
  const handleSubmit = () => {
    if (isEditMode && editingCategory) {
      updateCategory(
        { id: editingCategory.id, ...formData },
        {
          onSuccess: (response: { success: boolean; message?: string }) => {
            if (!response.success) {
              errorToast(response.message || '更新失敗')
              return
            }
            success('更新成功')
            queryClient.invalidateQueries({ queryKey: ['case-categories'] })
            onFormClose()
            setEditingCategory(null)
            setFormData({ zh_name: '', en_name: '' })
          }
        }
      )
    } else {
      createCategory(formData, {
        onSuccess: (response: { success: boolean; message?: string }) => {
          if (!response.success) {
            errorToast(response.message || '新增失敗')
            return
          }
          success('新增成功')
          queryClient.invalidateQueries({ queryKey: ['case-categories'] })
          onFormClose()
          setFormData({ zh_name: '', en_name: '' })
        }
      })
    }
  }

  // 確認刪除
  const handleConfirmDelete = () => {
    if (deletingCategoryId) {
      deleteCategory(deletingCategoryId, {
        onSuccess: (response: { success: boolean; message?: string }) => {
          if (!response.success) {
            errorToast(response.message || '刪除失敗')
            return
          }
          success('刪除成功')
          queryClient.invalidateQueries({ queryKey: ['case-categories'] })
          onDeleteClose()
          setDeletingCategoryId(null)
        },
        onError: (errorMessage: Error) => {
          console.error(
            '🚀 ~ handleConfirmDelete ~ errorMessage:',
            errorMessage
          )
          errorToast('刪除失敗，請重試')
        }
      })
    }
  }

  // 關閉表單 Modal
  const handleFormModalClose = () => {
    setFormData({ zh_name: '', en_name: '' })
    setEditingCategory(null)
    onFormClose()
  }

  // 關閉刪除確認 Modal
  const handleDeleteModalClose = () => {
    setDeletingCategoryId(null)
    onDeleteClose()
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-danger">載入失敗: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">案例分類</h1>
        <Button color="primary" onPress={handleOpenCreate}>
          新增分類
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <Spinner label="載入中..." />
        </div>
      ) : categories.length === 0 ? (
        <div className="flex h-96 items-center justify-center">
          <p className="text-default-400">暫無分類資料</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category: CaseCategory) => (
            <Card key={category.id} className="w-full">
              <CardHeader className="flex flex-col items-start">
                <p className="text-md font-semibold">{category.zh_name}</p>
                <p className="text-small text-default-400">
                  {category.en_name}
                </p>
              </CardHeader>
              <CardFooter className="flex justify-end gap-2">
                <Tooltip content="編輯">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => handleOpenEdit(category)}
                  >
                    <MdEdit className="text-lg" />
                  </Button>
                </Tooltip>
                <Tooltip content="刪除" color="danger">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => handleOpenDelete(category.id)}
                  >
                    <MdDelete className="text-lg" />
                  </Button>
                </Tooltip>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* 新增/編輯 Modal */}
      <Modal
        isOpen={isFormOpen}
        onOpenChange={onFormOpenChange}
        onClose={handleFormModalClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {isEditMode ? '編輯分類' : '新增分類'}
              </ModalHeader>
              <ModalBody>
                <Input
                  label="中文名稱"
                  placeholder="請輸入中文名稱"
                  value={formData.zh_name}
                  onValueChange={(value) =>
                    setFormData({ ...formData, zh_name: value })
                  }
                  isRequired
                />
                <Input
                  label="英文名稱"
                  placeholder="請輸入英文名稱"
                  value={formData.en_name}
                  onValueChange={(value) =>
                    setFormData({ ...formData, en_name: value })
                  }
                  isRequired
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isLoading={isCreating || isUpdating}
                  isDisabled={!formData.zh_name || !formData.en_name}
                >
                  確定
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* 刪除確認 Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        onClose={handleDeleteModalClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                確認刪除
              </ModalHeader>
              <ModalBody>
                <p>確定要刪除此分類嗎？此操作無法復原。</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button
                  color="danger"
                  onPress={handleConfirmDelete}
                  isLoading={isDeleting}
                >
                  確定刪除
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
