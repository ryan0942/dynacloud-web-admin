'use client'

import dynamic from 'next/dynamic'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'

// ** 樣式
import './ck-article-style.css'

// 動態導入 CKEditor 組件，避免 SSR 問題
const CKEditorComponent = dynamic(() => import('./CKEditorWrapper'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[200px] border rounded-md p-4 bg-gray-50 flex items-center justify-center text-gray-500">
      載入編輯器中...
    </div>
  )
})

interface NewsEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  minHeight?: string
  disabled?: boolean
  newsId?: string // 新聞 ID，用於圖片上傳
  onImageUpload?: (file: File) => Promise<{
    default: string
    slot: number
  }>
  onImageDelete?: (slot: number) => Promise<void>
}

const NewsEditor: React.FC<NewsEditorProps> = ({
  value = '',
  onChange,
  placeholder = '請開始撰寫新聞內容…',
  minHeight = '400px',
  disabled = false,
  newsId,
  onImageUpload,
  onImageDelete
}) => {
  const editorContainerRef = useRef(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null)
  const [isLayoutReady, setIsLayoutReady] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editorConfig, setEditorConfig] = useState<any>(null)

  // 追蹤編輯器中的圖片 slots
  const previousSlotsRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    setIsLayoutReady(true)
    return () => setIsLayoutReady(false)
  }, [])

  useEffect(() => {
    if (!isLayoutReady) return

    // 動態載入支援圖片上傳的 CKEditor 配置
    const loadEditorConfig = async () => {
      const { getNewsEditorConfig } = await import('./ck-editor-news-config')
      const { createCustomUploadAdapterPlugin } = await import(
        './ck-upload-adapter'
      )

      // 創建 upload adapter plugin with callbacks
      const CustomUploadAdapterPlugin = createCustomUploadAdapterPlugin(() => ({
        onImageUpload: onImageUpload || undefined
      }))

      const config = getNewsEditorConfig(CustomUploadAdapterPlugin, placeholder)
      setEditorConfig(config)
    }

    loadEditorConfig()
  }, [isLayoutReady, placeholder, onImageUpload])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleReady = (editor: any) => {
    editorRef.current = editor

    // Update content when data prop changes
    if (value && value !== editor.getData()) {
      editor.setData(value)
    }

    // 設置自訂最小高度
    if (minHeight) {
      const editableElement = editor.ui.view.editable.element
      if (editableElement) {
        editableElement.style.minHeight = minHeight
      }
    }

    // 設置禁用狀態
    if (disabled) {
      editor.enableReadOnlyMode('disabled')
    }

    // 初始化時收集現有的 slots
    const initialSlots = getSlotsFromContent(value)
    previousSlotsRef.current = new Set(initialSlots)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (_event: any, editor: any) => {
    const content = editor.getData()
    if (onChange) {
      onChange(content)
    }

    // 檢測圖片刪除
    if (onImageDelete && newsId) {
      const currentSlots = getSlotsFromContent(content)
      const currentSlotsSet = new Set(currentSlots)

      // 找出被刪除的 slots
      const deletedSlots = Array.from(previousSlotsRef.current).filter(
        (slot) => !currentSlotsSet.has(slot)
      )

      // 呼叫刪除 API
      deletedSlots.forEach((slot) => {
        onImageDelete(slot).catch((error) => {
          console.error(`Failed to delete image slot ${slot}:`, error)
        })
      })

      // 更新追蹤的 slots
      previousSlotsRef.current = currentSlotsSet
    }
  }

  // 從 HTML 內容中提取所有 data-slot 屬性
  const getSlotsFromContent = (htmlContent: string): number[] => {
    if (!htmlContent) return []

    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    const images = doc.querySelectorAll('img[data-slot]')

    return Array.from(images)
      .map((img) => {
        const slot = img.getAttribute('data-slot')
        return slot ? parseInt(slot, 10) : null
      })
      .filter((slot): slot is number => slot !== null)
  }

  // Update editor content when value prop changes
  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      const currentData = editorRef.current.getData()
      if (currentData !== value) {
        editorRef.current.setData(value)

        // 更新 slots 追蹤
        const slots = getSlotsFromContent(value)
        previousSlotsRef.current = new Set(slots)
      }
    }
  }, [value])

  // Update disabled state
  useEffect(() => {
    if (editorRef.current) {
      if (disabled) {
        editorRef.current.enableReadOnlyMode('disabled')
      } else {
        editorRef.current.disableReadOnlyMode('disabled')
      }
    }
  }, [disabled])

  return (
    <div className="w-full">
      {/* CKEditor */}
      <div className="ck-editor-wrapper">
        <div
          className="editor-container editor-container_classic-editor"
          ref={editorContainerRef}
        >
          <div className="editor-container__editor">
            {editorConfig && (
              <CKEditorComponent
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                config={editorConfig as any}
                data={value}
                onReady={handleReady}
                onChange={handleChange}
                disabled={disabled}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

NewsEditor.displayName = 'NewsEditor'

export default NewsEditor
