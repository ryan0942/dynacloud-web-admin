import ComponentCard from '@/shared/ui/common/ComponentCard'
import PageBreadcrumb from '@/shared/ui/common/PageBreadCrumb'
import BasicTableOne from '@/app/widgets/tables/BasicTableOne'
import { Button } from '@heroui/react'

export default function BasicTablesView() {
  return (
    <div>
      <Button color="primary">Primary Button</Button>
      <PageBreadcrumb pageTitle="Basic Table" />
      <div className="space-y-6">
        <ComponentCard title="Basic Table 1">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  )
}
