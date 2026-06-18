'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ExternalLink, Bike, ShoppingBag } from 'lucide-react'

export default function DeliverySection() {
  const justEatUrl = process.env.NEXT_PUBLIC_JUST_EAT_URL ?? 'https://www.just-eat.co.uk/restaurants-crazy-chips-littleover-de1/menu'

  return (
    <section className="bg-[#F5EDD8] py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-[#D92B2B] text-xs font-[800] uppercase tracking-[0.15em] mb-1">
            Get it your way
          </p>
          <h2 className="text-4xl text-[#3D2200]" style={{ fontFamily: 'var(--font-lilita)' }}>
            Order & Delivery
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {/* Order direct */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            <Link
              href="/menu"
              className="flex flex-col h-full bg-[#D92B2B] rounded-[20px] p-6 text-white hover:-translate-y-1 transition-all duration-200 shadow-[0_4px_20px_rgba(217,43,43,0.25)] group"
            >
              <div className="w-12 h-12 bg-white/20 rounded-[12px] flex items-center justify-center mb-4">
                <ShoppingBag size={22} className="text-white" />
              </div>
              <h3 className="text-xl font-[400] mb-2" style={{ fontFamily: 'var(--font-lilita)' }}>
                Order Direct
              </h3>
              <p className="text-white/80 text-sm font-[600] leading-relaxed flex-1">
                Order online for delivery or collection. Pay securely, no added fees, earn reward points.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-[#FFD600] font-[800] text-sm group-hover:gap-3 transition-all">
                Order now →
              </div>
            </Link>
          </motion.div>

          {/* Just Eat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
          >
            <a
              href={justEatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col h-full bg-white rounded-[20px] p-6 border-2 border-[#F5EDD8] hover:border-[#FF6900] hover:-translate-y-1 transition-all duration-200 shadow-[0_4px_20px_rgba(61,34,0,0.08)] group"
            >
              {/* Just Eat logo */}
              <div className="w-12 h-12 bg-[#FF6900] rounded-[12px] flex items-center justify-center mb-4 shrink-0">
                <Bike size={22} className="text-white" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl text-[#3D2200] font-[400]" style={{ fontFamily: 'var(--font-lilita)' }}>
                  Just Eat
                </h3>
                <span className="bg-[#FF6900] text-white text-[10px] font-[900] px-2 py-0.5 rounded-full">
                  DELIVERY
                </span>
              </div>
              <p className="text-[#8a7a6a] text-sm font-[600] leading-relaxed flex-1">
                Order through Just Eat for delivery to your door. Tracked delivery, pay your way.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-[#FF6900] font-[800] text-sm group-hover:gap-3 transition-all">
                <ExternalLink size={14} /> Open Just Eat →
              </div>
            </a>
          </motion.div>
        </div>

        {/* Info strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 mt-8 text-sm font-[700] text-[#8a7a6a]"
        >
          {[
            { icon: '⏱️', text: '20–30 min delivery' },
            { icon: '🆓', text: 'Free collection in-store' },
            { icon: '⭐', text: 'Earn points on direct orders' },
          ].map((item) => (
            <span key={item.text} className="flex items-center gap-2">
              <span>{item.icon}</span> {item.text}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
