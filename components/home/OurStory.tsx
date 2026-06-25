'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const timeline = [
  {
    year: '2025',
    emoji: '💡',
    title: 'The Idea',
    desc: 'It all started with a simple question — why is there no proper chip shop in Derby that actually does it right? The plan was born: fresh-cut chips, smash burgers, bold flavours, and a brand that Derby could be proud of.',
  },
  {
    year: '2025',
    emoji: '📋',
    title: 'Building the Vision',
    desc: 'Months of planning, recipe testing, and sourcing the best local suppliers. Every detail was locked in — from the seasoning blend to the branding. Crazy Chips was being built the right way, from the ground up.',
  },
  {
    year: '2026',
    emoji: '🚀',
    title: 'Launch',
    desc: 'Crazy Chips opened its doors in Derby in 2026. Online ordering, in-store collection, and delivery all live from day one. The response from Derby was overwhelming — and we\'re just getting started.',
  },
  {
    year: 'Next',
    emoji: '🏆',
    title: 'Growing with Derby',
    desc: 'Rewards for loyal customers, Just Eat delivery, POS integration, and bigger things on the horizon. The goal is simple — become Derby\'s go-to chip shop and never compromise on quality.',
  },
]

export default function OurStory() {
  return (
    <section id="about" className="bg-[#3D2200] py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[#FFD600] text-xs font-[800] uppercase tracking-[0.15em] mb-2">
            Est. Derby, 2026
          </p>
          <h2 className="text-4xl sm:text-5xl text-white" style={{ fontFamily: 'var(--font-lilita)' }}>
            Our Story
          </h2>
          <p className="text-white/50 text-base font-[500] mt-3 max-w-md mx-auto">
            From a single fryer to Derby&apos;s favourite chip shop — here&apos;s how it happened.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[28px] sm:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2 hidden sm:block" />

          <div className="space-y-10">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-start gap-6 sm:gap-0 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
              >
                {/* Content */}
                <div className={`flex-1 sm:px-10 ${i % 2 === 0 ? 'sm:text-right' : 'sm:text-left'}`}>
                  <div className={`bg-[#4D2E00] rounded-[20px] p-5 inline-block w-full sm:max-w-sm ${i % 2 === 0 ? 'sm:ml-auto' : ''}`}>
                    <div className={`flex items-center gap-2 mb-2 ${i % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}>
                      <span className="text-xl">{item.emoji}</span>
                      <span className="bg-[#D92B2B] text-white text-[11px] font-[900] px-2.5 py-1 rounded-full">
                        {item.year}
                      </span>
                    </div>
                    <h3 className="text-white font-[400] text-lg mb-2" style={{ fontFamily: 'var(--font-lilita)' }}>
                      {item.title}
                    </h3>
                    <p className="text-white/60 text-sm font-[500] leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="relative z-10 hidden sm:flex items-center justify-center w-12 shrink-0">
                  <div className="w-4 h-4 bg-[#FFD600] rounded-full border-4 border-[#3D2200] shadow-lg" />
                </div>

                {/* Spacer for opposite side */}
                <div className="flex-1 hidden sm:block" />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <p className="text-white/50 text-sm font-[600] mb-5">
            Be part of the story — join thousands of happy Crazy Chips customers.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-[#FFD600] hover:bg-[#E6C000] text-[#3D2200] font-[800] px-8 py-3.5 rounded-[13px] text-sm transition-all hover:-translate-y-0.5"
          >
            Order Now 🍟
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
