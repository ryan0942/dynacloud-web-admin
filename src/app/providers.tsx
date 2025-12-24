'use client'

import { HeroUIProvider } from '@heroui/react'
import { I18nProvider } from '@react-aria/i18n'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider locale="zh-TW">
      <HeroUIProvider>{children}</HeroUIProvider>
    </I18nProvider>
  )
}
