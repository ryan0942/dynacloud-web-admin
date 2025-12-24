<div align="center">
  <img src="/src/app/favicon.ico" alt="雲動力資訊管理後台系統" width="108px">
</div>

# 👋 雲動力資訊管理後台系統

## 📖 Overview

本專案是一個基於 Feature‑Sliced Design（FSD）與 Next.js 15 App Router 架構的專案

- **模組化**：按照 FSD 分層，讓功能切片獨立、易於維護
- **高效開發**：結合 TailwindCSS、framer‑motion、React Query 等工具
- **代碼規範**：內建 Husky + lint‑staged + commitlint，確保團隊一致性

---

## ⚡️ Setup

```typescript
// 確認版本號
node -v // 確認版本號 22.19.0
pnpm -v // 確認版本號 10.13.1

// 複製環境變數檔案
cp env.example .env
```

## 🛠️ Commands

```typescript
pnpm i // 安裝依賴

pnpm dev // 啟動環境

pnpm build // 打包

pnpm lint:fix // 修正格式
```

## 📝 Commit rules

```
'feat',     # 新功能
'fix',       # 修復 bug
'docs',     # 文件更新
'style',    # 程式碼格式（不影響程式碼運行的格式化變動）
'refactor', # 重構（既不是新增功能，也不是修復 bug）
'ui',       # 調整 UI 樣式 不影響程式碼運行的 UI 樣式變動）
'perf',     # 性能優化
'test',     # 增加測試
'chore',    # 構建過程或輔助工具的變動
'revert',   # 回退
'build'     # 打包
```

## 📁 File system

```
/src/app        # 頁面入口 RSC 存放位置
/src/entities   # 業務實體（例如 Area）
/src/features   # 業務層
/src/i18n       # 多語系設定
/src/shared     # 共用邏輯、UI、型別、Hooks
/src/views      # 各頁面
/src/widgets    # 共用大組件（例如 Header、Footer）
```

## 🧩 Plugins

```
- 框架：React + Next15(App Router)
- 樣式：TailwindCSS + Shadcn + OriginUI
- 動畫：framer-motion
- 函數式工具：ramda
- 輪播：swiper
- 資料請求：@tanstack/react-query 搭配 server action
- 表單驗證：react-hook-form + zod
- 狀態管理：zustand
- Git Hooks：husky + lint-staged + commitlint
```

## 🤔 FAQ

```
1. FSD 架構相關

Q: 為什麼選擇 Feature-Sliced Design？
A: FSD 提供清晰的分層架構，讓功能模組獨立且易於維護。特別適合中大型專案的長期發展。

Q: features 和 widgets 的區別是什麼？
A:
- features: 業務邏輯和領域功能（如：用戶認證、商品管理）
- widgets: 自包含的大型 UI 區塊（如：導航欄、側邊欄）

Q: 可以在 features 之間互相引用嗎？
A: 不建議。Features 應該保持獨立，共用邏輯請放在 shared 層。

2. 開發流程相關

Q: 如何新增一個功能模組？
A: 在 features/ 下創建新目錄，包含：
- /api (Server Actions)
- /model (hooks & types)
- /ui (組件)
- index.ts (統一輸出)

Q: Server Action 和 Client Hook 該如何撰寫？
A:
- Server Action: 檔案建置在 features/[feature]/api，並由同一層的 index.ts 統一輸出
- Client Hook: 檔案建置在 features/[feature]/model，並在同一層的 index.ts 統一輸出

Q: Server Action 和 Client Hook 如何命名？
A:
- Server Action: 建議使用 fetch-xxx, create-xxx, update-xxx, delete-xxx
- Client Hook: 建議使用 use-fetch-xxx, use-create-xxx, use-update-xxx, use-delete-xxx

Q: 如何處理全域狀態？
A: 使用 Zustand 在 features/[feature]/model 中管理領域狀態。

3. 技術問題

Q: 如何處理 API 錯誤？
A:
- 使用 ErrorBoundary 捕獲組件錯誤
- React Query 的 onError 處理 API 錯誤
- shared/lib/error-handler 統一錯誤處理


4. 疑難排解
Q: 遇到 "Cannot find module" 錯誤？
A: 檢查 import 路徑是否正確，使用 @/ 作為 src/ 的別名。

Q: TailwindCSS 樣式沒有生效？
A: 確認類名正確且沒有動態拼接。檢查 tailwind.config.js 的 content 設定。
```
