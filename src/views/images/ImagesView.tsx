import ComponentCard from '@/shared/ui/common/ComponentCard'
import PageBreadcrumb from '@/shared/ui/common/PageBreadCrumb'
import ResponsiveImage from '@/shared/ui/components/images/ResponsiveImage'
import ThreeColumnImageGrid from '@/shared/ui/components/images/ThreeColumnImageGrid'
import TwoColumnImageGrid from '@/shared/ui/components/images/TwoColumnImageGrid'
import React from 'react'

export default function ImagesView() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Images" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Responsive image">
          <ResponsiveImage />
        </ComponentCard>
        <ComponentCard title="Image in 2 Grid">
          <TwoColumnImageGrid />
        </ComponentCard>
        <ComponentCard title="Image in 3 Grid">
          <ThreeColumnImageGrid />
        </ComponentCard>
      </div>
    </div>
  )
}
