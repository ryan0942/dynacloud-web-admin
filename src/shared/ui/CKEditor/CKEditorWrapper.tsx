'use client'

import * as React from 'react'
import 'ckeditor5/ckeditor5.css'

// 動態導入 CKEditor 模組
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let CKEditor: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ClassicEditor: any = null

const loadCKEditor = async () => {
  if (!CKEditor || !ClassicEditor) {
    const [ckEditorModule, classicEditorModule] = await Promise.all([
      import('@ckeditor/ckeditor5-react'),
      import('ckeditor5')
    ])
    CKEditor = ckEditorModule.CKEditor
    ClassicEditor = classicEditorModule.ClassicEditor
  }
  return { CKEditor, ClassicEditor }
}

interface CKEditorWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any
  data: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onReady: (editor: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (event: any, editor: any) => void
  disabled?: boolean
}

const CKEditorWrapper: React.FC<CKEditorWrapperProps> = ({
  config,
  data,
  onReady,
  onChange,
  disabled = false
}) => {
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    loadCKEditor().then(() => {
      setIsReady(true)
    })
  }, [])

  if (!isReady || !CKEditor || !ClassicEditor) {
    return (
      <div className="min-h-[200px] border rounded-md p-4 bg-gray-50 flex items-center justify-center text-gray-500">
        載入編輯器中...
      </div>
    )
  }

  return (
    <CKEditor
      editor={ClassicEditor}
      config={config}
      data={data}
      onReady={onReady}
      onChange={onChange}
      disabled={disabled}
    />
  )
}

export default CKEditorWrapper
