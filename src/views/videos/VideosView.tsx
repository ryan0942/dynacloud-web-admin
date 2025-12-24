import PageBreadcrumb from '@/shared/ui/common/PageBreadCrumb'
import VideosExample from '@/shared/ui/components/video/VideosExample'
import React from 'react'

export default function VideosView() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Videos" />

      <VideosExample />
    </div>
  )
}
