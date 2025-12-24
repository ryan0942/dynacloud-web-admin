import Calendar from '@/app/widgets/calendar/Calendar'
import PageBreadcrumb from '@/shared/ui/common/PageBreadCrumb'
import React from 'react'

export default function CalendarView() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Calendar" />
      <Calendar />
    </div>
  )
}
