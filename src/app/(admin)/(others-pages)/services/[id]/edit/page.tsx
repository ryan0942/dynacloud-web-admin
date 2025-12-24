import ServiceEditPage from '@/views/services/servoce-edit-page'

import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'

import { fetchService } from '@/features/services/api/fetch-service'
import { fetchServicesCategories } from '@/features/services/api/fetch-services-categories'

export const metadata = {
  title: '編輯產品服務',
  description: '編輯產品服務'
}

async function handleFetchServicesCategories(id: string) {
  const queryClient = new QueryClient()
  await Promise.all([
    await queryClient.prefetchQuery({
      queryKey: ['services-categories'],
      queryFn: fetchServicesCategories
    }),
    await queryClient.prefetchQuery({
      queryKey: ['service', id],
      queryFn: () => fetchService(id)
    })
  ])
  return dehydrate(queryClient)
}

export default async function ServiceEdit({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const dehydratedState = await handleFetchServicesCategories(id)
  return (
    <HydrationBoundary state={dehydratedState}>
      <ServiceEditPage serviceId={id} />
    </HydrationBoundary>
  )
}
