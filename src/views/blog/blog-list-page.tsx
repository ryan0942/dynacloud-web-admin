'use client'

import Link from 'next/link'

import { useToast } from '@/context/ToastContext'
import { BlogStatus, type Blog } from '@/features/blog/model/type'
import { useDeleteBlog } from '@/features/blog/model/use-delete-blog'
import { useFetchBlogList } from '@/features/blog/model/use-fetch-blog-list'
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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MdDelete, MdEdit } from 'react-icons/md'

const INITIAL_VISIBLE_COLUMNS = [
  'zh_title',
  'language',
  'category',
  'status',
  'createdAt',
  'actions'
]

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: '中文標題', uid: 'zh_title', sortable: true },
  { name: '英文標題', uid: 'en_title', sortable: true },
  { name: '語系', uid: 'language', sortable: false },
  { name: '分類', uid: 'category', sortable: true },
  { name: '狀態', uid: 'status', sortable: true },
  { name: '建立時間', uid: 'createdAt', sortable: true },
  { name: '更新時間', uid: 'updatedAt', sortable: true },
  { name: '操作', uid: 'actions' }
]

const statusColorMap: Record<BlogStatus, 'success' | 'warning' | 'danger'> = {
  [BlogStatus.Active]: 'success',
  [BlogStatus.Draft]: 'warning',
  [BlogStatus.Closed]: 'danger'
}

const statusTextMap: Record<BlogStatus, string> = {
  [BlogStatus.Active]: '啟用',
  [BlogStatus.Draft]: '草稿',
  [BlogStatus.Closed]: '關閉'
}

const statusOptions = [
  { label: '全部', value: '' },
  { label: '啟用', value: BlogStatus.Active },
  { label: '草稿', value: BlogStatus.Draft },
  { label: '關閉', value: BlogStatus.Closed }
]

const languageOptions = [
  { label: '全部語系', value: 'all' },
  { label: '中文', value: 'zh' },
  { label: '英文', value: 'en' }
]

type LanguageFilter = 'all' | 'zh' | 'en'

export default function BlogListPage() {
  const queryClient = useQueryClient()
  const { success, error: errorToast } = useToast()
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [inputValue, setInputValue] = useState('')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<BlogStatus | ''>('')
  const [categoryFilter] = useState('')
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>('all')
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const isComposing = useRef(false)

  // 刪除相關狀態
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null)
  const [deleteBlogTitle, setDeleteBlogTitle] = useState<string>('')

  const { data, isLoading, error } = useFetchBlogList({
    page,
    limit,
    status: statusFilter as BlogStatus,
    categoryId: categoryFilter,
    query
  })

  const { mutate: deleteBlog, isPending: isDeleting } = useDeleteBlog()

  const blogList = useMemo(() => {
    if (!data?.result.data) return []
    return Array.isArray(data.result.data) ? data.result.data : []
  }, [data])

  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const filteredItems = useMemo(() => {
    if (languageFilter === 'all') return blogList
    if (languageFilter === 'zh') return blogList.filter((b) => b.showInZh)
    if (languageFilter === 'en') return blogList.filter((b) => b.showInEn)
    return blogList
  }, [blogList, languageFilter])

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
  const handleOpenDeleteModal = useCallback((blog: Blog) => {
    setDeleteBlogId(blog.id)
    setDeleteBlogTitle(blog.zh_title)
    setIsDeleteModalOpen(true)
  }, [])

  // 關閉刪除確認彈窗
  const handleCloseDeleteModal = useCallback(() => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false)
      setDeleteBlogId(null)
      setDeleteBlogTitle('')
    }
  }, [isDeleting])

  // 確認刪除
  const handleConfirmDelete = useCallback(() => {
    if (!deleteBlogId) return

    deleteBlog(deleteBlogId, {
      onSuccess: (response) => {
        if (!response.success) {
          errorToast(response.message || '刪除失敗')
          return
        }
        success('刪除成功')
        // 刷新列表
        queryClient.invalidateQueries({ queryKey: ['blog-list'] })
        // 關閉彈窗
        setIsDeleteModalOpen(false)
        setDeleteBlogId(null)
        setDeleteBlogTitle('')
      },
      onError: (errorMessage: Error) => {
        console.error('🚀 ~ handleConfirmDelete ~ errorMessage:', errorMessage)
        errorToast('刪除失敗，請重試')
      }
    })
  }, [deleteBlogId, deleteBlog, queryClient, errorToast, success])

  const renderCell = useCallback(
    (blog: Blog, columnKey: React.Key) => {
      const cellValue = blog[columnKey as keyof Blog]

      switch (columnKey) {
        case 'zh_title':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm">{blog.zh_title}</p>
              <p className="text-bold text-tiny text-default-400">
                {blog.en_title}
              </p>
            </div>
          )
        case 'language':
          return (
            <div className="flex gap-1">
              {blog.showInZh && (
                <Chip size="sm" variant="flat" color="primary">
                  中文
                </Chip>
              )}
              {blog.showInEn && (
                <Chip size="sm" variant="flat" color="secondary">
                  英文
                </Chip>
              )}
            </div>
          )
        case 'category':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm">{blog.category?.zh_name}</p>
              <p className="text-bold text-tiny text-default-400">
                {blog.category?.en_name}
              </p>
            </div>
          )
        case 'status':
          return (
            <Chip color={statusColorMap[blog.status]} size="sm" variant="flat">
              {statusTextMap[blog.status]}
            </Chip>
          )
        case 'createdAt':
          return new Date(blog.createdAt).toLocaleDateString('zh-TW')
        case 'updatedAt':
          return new Date(blog.updatedAt).toLocaleDateString('zh-TW')
        case 'actions':
          return (
            <div className="relative flex items-center justify-center gap-2">
              <Tooltip content="編輯">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  as={Link}
                  href={`/blog/${blog.id}/edit`}
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
                  onPress={() => handleOpenDeleteModal(blog)}
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
        <h1 className="text-2xl font-bold">部落格列表</h1>
        <div className="w-full flex flex-col lg:flex-row lg:justify-start gap-5">
          <Input
            isClearable
            className="w-full lg:max-w-100"
            placeholder="搜尋部落格..."
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
              setStatusFilter(e.target.value as BlogStatus | '')
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
            href="/blog/create"
          >
            新增部落格
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
        aria-label="部落格列表"
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
          emptyContent="沒有找到部落格"
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
              確定要刪除部落格「
              <span className="font-bold">{deleteBlogTitle}</span>
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
