'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Home, UtensilsCrossed, ShoppingCart, User } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useSession } from 'next-auth/react'
import CartDrawer from '@/components/cart/CartDrawer'

export default function BottomNav() {
  const pathname = usePathname()
  const itemCount = useCart((s) => s.itemCount())
  const { data: session } = useSession()
  const [cartOpen, setCartOpen] = useState(false)

  const isHome = pathname === '/'
  const isMenu = pathname.startsWith('/menu')
  const isAccount = pathname === '/account' || pathname === '/login' || pathname === '/register'

  const tabClass = (active: boolean) =>
    `relative flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-300 ${
      active ? 'text-[#D92B2B]' : 'text-[#8a7a6a] hover:text-[#3D2200]'
    }`

  return (
    <>
      <nav className="fixed bottom-5 inset-x-4 z-30 flex justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="pointer-events-auto flex items-center gap-1 px-2.5 py-2.5 rounded-full bg-white/75 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(61,34,0,0.20)]"
        >
          <Link href="/" aria-label="Home" className={tabClass(isHome)}>
            {isHome && (
              <motion.span
                layoutId="bottomNavActivePill"
                className="absolute inset-0 rounded-full bg-[#D92B2B]/10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Home size={20} strokeWidth={isHome ? 2.4 : 2} className="relative z-10 transition-transform duration-300 active:scale-90" />
          </Link>

          <Link href="/menu" aria-label="Menu" className={tabClass(isMenu)}>
            {isMenu && (
              <motion.span
                layoutId="bottomNavActivePill"
                className="absolute inset-0 rounded-full bg-[#D92B2B]/10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <UtensilsCrossed size={20} strokeWidth={isMenu ? 2.4 : 2} className="relative z-10 transition-transform duration-300 active:scale-90" />
          </Link>

          <motion.button
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#D92B2B] text-white shadow-[0_4px_14px_rgba(217,43,43,.45)] -translate-y-1"
          >
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                className="absolute -top-1 -right-1 bg-[#FFD600] text-[#3D2200] text-[10px] font-[900] rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 border-2 border-white"
              >
                {itemCount}
              </motion.span>
            )}
          </motion.button>

          <Link href="/#deals" aria-label="Deals" className={tabClass(false)}>
            <span className="relative z-10 text-lg">🏷️</span>
          </Link>

          <Link href={session ? '/account' : '/login'} aria-label="Account" className={tabClass(isAccount)}>
            {isAccount && (
              <motion.span
                layoutId="bottomNavActivePill"
                className="absolute inset-0 rounded-full bg-[#D92B2B]/10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full overflow-hidden">
              {session?.user?.image ? (
                <Image src={session.user.image} alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <User size={20} strokeWidth={isAccount ? 2.4 : 2} />
              )}
            </span>
          </Link>
        </motion.div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
