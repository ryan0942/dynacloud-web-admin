import PageBreadcrumb from '@/shared/ui/common/PageBreadCrumb'
import DefaultModal from '@/app/widgets/example/ModalExample/DefaultModal'
import FormInModal from '@/app/widgets/example/ModalExample/FormInModal'
import FullScreenModal from '@/app/widgets/example/ModalExample/FullScreenModal'
import ModalBasedAlerts from '@/app/widgets/example/ModalExample/ModalBasedAlerts'
import VerticallyCenteredModal from '@/app/widgets/example/ModalExample/VerticallyCenteredModal'
import React from 'react'

export default function ModalsView() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Modals" />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 xl:gap-6">
        <DefaultModal />
        <VerticallyCenteredModal />
        <FormInModal />
        <FullScreenModal />
        <ModalBasedAlerts />
      </div>
    </div>
  )
}
