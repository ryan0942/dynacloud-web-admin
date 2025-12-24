import CaseEditPage from '@/views/case/case-edit-page'

export const metadata = {
  title: '編輯案例',
  description: '編輯案例'
}

export default async function CaseEdit({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <CaseEditPage caseId={id} />
}
