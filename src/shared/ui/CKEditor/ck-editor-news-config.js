import {
  AutoImage,
  BlockQuote,
  Bold,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontSize,
  Heading,
  ImageBlock,
  ImageCaption,
  ImageEditing,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  ImageUtils,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  Paragraph,
  PasteFromOffice,
  SourceEditing,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  Underline,
  Strikethrough,
  FileRepository,
  Alignment
} from 'ckeditor5'
import translations from 'ckeditor5/translations/zh.js'

export const LICENSE_KEY = 'GPL'

// Toolbar configuration with image upload
export const newsToolbarConfig = {
  items: [
    'sourceEditing',
    '|',
    'undo',
    'redo',
    '|',
    'heading',
    '|',
    'fontSize',
    'fontColor',
    'fontBackgroundColor',
    '|',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    '|',
    'alignment',
    '|',
    'bulletedList',
    'numberedList',
    '|',
    'link',
    'insertImage',
    'blockQuote',
    '|',
    'insertTable'
  ],
  shouldNotGroupWhenFull: true
}

// Heading configuration
export const headingConfig = {
  options: [
    {
      model: 'paragraph',
      title: '段落',
      class: 'ck-heading_paragraph'
    },
    {
      model: 'heading2',
      view: 'h2',
      title: '標題 2',
      class: 'ck-heading_heading2'
    },
    {
      model: 'heading3',
      view: 'h3',
      title: '標題 3',
      class: 'ck-heading_heading3'
    },
    {
      model: 'heading4',
      view: 'h4',
      title: '標題 4',
      class: 'ck-heading_heading4'
    },
    {
      model: 'heading5',
      view: 'h5',
      title: '標題 5',
      class: 'ck-heading_heading5'
    }
  ]
}

// Font size configuration
export const fontSizeConfig = {
  options: [
    'default',
    '12px',
    '14px',
    '16px',
    '18px',
    '20px',
    '24px',
    '28px',
    '32px'
  ]
}

// Font color configuration
export const fontColorConfig = {
  colors: [
    { color: '#A1BDE5', label: '淺藍色' },
    { color: '#02B1CB', label: '天藍色' },
    { color: '#27A992', label: '青綠色' },
    { color: '#000000', label: '黑色' },
    { color: '#3D3D3D', label: '深灰色' },
    { color: '#FF4B30', label: '紅色' },
    { color: '#EF9072', label: '橙色' },
    { color: '#ffcd2a', label: '黃色' },
    { color: '#5B9D2D', label: '綠色' },
    { color: '#3192B7', label: '藍色' },
    { color: '#3F2A72', label: '紫色' }
  ],
  columns: 6
}

// Image configuration
export const imageConfig = {
  resizeOptions: [
    {
      name: 'resizeImage:original',
      label: '原始大小',
      value: null
    },
    {
      name: 'resizeImage:50',
      label: '50%',
      value: '50'
    },
    {
      name: 'resizeImage:75',
      label: '75%',
      value: '75'
    }
  ],
  toolbar: [
    'imageTextAlternative',
    '|',
    'imageStyle:inline',
    'imageStyle:wrapText',
    'imageStyle:breakText',
    '|',
    'resizeImage'
  ],
  upload: {
    types: ['jpeg', 'jpg', 'png']
  }
}

// Link configuration
export const linkConfig = {
  addTargetToExternalLinks: true,
  defaultProtocol: 'https://',
  decorators: {
    openInNewTab: {
      mode: 'manual',
      label: '在新分頁開啟',
      attributes: {
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    }
  }
}

// List configuration
export const listConfig = {
  properties: {
    styles: true,
    startIndex: true,
    reversed: true
  }
}

// Table configuration
export const tableConfig = {
  contentToolbar: [
    'tableColumn',
    'tableRow',
    'mergeTableCells',
    'tableProperties',
    'tableCellProperties'
  ]
}

// News editor plugins (with image upload support)
export const newsEditorPlugins = [
  AutoImage,
  BlockQuote,
  Bold,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontSize,
  Heading,
  ImageBlock,
  ImageCaption,
  ImageEditing,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  ImageUtils,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  Paragraph,
  PasteFromOffice,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  Underline,
  Strikethrough,
  FileRepository,
  Alignment,
  SourceEditing
]

// Get news editor configuration with image upload support
export function getNewsEditorConfig(
  CustomUploadAdapterPlugin,
  placeholder = '請開始撰寫新聞內容…'
) {
  return {
    toolbar: newsToolbarConfig,
    plugins: [...newsEditorPlugins, CustomUploadAdapterPlugin],
    heading: headingConfig,
    fontSize: fontSizeConfig,
    fontColor: fontColorConfig,
    image: imageConfig,
    language: 'zh',
    licenseKey: LICENSE_KEY,
    link: linkConfig,
    list: listConfig,
    placeholder: placeholder,
    table: tableConfig,
    translations: [translations]
  }
}
