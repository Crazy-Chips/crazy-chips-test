'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { MenuItem } from '@/types'
import CustomisationModal from './CustomisationModal'

const CATEGORY_EMOJI: Record<string, string> = {
  Chips: '🍟', Burgers: '🍔', Sides: '🧅', Drinks: '🥤', Combos: '🍱', Deals: '🏷️',
}

interface MenuCardProps {
  item: MenuItem
}

export default function MenuCard({ item }: MenuCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const emoji = CATEGORY_EMOJI[item.category] ?? '🍽️'

  return (
    <>
      <div
        className="bg-white rounded-[18px] p-4 shadow-[0_4px_20px_rgba(61,34,0,0.12)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        {/* Image or emoji */}
        <div className="relative h-44 bg-[#FFF8EE] rounded-[13px] overflow-hidden mb-4">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {emoji}
            </div>
          )}
          {item.featured && (
            <span className="absolute top-2.5 left-2.5 bg-[#D92B2B] text-white text-[10px] font-[800] px-2 py-1 rounded-full">
              🔥 Popular
            </span>
          )}
          {!item.available && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-[#8a7a6a] text-white text-xs font-[700] px-3 py-1.5 rounded-full">
                Unavailable
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <h3 className="font-[800] text-[#3D2200] text-[15px] mb-1.5 leading-tight">
          {item.name}
        </h3>
        <p className="text-[#8a7a6a] text-[13px] leading-relaxed font-[500] mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <span
            className="text-[22px] text-[#D92B2B]"
            style={{ fontFamily: 'var(--font-lilita)' }}
          >
            £{item.price.toFixed(2)}
          </span>
          <button
            className="bg-[#D92B2B] hover:bg-[#B01E1E] text-white rounded-[10px] px-3 py-2 flex items-center gap-1.5 text-[13px] font-[800] transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={!item.available}
            onClick={(e) => { e.stopPropagation(); setModalOpen(true) }}
            aria-label={`Add ${item.name} to cart`}
          >
            <Plus size={14} strokeWidth={3} /> Add
          </button>
        </div>
      </div>

      <CustomisationModal item={item} open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
