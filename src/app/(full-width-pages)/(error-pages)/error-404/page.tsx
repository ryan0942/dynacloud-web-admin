import { Metadata } from 'next'
import Error404View from '@/views/error-404/Error404View'

export const metadata: Metadata = {
  title: '404 錯誤 | SSC 臨冬滑雪俱樂部',
  description: '找不到頁面'
}

export default function Page() {
  return <Error404View />
}
