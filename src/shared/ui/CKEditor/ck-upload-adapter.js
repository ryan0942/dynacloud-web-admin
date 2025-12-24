// Custom upload adapter class
export class CustomUploadAdapter {
  constructor(loader, getCallbacks) {
    this.loader = loader
    this.getCallbacks = getCallbacks
  }

  upload() {
    return this.loader.file.then((file) => {
      return new Promise((resolve, reject) => {
        this._sendRequest(file, resolve, reject)
      })
    })
  }

  abort() {
    // Handle abort if needed
    this._resetFileInputs()
  }

  _resetFileInputs() {
    // 重置所有檔案輸入元素
    setTimeout(() => {
      const fileInputs = document.querySelectorAll('input[type="file"]')
      fileInputs.forEach((input) => {
        input.value = ''
        // 觸發 change 事件以確保狀態重置
        input.dispatchEvent(new Event('change', { bubbles: true }))
      })
    }, 100)
  }

  async _sendRequest(file, resolve, reject) {
    // Check file type (only allow jpg, jpeg, png)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      reject('僅支援 JPG、JPEG、PNG 格式的圖片')
      this._resetFileInputs()
      return
    }

    // Check file size (max 5MB)
    const fileSizeInMB = file.size / (1024 * 1024)
    if (fileSizeInMB > 5) {
      reject('檔案大小超過5MB，請選擇較小的檔案')
      this._resetFileInputs()
      return
    }

    // Check image dimensions (max 2000px)
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.onload = async () => {
        if (img.width > 4000 || img.height > 4000) {
          reject('圖片尺寸超過4000px，請選擇較小的圖片')
          this._resetFileInputs()
          return
        }

        try {
          // Get current callbacks
          const { onImageUpload } = this.getCallbacks()

          // Use custom upload function
          if (onImageUpload) {
            const result = await onImageUpload(file)
            // 儲存 slot 資訊以便後續使用
            if (result.slot !== undefined) {
              this.uploadedSlot = result.slot
            }
            resolve(result)
            this._resetFileInputs() // 上傳成功後重置
          } else {
            // No upload handler provided
            reject('未提供圖片上傳處理函式')
            this._resetFileInputs()
          }
        } catch (error) {
          console.error('Upload error:', error)
          reject(error.message || '圖片上傳發生錯誤')
          this._resetFileInputs() // 發生錯誤後重置
        }
      }

      img.onerror = () => {
        reject('無法讀取圖片')
        this._resetFileInputs()
      }

      img.src = e.target?.result
    }

    reader.readAsDataURL(file)
  }
}

// Create custom upload adapter plugin factory
export function createCustomUploadAdapterPlugin(getCallbacks) {
  return function CustomUploadAdapterPlugin(editor) {
    const fileRepository = editor.plugins.get('FileRepository')

    fileRepository.createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader, getCallbacks)
    }

    // 先配置 schema 和轉換，確保在上傳前就準備好
    const schema = editor.model.schema

    if (schema.isRegistered('imageBlock')) {
      schema.extend('imageBlock', {
        allowAttributes: ['dataSlot']
      })
    }

    if (schema.isRegistered('imageInline')) {
      schema.extend('imageInline', {
        allowAttributes: ['dataSlot']
      })
    }

    if (schema.isRegistered('image')) {
      schema.extend('image', {
        allowAttributes: ['dataSlot']
      })
    }

    // 配置轉換，將 model 中的 dataSlot 屬性轉換為 HTML 中的 data-slot
    editor.conversion.for('downcast').attributeToAttribute({
      model: 'dataSlot',
      view: 'data-slot'
    })

    // 配置轉換，將 HTML 中的 data-slot 轉換為 model 中的 dataSlot 屬性
    editor.conversion.for('upcast').attributeToAttribute({
      view: 'data-slot',
      model: 'dataSlot'
    })

    // 監聽上傳完成事件，添加 data-slot 屬性
    editor.plugins
      .get('ImageUploadEditing')
      .on('uploadComplete', (evt, { data, imageElement }) => {
        // 從上傳結果中獲取 slot 資訊
        if (data && data.slot !== undefined) {
          // 使用 CKEditor 的轉換系統來設定 data-slot 屬性
          editor.model.change((writer) => {
            writer.setAttribute('dataSlot', data.slot.toString(), imageElement)
          })
        }
      })
  }
}

// Legacy export for backward compatibility
export function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new CustomUploadAdapter(loader, () => ({}))
  }
}
