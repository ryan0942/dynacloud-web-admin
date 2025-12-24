'use client'

import { useFetchCompanyInfo } from '@/features/company/model/use-fetch-company-info'
import { useUpdateCompanyInfo } from '@/features/company/model/use-update-company-info'
import type { UpdateCompanyInfoPayload } from '@/features/company/model/type'
import { useToast } from '@/context/ToastContext'
import { Button, Input, Spinner, Tab, Tabs } from '@heroui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useState } from 'react'

// Zod 驗證 schema
const companyInfoSchema = z.object({
  zh_address: z.string().min(1, '請輸入中文地址'),
  en_address: z.string().min(1, '請輸入英文地址'),
  zh_phone: z.string().min(1, '請輸入中文電話'),
  en_phone: z.string().min(1, '請輸入英文電話'),
  zh_email: z.string().email('請輸入有效的中文電子郵件'),
  en_email: z.string().email('請輸入有效的英文電子郵件'),
  zh_opening_time: z.string().min(1, '請輸入中文營業時間'),
  en_opening_time: z.string().min(1, '請輸入英文營業時間')
})

export default function CompanyInfoPage() {
  const { success, error } = useToast()
  const queryClient = useQueryClient()
  const { data: companyData, isLoading } = useFetchCompanyInfo()
  const { mutate: updateCompanyInfo, isPending } = useUpdateCompanyInfo()

  // 當前選中的語言 Tab
  const [selectedTab, setSelectedTab] = useState<string>('zh')

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<UpdateCompanyInfoPayload>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      zh_address: '',
      en_address: '',
      zh_phone: '',
      en_phone: '',
      zh_email: '',
      en_email: '',
      zh_opening_time: '',
      en_opening_time: ''
    }
  })

  // 當公司資料載入後，填充表單
  useEffect(() => {
    if (companyData?.result) {
      reset({
        zh_address: companyData.result.zh_address,
        en_address: companyData.result.en_address,
        zh_phone: companyData.result.zh_phone,
        en_phone: companyData.result.en_phone,
        zh_email: companyData.result.zh_email,
        en_email: companyData.result.en_email,
        zh_opening_time: companyData.result.zh_opening_time,
        en_opening_time: companyData.result.en_opening_time
      })
    }
  }, [companyData, reset])

  const onSubmit = (data: UpdateCompanyInfoPayload) => {
    updateCompanyInfo(data, {
      onSuccess: (response) => {
        if (!response.success) {
          error(response.message || '更新失敗')
          return
        }
        queryClient.invalidateQueries({ queryKey: ['company-info'] })
        success('更新成功')
        reset(data) // 重置表單狀態，使 isDirty 變為 false
      },
      onError: () => {
        error('更新失敗')
      }
    })
  }

  // 載入中狀態
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  // 沒有資料
  if (!companyData?.result) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-default-500">找不到公司資料</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">公司資訊</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 中英文分頁 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">公司資訊</h2>

          <Tabs
            aria-label="語言選項"
            color="primary"
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
          >
            {/* 中文頁籤 */}
            <Tab key="zh" title="中文">
              <div className="space-y-4 pt-4">
                <Controller
                  name="zh_address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="中文地址"
                      placeholder="請輸入中文地址"
                      isRequired
                      isInvalid={!!errors.zh_address}
                      errorMessage={errors.zh_address?.message}
                    />
                  )}
                />

                <Controller
                  name="zh_phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="中文電話"
                      placeholder="請輸入中文電話"
                      isRequired
                      isInvalid={!!errors.zh_phone}
                      errorMessage={errors.zh_phone?.message}
                    />
                  )}
                />

                <Controller
                  name="zh_email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="中文電子郵件"
                      placeholder="請輸入中文電子郵件"
                      type="email"
                      isRequired
                      isInvalid={!!errors.zh_email}
                      errorMessage={errors.zh_email?.message}
                    />
                  )}
                />

                <Controller
                  name="zh_opening_time"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="中文營業時間"
                      placeholder="請輸入中文營業時間"
                      isRequired
                      isInvalid={!!errors.zh_opening_time}
                      errorMessage={errors.zh_opening_time?.message}
                    />
                  )}
                />
              </div>
            </Tab>

            {/* 英文頁籤 */}
            <Tab key="en" title="English">
              <div className="space-y-4 pt-4">
                <Controller
                  name="en_address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="英文地址 (English Address)"
                      placeholder="Please enter English address"
                      isRequired
                      isInvalid={!!errors.en_address}
                      errorMessage={errors.en_address?.message}
                    />
                  )}
                />

                <Controller
                  name="en_phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="英文電話 (English Phone)"
                      placeholder="Please enter English phone"
                      isRequired
                      isInvalid={!!errors.en_phone}
                      errorMessage={errors.en_phone?.message}
                    />
                  )}
                />

                <Controller
                  name="en_email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="英文電子郵件 (English Email)"
                      placeholder="Please enter English email"
                      type="email"
                      isRequired
                      isInvalid={!!errors.en_email}
                      errorMessage={errors.en_email?.message}
                    />
                  )}
                />

                <Controller
                  name="en_opening_time"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="英文營業時間 (English Opening Time)"
                      placeholder="Please enter English opening time"
                      isRequired
                      isInvalid={!!errors.en_opening_time}
                      errorMessage={errors.en_opening_time?.message}
                    />
                  )}
                />
              </div>
            </Tab>
          </Tabs>
        </div>

        {/* 操作按鈕 */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            color="primary"
            type="submit"
            isLoading={isPending}
            isDisabled={!isDirty || isPending}
          >
            更新
          </Button>
        </div>
      </form>
    </div>
  )
}
