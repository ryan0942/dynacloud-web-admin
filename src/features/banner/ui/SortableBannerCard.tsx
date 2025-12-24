'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardBody, CardHeader, Chip } from '@heroui/react'
import dayjs from 'dayjs'
import { type Banner, BannerType } from '../model/type'

interface SortableBannerCardProps {
  banner: Banner
}

export function SortableBannerCard({ banner }: SortableBannerCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: banner.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab'
  }

  // 取得媒體 URL（優先使用中文，沒有則用英文）
  const mediaUrl =
    banner.type === BannerType.VIDEO
      ? banner.zh_url || banner.en_url
      : banner.zh_image || banner.en_image

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className={`hover:shadow-lg transition-shadow ${isDragging ? 'shadow-xl ring-2 ring-primary' : ''}`}
      >
        <CardHeader className="flex flex-col items-start pb-0 pt-4 px-4">
          <div className="flex items-center justify-between w-full mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-1 rounded-lg ${
                  banner.type === BannerType.IMAGE
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                }`}
              >
                {banner.type === BannerType.IMAGE ? '圖片' : '影片'}
              </span>
              {/* 語系標籤 */}
              <div className="flex gap-1">
                {banner.showInZh && (
                  <Chip size="sm" color="primary" variant="flat">
                    中文
                  </Chip>
                )}
                {banner.showInEn && (
                  <Chip size="sm" color="secondary" variant="flat">
                    英文
                  </Chip>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-primary font-medium">拖曳排序</span>
              <span className="text-xs text-default-500">
                播放時長：{banner.duration} 秒
              </span>
            </div>
          </div>
        </CardHeader>

        <CardBody className="px-4 py-3">
          {/* 媒體預覽 */}
          {mediaUrl && (
            <div className="mb-3">
              <div className="relative w-full h-36 rounded-lg overflow-hidden bg-default-100">
                {banner.type === BannerType.VIDEO ? (
                  <video
                    src={mediaUrl}
                    className="w-full h-full object-cover pointer-events-none"
                  >
                    您的瀏覽器不支援影片播放
                  </video>
                ) : (
                  <img
                    src={mediaUrl}
                    alt={`Banner ${banner.id}`}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                )}
              </div>
            </div>
          )}

          <p className="text-sm text-default-400 text-l">
            建立時間：
            {dayjs(banner.createdAt).format('YYYY-MM-DD HH:mm')}
          </p>
          <p className="text-sm text-default-400 text-l">
            更新時間：
            {dayjs(banner.updatedAt).format('YYYY-MM-DD HH:mm')}
          </p>
        </CardBody>
      </Card>
    </div>
  )
}
