'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function SpinWheelTeaser() {
  return (
    <section className="bg-[#FAF7F2] py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A0A0A] rounded-3xl overflow-hidden relative">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#E3000F]/20 to-[#FFC72C]/10" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Text side */}
            <div className="p-12 lg:p-16 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-[#FFC72C] text-sm font-semibold uppercase tracking-widest mb-3">
                  Free Prizes
                </p>
                <h2
                  className="text-4xl sm:text-5xl font-black text-white mb-6"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  Spin the Wheel,
                  <br />
                  <span style={{ color: '#E3000F' }}>Win a Deal</span>
                </h2>
                <p className="text-white/60 text-base leading-relaxed mb-8 max-w-sm">
                  Give the wheel a spin and win instant discounts — 5%, 10%, 15% off, or a free side dish.
                  One spin per visit. Could be your lucky day.
                </p>
                <Link
                  href="/promo"
                  className="inline-flex items-center gap-2 bg-[#E3000F] hover:bg-red-700 text-white font-bold px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-red-900/40"
                >
                  Try Your Luck <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>

            {/* Wheel side */}
            <div className="flex items-center justify-center p-12 lg:p-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="relative w-48 h-48 sm:w-64 sm:h-64"
              >
                {/* Decorative wheel */}
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                  {['#E3000F', '#FFC72C', '#E3000F', '#fff', '#E3000F', '#FFC72C', '#E3000F', '#fff'].map(
                    (color, i) => {
                      const angle = (i / 8) * 360
                      const rad = (angle * Math.PI) / 180
                      const nextRad = (((i + 1) / 8) * 360 * Math.PI) / 180
                      const x1 = 100 + 90 * Math.cos(rad)
                      const y1 = 100 + 90 * Math.sin(rad)
                      const x2 = 100 + 90 * Math.cos(nextRad)
                      const y2 = 100 + 90 * Math.sin(nextRad)
                      return (
                        <path
                          key={i}
                          d={`M 100 100 L ${x1} ${y1} A 90 90 0 0 1 ${x2} ${y2} Z`}
                          fill={color}
                          stroke="#0A0A0A"
                          strokeWidth="2"
                        />
                      )
                    }
                  )}
                  <circle cx="100" cy="100" r="20" fill="#0A0A0A" />
                  <circle cx="100" cy="100" r="12" fill="#E3000F" />
                </svg>
                {/* Center pin */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[20px] border-l-transparent border-r-transparent border-b-white" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
