'use client'

import { motion } from 'framer-motion'

const steps = [
  { icon: '🍽️', num: '01', title: 'Browse the Menu', desc: 'Chips, burgers, sides, drinks and daily deals — filter by category to find your perfect meal.' },
  { icon: '✏️', num: '02', title: 'Customise Your Order', desc: 'Choose your size, pick extras and add special instructions. Every order made exactly your way.' },
  { icon: '⚡', num: '03', title: 'Fast & Fresh', desc: 'Pay securely online. Ready in 20–30 minutes — collect from our Derby shop or get it delivered.' },
]

export default function HowItWorks() {
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
            Simple as that
          </p>
          <h2 className="text-4xl text-[#3D2200]" style={{ fontFamily: 'var(--font-lilita)' }}>
            How It Works
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="bg-white rounded-[20px] p-7 shadow-[0_4px_20px_rgba(61,34,0,0.10)] relative group hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="absolute top-5 right-5 text-[4rem] font-[900] text-[#F5EDD8] leading-none select-none" style={{ fontFamily: 'var(--font-lilita)' }}>
                {step.num}
              </div>
              <div className="w-14 h-14 bg-[#FFF8EE] rounded-[14px] flex items-center justify-center text-3xl mb-5">
                {step.icon}
              </div>
              <h3 className="text-lg font-[800] text-[#3D2200] mb-2">{step.title}</h3>
              <p className="text-[#8a7a6a] text-sm leading-relaxed font-[500]">{step.desc}</p>
              <div className="mt-5 w-8 h-1 bg-[#FFD600] rounded-full group-hover:w-14 transition-all duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
