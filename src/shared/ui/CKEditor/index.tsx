'use client'

import dynamic from 'next/dynamic'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'

// ** 樣式
import './ck-article-style.css'

// ** Components
import Label from '@/shared/ui/form/Label'

// 動態導入 CKEditor 組件，避免 SSR 問題
const CKEditorComponent = dynamic(() => import('./CKEditorWrapper'), {
  ssr: false,
  loading: () => (
    <div className="min-h-200 border rounded-md p-4 bg-gray-50 flex items-center justify-center text-gray-500">
      載入編輯器中...
    </div>
  )
})

interface ImageUploadResult {
  default: string
  slot?: number
}

interface CKEditorFieldProps {
  value?: string
  onChange?: (value: string) => void
  _name?: string
  title?: string
  id?: string
  placeholder?: string
  errorMessage?: string
  className?: string
  minHeight?: string
  disabled?: boolean
  onImageUpload?: (file: File) => Promise<ImageUploadResult>
  onImageDelete?: (imageUrl: string, slot?: number) => Promise<void>
  getCurrentSlotForImage?: (imageUrl: string) => number | null
}

const CKEditorField: React.FC<CKEditorFieldProps> = ({
  value = '',
  onChange,
  title,
  id,
  placeholder = '請開始撰寫課程介紹…',
  errorMessage,
  className = '',
  minHeight = '600px',
  disabled = false,
  onImageUpload,
  onImageDelete,
  getCurrentSlotForImage
}) => {
  const editorContainerRef = useRef(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null)
  const [isLayoutReady, setIsLayoutReady] = useState(false)
  const currentImagesRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    setIsLayoutReady(true)
    return () => setIsLayoutReady(false)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editorConfig, setEditorConfig] = useState<any>(null)
  const callbacksRef = useRef({
    onImageUpload,
    onImageDelete,
    getCurrentSlotForImage
  })

  // Update callbacks ref when props change
  useEffect(() => {
    callbacksRef.current = {
      onImageUpload,
      onImageDelete,
      getCurrentSlotForImage
    }
  }, [onImageUpload, onImageDelete, getCurrentSlotForImage])

  useEffect(() => {
    if (!isLayoutReady) return

    // 動態載入 CKEditor 配置，避免 SSR 問題
    const loadEditorConfig = async () => {
      const { getEditorConfig } = await import('./ck-editor-config')
      const { createCustomUploadAdapterPlugin } = await import(
        './ck-upload-adapter'
      )

      // Create plugin with callback access
      const CustomUploadAdapterPlugin = createCustomUploadAdapterPlugin(
        () => callbacksRef.current
      )

      const config = getEditorConfig(CustomUploadAdapterPlugin, placeholder)
      setEditorConfig(config)
    }

    loadEditorConfig()
  }, [isLayoutReady, placeholder])

  // Extract image URLs and slots from editor content
  const extractImageInfo = (content: string): Map<string, number | null> => {
    const imageInfo = new Map<string, number | null>()
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const images = doc.querySelectorAll('img')

    images.forEach((img) => {
      const src = img.getAttribute('src')
      const slot = img.getAttribute('data-slot')
      if (src) {
        imageInfo.set(src, slot ? parseInt(slot, 10) : null)
      }
    })

    return imageInfo
  }

  // Check for deleted images and trigger callback
  const checkForDeletedImages = (newContent: string) => {
    const newImageInfo = extractImageInfo(newContent)
    const currentImageUrls = currentImagesRef.current

    // Find deleted images
    const deletedImages = new Set<string>()
    currentImageUrls.forEach((url) => {
      if (!newImageInfo.has(url)) {
        deletedImages.add(url)
      }
    })

    // Trigger delete callback for each deleted image
    if (deletedImages.size > 0 && onImageDelete) {
      deletedImages.forEach((url) => {
        // 嘗試從 getCurrentSlotForImage 獲取 slot 資訊
        let slot: number | undefined
        if (getCurrentSlotForImage) {
          const slotFromCallback = getCurrentSlotForImage(url)
          if (slotFromCallback !== null) {
            slot = slotFromCallback
          }
        }

        onImageDelete(url, slot).catch((error) => {
          console.error('Failed to delete image:', error)
        })
      })
    }

    // Update current images (only URLs for backward compatibility)
    currentImagesRef.current = new Set(newImageInfo.keys())
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleReady = (editor: any) => {
    editorRef.current = editor

    // Update content when data prop changes
    if (value && value !== editor.getData()) {
      editor.setData(value)
    }

    // Initialize current images
    const initialImageInfo = extractImageInfo(value || '')
    currentImagesRef.current = new Set(initialImageInfo.keys())

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

    // Listen for content changes to detect image deletions
    editor.model.document.on('change:data', () => {
      const currentContent = editor.getData()
      checkForDeletedImages(currentContent)
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (_event: any, editor: any) => {
    const content = editor.getData()
    if (onChange) {
      onChange(content)
    }
  }

  // Update editor content when value prop changes
  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      const currentData = editorRef.current.getData()
      if (currentData !== value) {
        editorRef.current.setData(value)
        // Update current images when value changes externally
        const imageInfo = extractImageInfo(value || '')
        currentImagesRef.current = new Set(imageInfo.keys())
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
    <div className={`w-full flex flex-col gap-[4px] ${className}`}>
      {/* Label */}
      {title && <Label htmlFor={id}>{title}</Label>}

      {/* CKEditor */}
      <div className="ck-editor-wrapper">
        <div
          className="editor-container editor-container_classic-editor"
          ref={editorContainerRef}
        >
          <div className="editor-container__editor">
            {editorConfig &&
              (() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const config = editorConfig as any
                return (
                  <CKEditorComponent
                    config={config}
                    data={value}
                    onReady={handleReady}
                    onChange={handleChange}
                    disabled={disabled}
                  />
                )
              })()}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <p className="text-sm text-a-500 mt-1">{errorMessage}</p>
      )}
    </div>
  )
}

CKEditorField.displayName = 'CKEditorField'

export default CKEditorField
