import BarChartOne from '@/app/widgets/charts/bar/BarChartOne'
import ComponentCard from '@/shared/ui/common/ComponentCard'
import PageBreadcrumb from '@/shared/ui/common/PageBreadCrumb'
import React from 'react'

export default function BarChartView() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Bar Chart" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart 1">
          <BarChartOne />
        </ComponentCard>
      </div>
    </div>
  )
}
