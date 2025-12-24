'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Partner } from '../model/type'
import { Card, CardBody } from '@heroui/react'
import Image from 'next/image'

interface SortablePartnerCardProps {
  partner: Partner
}

export function SortablePartnerCard({ partner }: SortablePartnerCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: partner.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab'
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className={`group ${isDragging ? 'shadow-xl ring-2 ring-primary' : ''}`}
      >
        <CardBody className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-primary font-medium">拖曳排序</span>
          </div>
          <div className="relative aspect-square w-full mb-3 bg-default-100 rounded-lg overflow-hidden">
            <Image
              src={partner.logo}
              alt={partner.zh_name}
              fill
              className="object-contain p-2 pointer-events-none"
            />
          </div>
          <h3 className="font-semibold text-sm mb-1 truncate">
            {partner.zh_name}
          </h3>
          <p className="text-xs text-default-500 truncate">{partner.en_name}</p>
          {partner.url && (
            <p className="text-xs text-default-400 truncate mt-1">
              {partner.url}
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
