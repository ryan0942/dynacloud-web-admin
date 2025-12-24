'use client'
import Link from 'next/link'

import { useToast } from '@/context/ToastContext'
import { NewsStatus, type News } from '@/features/news/model/type'
import { useDeleteNews } from '@/features/news/model/use-delete-news'
import { useFetchNewsList } from '@/features/news/model/use-fetch-news-list'
import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip
} from '@heroui/react'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MdDelete, MdEdit } from 'react-icons/md'

const INITIAL_VISIBLE_COLUMNS = [
  'zh_title',
  'language',
  'category',
  'status',
  'startDateTime',
  'endDateTime',
  'actions'
]

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: '中文標題', uid: 'zh_title', sortable: true },
  { name: '英文標題', uid: 'en_title', sortable: true },
  { name: '語系', uid: 'language', sortable: false },
  { name: '分類', uid: 'category', sortable: true },
  { name: '狀態', uid: 'status', sortable: true },
  { name: '開始時間', uid: 'startDateTime', sortable: true },
  { name: '結束時間', uid: 'endDateTime', sortable: true },
  { name: '更新時間', uid: 'updatedAt', sortable: true },
  { name: '操作', uid: 'actions' }
]

const statusColorMap: Record<NewsStatus, 'success' | 'warning' | 'danger'> = {
  [NewsStatus.Active]: 'success',
  [NewsStatus.Draft]: 'warning',
  [NewsStatus.Closed]: 'danger'
}

const statusTextMap: Record<NewsStatus, string> = {
  [NewsStatus.Active]: '啟用',
  [NewsStatus.Draft]: '草稿',
  [NewsStatus.Closed]: '關閉'
}

const statusOptions = [
  { label: '全部', value: '' },
  { label: '啟用', value: NewsStatus.Active },
  { label: '草稿', value: NewsStatus.Draft },
  { label: '關閉', value: NewsStatus.Closed }
]

const languageOptions = [
  { label: '全部語系', value: 'all' },
  { label: '中文', value: 'zh' },
  { label: '英文', value: 'en' }
]

type LanguageFilter = 'all' | 'zh' | 'en'

