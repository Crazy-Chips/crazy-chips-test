'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Clock, Bike } from 'lucide-react'

export default function Hero() {
  return (
    <section className="bg-[#FFF8EE] relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-[-80px] right-[-80px] w-[320px] h-[320px] bg-[#FFD600] rounded-full opacity-30 pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-[250px] h-[250px] bg-[#D92B2B] rounded-full opacity-15 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left — copy */}
          <div>
            {/* Rating badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-[#FFD600] text-[#3D2200] px-4 py-2 rounded-full text-sm font-[800] mb-6 shadow-[0_4px_14px_rgba(255,214,0,.4)]"
            >
              <Star size={14} fill="#3D2200" />
              Derby's #1 Chip Shop · 4.9★
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[clamp(2.6rem,7vw,4.5rem)] text-[#3D2200] leading-[1.05] mb-5"
              style={{ fontFamily: 'var(--font-lilita)' }}
            >
              Crispy. Loaded.
              <br />
              <span className="text-[#D92B2B]">Absolutely</span>
              <br />
              Delicious.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-[#8a7a6a] text-base sm:text-lg leading-relaxed mb-8 max-w-md font-[500]"
            >
              Hand-cut chips, smash burgers, loaded sides — made fresh to order.
              Delivery across Derby or collect in-store.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 bg-[#D92B2B] hover:bg-[#B01E1E] text-white font-[800] px-7 py-3.5 rounded-[13px] text-base transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(217,43,43,.35)]"
              >
                Order Now <ArrowRight size={18} />
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 bg-white border-2 border-[#F5EDD8] hover:bg-[#FFF8EE] text-[#3D2200] font-[800] px-7 py-3.5 rounded-[13px] text-base transition-all duration-200"
              >
                View Menu
              </Link>
            </motion.div>

            {/* Delivery / collection badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap gap-3"
            >
              <div className="flex items-center gap-2 bg-white rounded-[12px] px-4 py-2.5 shadow-[0_2px_12px_rgba(61,34,0,.08)]">
                <Clock size={16} className="text-[#D92B2B]" />
                <span className="text-sm font-[700] text-[#3D2200]">Ready in 20–30 min</span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-[12px] px-4 py-2.5 shadow-[0_2px_12px_rgba(61,34,0,.08)]">
                <Bike size={16} className="text-[#D92B2B]" />
                <span className="text-sm font-[700] text-[#3D2200]">Delivery & Collection</span>
              </div>
            </motion.div>
          </div>

          {/* Right — hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-[28px] overflow-hidden aspect-[4/3] shadow-[0_20px_60px_rgba(61,34,0,.2)]">
              <img
                src="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900&q=85"
                alt="Crazy Chips"
                className="w-full h-full object-cover"
              />
              {/* Floating stats */}
              <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                {[
                  { val: '10k+', label: 'Happy customers' },
                  { val: '4.9★', label: 'Google rating' },
                  { val: '25 min', label: 'Avg. delivery' },
                ].map((s) => (
                  <div key={s.label} className="flex-1 bg-white/90 backdrop-blur-sm rounded-[14px] p-3 text-center shadow-sm">
                    <div className="text-lg font-[800] text-[#D92B2B]" style={{ fontFamily: 'var(--font-lilita)' }}>
                      {s.val}
                    </div>
                    <div className="text-[10px] font-[700] text-[#8a7a6a] uppercase tracking-wide mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating logo badge */}
            <div className="absolute -top-5 -right-5 w-20 h-20 rounded-2xl shadow-[0_8px_24px_rgba(61,34,0,0.25)] rotate-6 overflow-hidden">
              <Image src="/logo.png" alt="Crazy Chips" width={80} height={80} className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
