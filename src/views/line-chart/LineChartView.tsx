import LineChartOne from '@/app/widgets/charts/line/LineChartOne'
import ComponentCard from '@/shared/ui/common/ComponentCard'
import PageBreadcrumb from '@/shared/ui/common/PageBreadCrumb'
import React from 'react'

export default function LineChartView() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Line Chart" />
      <div className="space-y-6">
        <ComponentCard title="Line Chart 1">
          <LineChartOne />
        </ComponentCard>
      </div>
    </div>
  )
}
