'use client'

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@heroui/react'

interface DeleteBannerModalProps {
  isOpen: boolean
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteBannerModal({
  isOpen,
  isDeleting,
  onClose,
  onConfirm
}: DeleteBannerModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      isDismissable={!isDeleting}
      hideCloseButton={isDeleting}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">確認刪除</ModalHeader>
        <ModalBody>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                確定要刪除此 Banner 嗎？
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                此操作無法復原，刪除後將永久移除此 Banner
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose} isDisabled={isDeleting}>
            取消
          </Button>
          <Button color="danger" onPress={onConfirm} isLoading={isDeleting}>
            {isDeleting ? '刪除中...' : '確認刪除'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
