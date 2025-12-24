// hero.ts - HeroUI theme configuration for Tailwind v4
import { heroui } from '@heroui/theme'

export default heroui({
  themes: {
    light: {
      colors: {
        primary: {
          DEFAULT: '#2043b6', // 使用 globals.css 中的 brand-500
          foreground: '#ffffff'
        },
        focus: '#2043b6'
      }
    },
    dark: {
      colors: {
        primary: {
          DEFAULT: '#548ae0', // 使用 globals.css 中的 brand-400 (較亮)
          foreground: '#ffffff'
        },
        focus: '#548ae0'
      }
    }
  }
})
