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

interface SimpleCKEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  minHeight?: string
  disabled?: boolean
}

const SimpleCKEditor: React.FC<SimpleCKEditorProps> = ({
  value = '',
  onChange,
  placeholder = '請開始撰寫指南內容…',
  minHeight = '400px',
  disabled = false
}) => {
  const editorContainerRef = useRef(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null)
  const [isLayoutReady, setIsLayoutReady] = useState(false)

  useEffect(() => {
    setIsLayoutReady(true)
    return () => setIsLayoutReady(false)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editorConfig, setEditorConfig] = useState<any>(null)

  useEffect(() => {
    if (!isLayoutReady) return

    // 動態載入簡化版 CKEditor 配置
    const loadEditorConfig = async () => {
      const { getSimpleEditorConfig } = await import(
        './ck-editor-simple-config'
      )

      const config = getSimpleEditorConfig(placeholder)
      setEditorConfig(config)
    }

    loadEditorConfig()
  }, [isLayoutReady, placeholder])

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

SimpleCKEditor.displayName = 'SimpleCKEditor'

export default SimpleCKEditor
