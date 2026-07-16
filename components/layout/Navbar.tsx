import Link from 'next/link'
import Image from 'next/image'
import { MapPin } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 bg-[#b4252b] shadow-[0_2px_12px_rgba(180,37,43,0.4)]">
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
      <div className="bg-[#8f1a1f] border-t border-white/10 hidden md:block">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-center gap-2">
          <MapPin size={12} className="text-[#FFD600]" />
          <span className="text-white/70 text-xs font-[600]">
            123 Market Place, Derby DE1 1AA · 01332 123456 · Mon–Sat 11:00–23:00 · Sun 12:00–21:00
          </span>
        </div>
      </div>
    </nav>
  )
}
