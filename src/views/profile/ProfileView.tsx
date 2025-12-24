import UserAddressCard from '@/app/widgets/user-profile/UserAddressCard'
import UserInfoCard from '@/app/widgets/user-profile/UserInfoCard'
import UserMetaCard from '@/app/widgets/user-profile/UserMetaCard'
import React from 'react'

export default function ProfileView() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
        </div>
      </div>
    </div>
  )
}
