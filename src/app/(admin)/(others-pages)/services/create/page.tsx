import ServiceCreatePage from '@/views/services/service-create-page'

import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'

import { fetchServicesCategories } from '@/features/services/api/fetch-services-categories'

export const metadata = {
  title: '建立產品服務',
  description: '建立產品服務'
}

async function handleFetchServicesCategories() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['services-categories'],
    queryFn: fetchServicesCategories
  })
  return dehydrate(queryClient)
}

export default async function ServiceCreate() {
  const dehydratedState = await handleFetchServicesCategories()
  return (
    <HydrationBoundary state={dehydratedState}>
      <ServiceCreatePage />
    </HydrationBoundary>
  )
}
