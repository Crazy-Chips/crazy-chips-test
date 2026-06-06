'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function PageLoader() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Start fade-out at 1.6s, fully gone at 2s
    const fadeTimer = setTimeout(() => setFadeOut(true), 1600)
    const hideTimer = setTimeout(() => setVisible(false), 2100)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#b4252b]"
      style={{
        transition: 'opacity 0.5s ease',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      {/* Pulsing logo */}
      <div
        style={{
          animation: 'loaderPulse 0.9s ease-in-out infinite alternate',
        }}
      >
        <Image
          src="/logo.png"
          alt="Crazy Chips"
          width={140}
          height={140}
          priority
          className="object-contain drop-shadow-2xl"
        />
      </div>

      <style>{`
        @keyframes loaderPulse {
          from { transform: scale(0.92); opacity: 0.85; }
          to   { transform: scale(1.04); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
