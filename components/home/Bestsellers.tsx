'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { MenuItem } from '@/types'
import MenuCard from '@/components/menu/MenuCard'

export default function Bestsellers() {
  const [items, setItems] = useState<MenuItem[]>([])

  useEffect(() => {
    fetch('/api/menu?featured=true')
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data.slice(0, 6) : []))
      .catch(() => {})
  }, [])

  if (!items.length) return null

  return (
    <section id="menu" className="bg-[#FFF8EE] py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <p className="text-[#D92B2B] text-xs font-[800] uppercase tracking-[0.15em] mb-1">
              🔥 Fan Favourites
            </p>
            <h2 className="text-4xl text-[#3D2200]" style={{ fontFamily: 'var(--font-lilita)' }}>
              Bestsellers
            </h2>
          </div>
          <Link
            href="/menu"
            className="hidden sm:inline-flex items-center gap-1.5 text-[#D92B2B] font-[800] text-sm hover:gap-2.5 transition-all"
          >
            See all <ArrowRight size={15} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <MenuCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
