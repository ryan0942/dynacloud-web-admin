'use client'

import { useToast } from '@/context/ToastContext'
import type { Contact } from '@/features/contact/model/type'
import { useFetchContacts } from '@/features/contact/model/use-fetch-contacts'
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip
} from '@heroui/react'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MdVisibility } from 'react-icons/md'

const columns = [
  { name: '姓名', uid: 'name' },
  { name: '電子郵件', uid: 'email' },
  { name: '電話', uid: 'phone' },
  { name: '聯絡時間', uid: 'createdAt' },
  { name: '操作', uid: 'actions' }
]

export default function ContactPage() {
  const { error: errorToast } = useToast()
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [inputValue, setInputValue] = useState('')
  const [query, setQuery] = useState('')
  const isComposing = useRef(false)

  // 查看詳情相關狀態
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  const { data, isLoading, error } = useFetchContacts({
    page,
    limit,
    query
  })

  const contactList = useMemo(() => {
    if (!data?.result.data) return []
    return Array.isArray(data.result.data) ? data.result.data : []
  }, [data])

  const pagination = useMemo(() => {
    if (!data?.result.pagination) {
      return { page: 1, limit: 10, total: 0, has_next: false }
    }
    return data.result.pagination
  }, [data])

  // Debounce 搜尋 - 500ms 延遲
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isComposing.current) {
        setQuery(inputValue)
        setPage(1)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [inputValue])

  // 處理中文組字狀態
  const handleCompositionStart = useCallback(() => {
    isComposing.current = true
  }, [])

  const handleCompositionEnd = useCallback(
    (e: React.CompositionEvent<HTMLInputElement>) => {
      isComposing.current = false
      // 組字結束後立即觸發搜尋
      const value = e.currentTarget.value
      setInputValue(value)
      setQuery(value)
      setPage(1)
    },
    []
  )

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value)
  }, [])

  const handleClear = useCallback(() => {
    setInputValue('')
    setQuery('')
    setPage(1)
  }, [])

  // 開啟查看詳情彈窗
  const handleOpenViewModal = useCallback((contact: Contact) => {
    setSelectedContact(contact)
    setIsViewModalOpen(true)
  }, [])

  // 關閉查看詳情彈窗
  const handleCloseViewModal = useCallback(() => {
    setIsViewModalOpen(false)
    setSelectedContact(null)
  }, [])

  const renderCell = useCallback(
    (contact: Contact, columnKey: React.Key) => {
      const cellValue = contact[columnKey as keyof Contact]

      switch (columnKey) {
        case 'name':
          return <p className="text-bold text-sm">{contact.name}</p>
        case 'email':
          return <p className="text-sm">{contact.email}</p>
        case 'phone':
          return <p className="text-sm">{contact.phone}</p>
        case 'createdAt':
          return (
            <p className="text-sm">
              {dayjs(contact.createdAt).format('YYYY-MM-DD HH:mm')}
            </p>
          )
        case 'actions':
          return (
            <div className="relative flex items-center justify-center gap-2">
              <Tooltip content="查看">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => handleOpenViewModal(contact)}
                >
                  <MdVisibility className="text-lg" />
                </Button>
              </Tooltip>
            </div>
          )
        default:
          return cellValue as React.ReactNode
      }
    },
    [handleOpenViewModal]
  )

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="搜尋姓名、電子郵件或電話..."
            value={inputValue}
            onClear={handleClear}
            onValueChange={handleInputChange}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            共 {pagination.total} 筆聯絡表單
          </span>
        </div>
      </div>
    )
  }, [
    inputValue,
    handleClear,
    handleInputChange,
    handleCompositionStart,
    handleCompositionEnd,
    pagination.total
  ])

  const bottomContent = useMemo(() => {
    const total = data?.result.pagination?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / limit))
    return (
      <div className="flex w-full justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={totalPages}
          onChange={(page) => setPage(page)}
          disableAnimation
          disableCursorAnimation
        />
      </div>
    )
  }, [page, data?.result.pagination?.total, limit])

  if (error) {
    errorToast('載入聯絡表單失敗')
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">聯絡我們列表</h1>
      </div>

      <Table
        aria-label="聯絡表單列表"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        topContent={topContent}
        topContentPlacement="outside"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={contactList}
          isLoading={isLoading}
          loadingContent={<Spinner label="載入中..." />}
          emptyContent="無聯絡表單資料"
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* 查看詳情 Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>聯絡表單詳情</ModalHeader>
              <ModalBody>
                {selectedContact && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-default-600">
                        姓名
                      </label>
                      <p className="mt-1 text-sm">{selectedContact.name}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-default-600">
                        電子郵件
                      </label>
                      <p className="mt-1 text-sm">{selectedContact.email}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-default-600">
                        電話
                      </label>
                      <p className="mt-1 text-sm">{selectedContact.phone}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-default-600">
                        聯絡時間
                      </label>
                      <p className="mt-1 text-sm">
                        {dayjs(selectedContact.createdAt).format(
                          'YYYY-MM-DD HH:mm'
                        )}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-default-600">
                        訊息內容
                      </label>
                      <div className="mt-1 p-3 bg-default-100 rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">
                          {selectedContact.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  關閉
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
