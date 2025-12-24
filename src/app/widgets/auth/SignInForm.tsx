'use client'

import { EyeCloseIcon, EyeIcon } from '@/icons'
import Button from '@/shared/ui/components/button/Button'
import Input from '@/shared/ui/form/input/InputField'
import Label from '@/shared/ui/form/Label'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// Zod 驗證 schema - 匹配 authOptions 的 credentials
const signInSchema = z.object({
  account: z
    .string()
    .min(1, '請輸入帳號')
    .max(50, '帳號長度不可超過 50 個字元'),
  password: z
    .string()
    .min(1, '請輸入密碼')
    .min(6, '密碼至少需要 6 個字元')
    .max(100, '密碼長度不可超過 100 個字元')
})

type SignInFormData = z.infer<typeof signInSchema>

export default function SignInForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur', // 失焦時驗證，提供更好的用戶體驗
    defaultValues: {
      account: '',
      password: ''
    }
  })

  const onSubmit = async (data: SignInFormData) => {
    try {
      setErrorMessage('')

      // 使用 NextAuth 的 signIn 方法
      // provider id 為 "login"，對應 authOptions 中的 CredentialsProvider
      const result = await signIn('login', {
        account: data.account,
        password: data.password,
        redirect: false // 不自動重定向，手動處理
      })

      // 檢查登入結果
      if (result?.error) {
        // NextAuth 返回錯誤
        // 後端返回 null 時，NextAuth 會設置 error 為 "CredentialsSignin"
        if (result.error === 'CredentialsSignin') {
          setErrorMessage('帳號或密碼錯誤，請重試')
        } else {
          setErrorMessage(result.error)
        }
        return
      }

      if (result?.ok) {
        // 登入成功
        // NextAuth 會自動處理 session 和 token
        // 重定向到首頁
        router.push('/')
        router.refresh()
      } else {
        // 未知錯誤
        setErrorMessage('登入時發生錯誤，請稍後再試')
      }
    } catch (error) {
      console.error('登入錯誤:', error)
      setErrorMessage('登入時發生錯誤，請稍後再試')
    }
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        {/* Logo 和標題 */}
        <div className="mb-5 sm:mb-8 flex flex-col items-center gap-5">
          <Image
            src="/images/logo/logo.png"
            alt="雲動力資訊管理後台系統"
            width={200}
            height={30}
            className="dark:hidden"
            priority
          />
          <Image
            src="/images/logo/logo.png"
            alt="雲動力資訊管理後台系統"
            width={200}
            height={30}
            className="hidden dark:block"
            priority
          />
          <h1 className="mb-2 font-semibold text-gray-800 text-xl dark:text-white/90 sm:text-2xl">
            雲動力資訊管理後台系統
          </h1>
        </div>

        {/* 登入表單 */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 全局錯誤訊息 */}
          {errorMessage && (
            <div className="p-4 rounded-lg bg-error-50 border border-error-200 dark:bg-error-500/10 dark:border-error-500/20">
              <p className="text-sm text-error-700 dark:text-error-400">
                {errorMessage}
              </p>
            </div>
          )}

          {/* 帳號欄位 */}
          <div>
            <Label htmlFor="account">
              帳號 <span className="text-error-500">*</span>
            </Label>
            <Input
              id="account"
              type="text"
              placeholder="請輸入帳號"
              autoComplete="username"
              error={!!errors.account}
              hint={errors.account?.message}
              disabled={isSubmitting}
              {...register('account')}
            />
          </div>

          {/* 密碼欄位 */}
          <div>
            <Label htmlFor="password">
              密碼 <span className="text-error-500">*</span>
            </Label>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="請輸入密碼"
              autoComplete="current-password"
              error={!!errors.password}
              hint={errors.password?.message}
              disabled={isSubmitting}
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? '隱藏密碼' : '顯示密碼'}
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </button>
              }
              {...register('password')}
            />
          </div>

          {/* 提交按鈕 */}
          <div>
            <Button
              type="submit"
              className="w-full"
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? '登入中...' : '登入'}
            </Button>
          </div>
        </form>

        {/* 備註或額外連結 */}
        {/* <div className="mt-6 text-center">
          <a
            href="/forgot-password"
            className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
          >
            忘記密碼？
          </a>
        </div> */}
      </div>
    </div>
  )
}