export default function NewsListPage() {
  const queryClient = useQueryClient()
  const { success, error: errorToast } = useToast()
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [inputValue, setInputValue] = useState('')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<NewsStatus | ''>('')
  const [categoryFilter] = useState('')
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>('all')
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const isComposing = useRef(false)

  // 刪除相關狀態
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteNewsId, setDeleteNewsId] = useState<string | null>(null)
  const [deleteNewsTitle, setDeleteNewsTitle] = useState<string>('')

  const { data, isLoading, error } = useFetchNewsList({
    language: languageFilter === 'all' ? undefined : languageFilter,
    page,
    limit,
    status: statusFilter as NewsStatus,
    categoryId: categoryFilter,
    query
  })

  const { mutate: deleteNews, isPending: isDeleting } = useDeleteNews()

  const newsList = useMemo(() => {
    if (!data?.result.data) return []
    return Array.isArray(data.result.data) ? data.result.data : []
  }, [data])

  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  // 當選擇特定語系時，API 已篩選；選擇全部時直接顯示所有資料
  const filteredItems = useMemo(() => newsList, [newsList])

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

  // 開啟刪除確認彈窗
  const handleOpenDeleteModal = useCallback((news: News) => {
    setDeleteNewsId(news.id)
    setDeleteNewsTitle(news.zh_title)
    setIsDeleteModalOpen(true)
  }, [])

  // 關閉刪除確認彈窗
  const handleCloseDeleteModal = useCallback(() => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false)
      setDeleteNewsId(null)
      setDeleteNewsTitle('')
    }
  }, [isDeleting])

  // 確認刪除
  const handleConfirmDelete = useCallback(() => {
    if (!deleteNewsId) return

    deleteNews(deleteNewsId, {
      onSuccess: (response) => {
        if (!response.success) {
          errorToast(response.message || '刪除失敗')
          return
        }
        success('刪除成功')
        // 刷新列表
        queryClient.invalidateQueries({ queryKey: ['news-list'] })
        // 關閉彈窗
        setIsDeleteModalOpen(false)
        setDeleteNewsId(null)
        setDeleteNewsTitle('')
      },
      onError: (errorMessage: Error) => {
        console.error('🚀 ~ handleConfirmDelete ~ errorMessage:', errorMessage)
        errorToast('刪除失敗，請重試')
      }
    })
  }, [deleteNewsId, deleteNews, queryClient, errorToast, success])

  const renderCell = useCallback(
    (news: News, columnKey: React.Key) => {
      const cellValue = news[columnKey as keyof News]

      switch (columnKey) {
        case 'zh_title':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm">{news.zh_title}</p>
              <p className="text-bold text-tiny text-default-400">
                {news.en_title}
              </p>
            </div>
          )
        case 'language':
          return (
            <div className="flex gap-1">
              {news.showInZh && (
                <Chip size="sm" variant="flat" color="primary">
                  中文
                </Chip>
              )}
              {news.showInEn && (
                <Chip size="sm" variant="flat" color="secondary">
                  英文
                </Chip>
              )}
            </div>
          )
        case 'category':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm">{news.category?.zh_name}</p>
              <p className="text-bold text-tiny text-default-400">
                {news.category?.en_name}
              </p>
            </div>
          )
        case 'status':
          return (
            <Chip color={statusColorMap[news.status]} size="sm" variant="flat">
              {statusTextMap[news.status]}
            </Chip>
          )
        case 'startDateTime':
          return dayjs(news.startDateTime).format('YYYY-MM-DD HH:mm')
        case 'endDateTime':
          return dayjs(news.endDateTime).format('YYYY-MM-DD HH:mm')
        case 'updatedAt':
          return dayjs(news.updatedAt).format('YYYY-MM-DD HH:mm')
        case 'actions':
          return (
            <div className="relative flex items-center justify-center gap-2">
              <Tooltip content="編輯">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  as={Link}
                  href={`/news/${news.id}/edit`}
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
                  onPress={() => handleOpenDeleteModal(news)}
                >
                  <MdDelete className="text-lg" />
                </Button>
              </Tooltip>
            </div>
          )
        default:
          return cellValue as string
      }
    },
    [handleOpenDeleteModal]
  )

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">媒體活動列表</h1>
        <div className="w-full flex flex-col lg:flex-row lg:justify-start gap-5">
          <Input
            isClearable
            className="w-full lg:max-w-100"
            placeholder="搜尋媒體活動..."
            value={inputValue}
            onClear={handleClear}
            onValueChange={handleInputChange}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
          />
          <Select
            placeholder="狀態篩選"
            className="w-full lg:w-40"
            selectedKeys={statusFilter ? [statusFilter] : []}
            onChange={(e) => {
              setStatusFilter(e.target.value as NewsStatus | '')
              setPage(1)
            }}
          >
            {statusOptions.map((status) => (
              <SelectItem key={status.value}>{status.label}</SelectItem>
            ))}
          </Select>
          <Select
            placeholder="語系篩選"
            className="w-full lg:w-40"
            selectedKeys={[languageFilter]}
            onChange={(e) => {
              setLanguageFilter(e.target.value as LanguageFilter)
              setPage(1)
            }}
          >
            {languageOptions.map((lang) => (
              <SelectItem key={lang.value}>{lang.label}</SelectItem>
            ))}
          </Select>
          <Select
            placeholder="選擇欄位"
            className="w-full lg:w-40"
            selectionMode="multiple"
            selectedKeys={visibleColumns}
            onSelectionChange={(keys) => setVisibleColumns(keys as Set<string>)}
          >
            {columns.map((column) => (
              <SelectItem key={column.uid}>{column.name}</SelectItem>
            ))}
          </Select>
          <Button
            color="primary"
            className="w-full lg:w-fit ml-auto"
            as={Link}
            href="/news/create"
          >
            新增媒體活動
          </Button>
        </div>
      </div>
    )
  }, [
    inputValue,
    statusFilter,
    languageFilter,
    visibleColumns,
    handleInputChange,
    handleClear,
    handleCompositionStart,
    handleCompositionEnd
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
        />
      </div>
    )
  }, [page, data?.result.pagination?.total, limit])

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-danger">載入失敗: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Table
        aria-label="媒體活動列表"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: 'max-h-[600px]'
        }}
        topContent={topContent}
        topContentPlacement="outside"
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={filteredItems}
          isLoading={isLoading}
          loadingContent={<Spinner label="載入中..." />}
          emptyContent="沒有找到媒體活動"
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

      {/* 刪除確認彈窗 */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        isDismissable={!isDeleting}
        hideCloseButton={isDeleting}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">確認刪除</ModalHeader>
          <ModalBody>
            <p>
              確定要刪除媒體活動「
              <span className="font-bold">{deleteNewsTitle}</span>
              」嗎？
            </p>
            <p className="text-danger text-sm">此操作無法復原</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={handleCloseDeleteModal}
              isDisabled={isDeleting}
            >
              取消
            </Button>
            <Button
              color="danger"
              onPress={handleConfirmDelete}
              isLoading={isDeleting}
            >
              確認刪除
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
