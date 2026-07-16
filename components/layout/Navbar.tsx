import Link from 'next/link'
import Image from 'next/image'
import { MapPin } from 'lucide-react'

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-40"
      style={{
        background: 'rgba(20, 20, 22, 0.90)',
        backdropFilter: 'blur(40px) saturate(200%)',
        WebkitBackdropFilter: 'blur(40px) saturate(200%)',
        borderBottom: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center h-[72px]">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Crazy Chips"
              width={62}
              height={62}
              priority
              className="object-contain"
            />
          </Link>
        </div>
      </div>

      {/* Location bar */}
      <div
        className="hidden md:block border-t"
        style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(10,10,12,0.60)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-center gap-2">
          <MapPin size={12} className="text-[#D92B2B]" />
          <span className="text-white/50 text-xs font-[600]">
            123 Market Place, Derby DE1 1AA · 01332 123456 · Mon–Sat 11:00–23:00 · Sun 12:00–21:00
          </span>
        </div>
      </div>
    </nav>
  )
}
