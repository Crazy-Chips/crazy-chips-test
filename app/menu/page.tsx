'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CategoryTabs from '@/components/menu/CategoryTabs'
import MenuCard from '@/components/menu/MenuCard'
import type { MenuItem } from '@/types'

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    fetch('/api/menu')
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered =
    activeCategory === 'All'
      ? items
      : items.filter((i) => i.category.toLowerCase() === activeCategory.toLowerCase())

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#FFF8EE] min-h-screen">
        {/* Header */}
        <div className="bg-[#D92B2B] py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="text-white/70 text-xs font-[800] uppercase tracking-[0.15em] mb-1">
              What we serve
            </p>
            <h1
              className="text-5xl text-white"
              style={{ fontFamily: 'var(--font-lilita)' }}
            >
              Our Menu 🍟
            </h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Sticky category filter */}
          <div className="sticky top-[90px] z-30 bg-[#FFF8EE]/95 backdrop-blur-sm py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 mb-6 border-b border-[#F5EDD8]">
            <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-[18px] h-72 animate-pulse shadow-[0_4px_20px_rgba(61,34,0,0.08)]" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-6xl mb-4">🍟</p>
              <p className="text-[#8a7a6a] font-[700]">No items in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
