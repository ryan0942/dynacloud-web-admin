import SignInView from '@/views/signin/SignInView'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '登入 | 雲動力資訊管理後台系統',
  description: '歡迎使用雲動力資訊管理後台系統'
}

export default function Page() {
  return <SignInView />
}
