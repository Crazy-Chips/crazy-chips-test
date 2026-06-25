'use client'

import { useState, useRef, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { toast } from 'sonner'
import { Copy, Check } from 'lucide-react'

const PRIZES = [
  { label: '5% Off', value: 5, color: '#E3000F' },
  { label: 'Free Side', value: 0, color: '#FFC72C' },
  { label: '10% Off', value: 10, color: '#E3000F' },
  { label: 'Try Again', value: -1, color: '#333333' },
  { label: '15% Off', value: 15, color: '#E3000F' },
  { label: '5% Off', value: 5, color: '#FFC72C' },
  { label: '20% Off', value: 20, color: '#E3000F' },
  { label: 'Try Again', value: -1, color: '#333333' },
]

export default function PromoPage() {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<typeof PRIZES[0] | null>(null)
  const [promoCode, setPromoCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [hasSpun, setHasSpun] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const spun = localStorage.getItem('crazy-chips-spin')
    if (spun) setHasSpun(true)
    drawWheel(0)
  }, [])

  const drawWheel = (rot: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const size = canvas.width
    const center = size / 2
    const radius = center - 10
    const sliceAngle = (2 * Math.PI) / PRIZES.length

    ctx.clearRect(0, 0, size, size)

    PRIZES.forEach((prize, i) => {
      const startAngle = rot + i * sliceAngle
      const endAngle = startAngle + sliceAngle

      ctx.beginPath()
      ctx.moveTo(center, center)
      ctx.arc(center, center, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = prize.color
      ctx.fill()
      ctx.strokeStyle = '#0A0A0A'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.save()
      ctx.translate(center, center)
      ctx.rotate(startAngle + sliceAngle / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = '#ffffff'
      ctx.font = `bold ${size / 22}px var(--font-lilita), sans-serif`
      ctx.fillText(prize.label, radius - 10, 5)
      ctx.restore()
    })

    // Center circle
    ctx.beginPath()
    ctx.arc(center, center, 22, 0, 2 * Math.PI)
    ctx.fillStyle = '#0A0A0A'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(center, center, 14, 0, 2 * Math.PI)
    ctx.fillStyle = '#E3000F'
    ctx.fill()
  }

  const spin = () => {
    if (spinning || hasSpun) return

    const extraSpins = 5 + Math.random() * 5
    const randomPrize = Math.floor(Math.random() * PRIZES.length)
    const sliceAngle = (2 * Math.PI) / PRIZES.length
    const targetAngle = extraSpins * 2 * Math.PI + (PRIZES.length - randomPrize) * sliceAngle

    setSpinning(true)
    const startTime = performance.now()
    const duration = 4000
    const startRotation = rotation

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 4)
      const currentRot = startRotation + targetAngle * ease

      setRotation(currentRot)
      drawWheel(currentRot)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setSpinning(false)
        const prize = PRIZES[randomPrize]
        setResult(prize)

        if (prize.value > 0) {
          const code = `SPIN${prize.value}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
          setPromoCode(code)
          toast.success(`You won ${prize.label}! Code: ${code}`)
        } else if (prize.value === 0) {
          const code = `FREESIDE-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
          setPromoCode(code)
          toast.success('You won a free side dish!')
        } else {
          toast('Better luck next time!')
        }

        localStorage.setItem('crazy-chips-spin', 'true')
        setHasSpun(true)
      }
    }

    requestAnimationFrame(animate)
  }

  const copyCode = () => {
    if (!promoCode) return
    navigator.clipboard.writeText(promoCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Code copied!')
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#0A0A0A] min-h-screen py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#FFC72C] text-sm font-semibold uppercase tracking-widest mb-3">
            Free Discounts
          </p>
          <h1
            className="text-5xl font-black text-white mb-6"
            style={{ fontFamily: 'var(--font-lilita)' }}
          >
            Spin the Wheel
          </h1>
          <p className="text-white/50 mb-12">
            One spin per session. Win discounts up to 20% off or a free side!
          </p>

          {/* Wheel */}
          <div className="relative inline-block mb-10">
            {/* Pointer */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[28px] border-l-transparent border-r-transparent border-b-white drop-shadow-lg" />

            <canvas
              ref={canvasRef}
              width={320}
              height={320}
              className="rounded-full shadow-2xl shadow-red-900/30"
            />
          </div>

          {/* Spin button */}
          {!hasSpun && (
            <button
              onClick={spin}
              disabled={spinning}
              className="bg-[#E3000F] hover:bg-red-700 disabled:bg-gray-700 text-white font-black text-xl px-12 py-5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100 shadow-lg shadow-red-900/40"
            >
              {spinning ? 'Spinning...' : 'SPIN!'}
            </button>
          )}

          {/* Result */}
          {result && (
            <div className="mt-10 bg-[#111111] rounded-3xl p-8 border border-white/10">
              {promoCode ? (
                <>
                  <p className="text-[#FFC72C] text-2xl font-black mb-2" style={{ fontFamily: 'var(--font-lilita)' }}>
                    You won {result.label}! 🎉
                  </p>
                  <p className="text-white/50 text-sm mb-6">Use this code at checkout:</p>
                  <div className="flex items-center justify-center gap-3">
                    <code className="bg-[#E3000F]/10 border border-[#E3000F]/30 text-white font-mono font-black text-2xl px-6 py-3 rounded-xl tracking-widest">
                      {promoCode}
                    </code>
                    <button
                      onClick={copyCode}
                      className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors"
                    >
                      {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-white/60 text-lg">Better luck next time! Come back tomorrow.</p>
              )}
            </div>
          )}

          {hasSpun && !result && (
            <div className="mt-6 text-white/40 text-sm">
              You&apos;ve already spun today. Come back tomorrow for another chance!
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
