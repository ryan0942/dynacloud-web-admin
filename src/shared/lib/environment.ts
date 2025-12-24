const requiredEnvironmentVariables = {
  NODE_ENV: process.env.NODE_ENV,
  APP_TITLE: process.env.APP_TITLE,
  APP_URL: process.env.APP_URL,
  SERVICE_URL: process.env.SERVICE_URL,
  SERVICE_TIMEOUT: process.env.SERVICE_TIMEOUT,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL
} as const

export function validateEnvironment() {
  const missingVariables: string[] = []

  Object.entries(requiredEnvironmentVariables).forEach(([key, value]) => {
    if (!value) {
      missingVariables.push(key)
    }
  })

  if (missingVariables.length > 0) {
    throw new Error(
      `缺少環境變數: ${missingVariables.join(', ')}\n` +
        '請檢查 .env 檔案，確保所有必要的變數都已設定。'
    )
  }
}

export const env = {
  NODE_ENV: requiredEnvironmentVariables.NODE_ENV!,
  APP_TITLE: requiredEnvironmentVariables.APP_TITLE!,
  APP_URL: requiredEnvironmentVariables.APP_URL!,
  SERVICE_URL: requiredEnvironmentVariables.SERVICE_URL!,
  SERVICE_TIMEOUT: requiredEnvironmentVariables.SERVICE_TIMEOUT!,
  NEXTAUTH_SECRET: requiredEnvironmentVariables.NEXTAUTH_SECRET!,
  NEXTAUTH_URL: requiredEnvironmentVariables.NEXTAUTH_URL!
} as const

try {
  validateEnvironment()
} catch (error) {
  console.error(
    '環境變數驗證失敗:',
    error instanceof Error ? error.message : '未知錯誤'
  )
  process.exit(1)
}
