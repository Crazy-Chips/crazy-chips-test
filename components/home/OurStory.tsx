'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const timeline = [
  {
    year: '2018',
    emoji: '💡',
    title: 'The Idea',
    desc: 'Two friends in Derby with a simple dream — serve the crispiest, most satisfying chips the city had ever tasted. Started with a fryer, a recipe, and a whole lot of ambition.',
  },
  {
    year: '2019',
    emoji: '🏪',
    title: 'Opening Day',
    desc: 'Crazy Chips opened its doors on Market Place, Derby. The queue stretched round the corner on day one — and we ran out of chips by 4pm. We knew we were onto something.',
  },
  {
    year: '2021',
    emoji: '📱',
    title: 'Going Online',
    desc: 'We launched online ordering so Derby could enjoy Crazy Chips without leaving their sofa. Delivery times, tracking, and the same fresh food — now a tap away.',
  },
  {
    year: '2023',
    emoji: '🏆',
    title: 'Derby\'s Favourite',
    desc: 'Voted Derby\'s best chip shop. Over 10,000 happy customers, a 4.9★ rating, and a menu that keeps growing. The smash burger became the city\'s most talked-about meal.',
  },
  {
    year: '2025',
    emoji: '🚀',
    title: 'What\'s Next',
    desc: 'Rewards for loyal customers, Just Eat delivery, and bigger things on the horizon. We\'re still the same Crazy Chips — just growing alongside Derby.',
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
            Est. Derby, 2018
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
