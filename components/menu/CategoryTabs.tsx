'use client'

const CATEGORIES = ['All', 'Chips', 'Burgers', 'Sides', 'Drinks', 'Combos', 'Deals']

interface Props {
  active: string
  onChange: (cat: string) => void
}

export default function CategoryTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`shrink-0 px-4 py-2 rounded-full text-xs font-[700] border-2 transition-all duration-200 ${
            active === cat
              ? 'bg-[#D92B2B] text-white border-[#D92B2B]'
              : 'bg-white text-[#3D2200] border-[#F5EDD8] hover:border-[#D92B2B] hover:text-[#D92B2B]'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
