import BlogEditPage from '@/views/blog/blog-edit-page'

export const metadata = {
  title: '編輯部落格',
  description: '編輯部落格'
}

export default async function BlogEdit({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <BlogEditPage blogId={id} />
}
