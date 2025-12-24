import NewsEditPage from '@/views/news/news-edit-page'

export const metadata = {
  title: '編輯媒體活動',
  description: '編輯媒體活動'
}

export default async function NewsEdit({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <NewsEditPage newsId={id} />
}
