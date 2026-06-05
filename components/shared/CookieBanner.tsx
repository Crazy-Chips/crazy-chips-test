'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cc-cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => { localStorage.setItem('cc-cookie-consent', 'accepted'); setVisible(false) }
  const decline = () => { localStorage.setItem('cc-cookie-consent', 'declined'); setVisible(false) }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-xl mx-auto bg-[#3D2200] rounded-[20px] px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-[0_8px_40px_rgba(61,34,0,0.35)]">
        <span className="text-2xl shrink-0">🍪</span>
        <p className="text-white/70 text-sm font-[600] leading-relaxed flex-1">
          We use cookies to keep your cart active and improve your experience.{' '}
          <Link href="/privacy" className="text-[#FFD600] hover:underline font-[700]">Privacy Policy</Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={decline}
            className="text-white/50 hover:text-white text-sm px-4 py-2 rounded-[10px] border border-white/20 hover:border-white/40 transition-colors font-[700]"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="bg-[#FFD600] hover:bg-[#E6C000] text-[#3D2200] text-sm font-[800] px-5 py-2 rounded-[10px] transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
