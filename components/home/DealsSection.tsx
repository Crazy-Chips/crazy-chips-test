'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const deals = [
  { code: 'CRAZY10', discount: '10% OFF', desc: 'Any order over £8', tag: 'Always active', highlight: false },
  { code: 'NEWCUSTOMER', discount: '15% OFF', desc: 'Your very first order', tag: 'New customers', highlight: true },
]

export default function DealsSection() {
  return (
    <section id="deals" className="bg-[#FFF8EE] py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-[#D92B2B] text-xs font-[800] uppercase tracking-[0.15em] mb-1">
            🏷️ Exclusive Offers
          </p>
          <h2 className="text-4xl text-[#3D2200]" style={{ fontFamily: 'var(--font-lilita)' }}>
            Current Deals
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {deals.map((deal, i) => (
            <motion.div
              key={deal.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-[20px] p-6 border-l-[5px] ${
                deal.highlight
                  ? 'bg-[#D92B2B] border-[#B01E1E] text-white'
                  : 'bg-white border-[#D92B2B] shadow-[0_4px_20px_rgba(61,34,0,0.10)]'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`text-4xl font-[400] leading-none ${deal.highlight ? 'text-[#FFD600]' : 'text-[#D92B2B]'}`}
                  style={{ fontFamily: 'var(--font-lilita)' }}
                >
                  {deal.discount}
                </div>
                <span
                  className={`text-[11px] font-[900] px-2.5 py-1 rounded-full ${
                    deal.highlight ? 'bg-[#FFD600] text-[#3D2200]' : 'bg-[#FFD600] text-[#3D2200]'
                  }`}
                >
                  {deal.tag}
                </span>
              </div>
              <p className={`text-sm font-[600] mb-4 ${deal.highlight ? 'text-white/80' : 'text-[#8a7a6a]'}`}>
                {deal.desc}
              </p>
              <div className={`flex items-center justify-between rounded-[10px] px-3 py-2.5 ${deal.highlight ? 'bg-white/15' : 'bg-[#FFF8EE]'}`}>
                <span
                  className={`font-[400] text-lg tracking-[0.15em] ${deal.highlight ? 'text-white' : 'text-[#3D2200]'}`}
                  style={{ fontFamily: 'var(--font-lilita)' }}
                >
                  {deal.code}
                </span>
                <span className={`text-xs font-[700] ${deal.highlight ? 'text-white/60' : 'text-[#8a7a6a]'}`}>
                  Use at checkout
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-[#D92B2B] hover:bg-[#B01E1E] text-white font-[800] px-8 py-3.5 rounded-[13px] text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(217,43,43,.35)]"
          >
            Order & Save Now 🍟
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
