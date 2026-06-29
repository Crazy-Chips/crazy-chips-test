'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Home, UtensilsCrossed, ShoppingCart, User } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useSession } from 'next-auth/react'
import CartDrawer from '@/components/cart/CartDrawer'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const itemCount = useCart((s) => s.itemCount())
  const { data: session } = useSession()
  const [cartOpen, setCartOpen] = useState(false)

  const isHome = pathname === '/'
  const isMenu = pathname.startsWith('/menu')
  const isAccount = pathname === '/account' || pathname === '/login' || pathname === '/register'

  return (
    <>
      <nav className="md:hidden fixed bottom-5 inset-x-4 z-30 flex justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1 px-2.5 py-2.5 rounded-full bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(61,34,0,0.20)]">
          <Link
            href="/"
            aria-label="Home"
            className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
              isHome ? 'bg-[#D92B2B]/10 text-[#D92B2B]' : 'text-[#8a7a6a]'
            }`}
          >
            <Home size={20} strokeWidth={isHome ? 2.4 : 2} />
          </Link>

          <Link
            href="/menu"
            aria-label="Menu"
            className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
              isMenu ? 'bg-[#D92B2B]/10 text-[#D92B2B]' : 'text-[#8a7a6a]'
            }`}
          >
            <UtensilsCrossed size={20} strokeWidth={isMenu ? 2.4 : 2} />
          </Link>

          <button
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#D92B2B] text-white shadow-[0_4px_14px_rgba(217,43,43,.45)] -translate-y-1 transition-transform active:scale-95"
          >
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FFD600] text-[#3D2200] text-[10px] font-[900] rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 border-2 border-white">
                {itemCount}
              </span>
            )}
          </button>

          <Link
            href="/#deals"
            aria-label="Deals"
            className="flex items-center justify-center w-12 h-12 rounded-full text-[#8a7a6a] transition-all"
          >
            <span className="text-lg">🏷️</span>
          </Link>

          <Link
            href={session ? '/account' : '/login'}
            aria-label="Account"
            className={`flex items-center justify-center w-12 h-12 rounded-full overflow-hidden transition-all ${
              isAccount ? 'bg-[#D92B2B]/10 text-[#D92B2B]' : 'text-[#8a7a6a]'
            }`}
          >
            {session?.user?.image ? (
              <Image src={session.user.image} alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <User size={20} strokeWidth={isAccount ? 2.4 : 2} />
            )}
          </Link>
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
