'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, UtensilsCrossed, ShoppingCart, Tag, User, ChevronUp } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useSession } from 'next-auth/react'
import CartDrawer from '@/components/cart/CartDrawer'

const homeSubLinks = [
  { href: '/#menu',     label: 'Our Menu'   },
  { href: '/#delivery', label: 'Delivery'   },
  { href: '/#deals',    label: 'Deals'      },
  { href: '/#about',    label: 'Our Story'  },
]

export default function BottomNav() {
  const pathname = usePathname()
  const itemCount = useCart((s) => s.itemCount())
  const { data: session } = useSession()
  const [cartOpen, setCartOpen] = useState(false)
  const [homeHover, setHomeHover] = useState(false)

  const isHome    = pathname === '/'
  const isMenu    = pathname.startsWith('/menu')
  const isOffers  = pathname === '/offers'
  const isAccount = pathname === '/account' || pathname === '/login' || pathname === '/register'

  const NavItem = ({
    active,
    label,
    children,
  }: {
    active: boolean
    label: string
    children: React.ReactNode
  }) => (
    <div className="flex flex-col items-center gap-0.5 relative">
      <div
        className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-300 ${
          active ? 'text-[#D92B2B]' : 'text-[#8a7a6a] hover:text-[#3D2200]'
        }`}
      >
        {active && (
          <motion.span
            layoutId="bottomNavPill"
            className="absolute inset-0 rounded-full bg-[#D92B2B]/10"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </div>
      <span className={`text-[10px] font-[700] leading-none ${active ? 'text-[#D92B2B]' : 'text-[#8a7a6a]'}`}>
        {label}
      </span>
    </div>
  )

  return (
    <>
      <nav className="fixed bottom-5 inset-x-4 z-30 flex justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="pointer-events-auto flex items-end gap-1 px-3 pt-3 pb-2 rounded-[32px] bg-white/75 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(61,34,0,0.20)]"
        >
          {/* Home — with hover sub-menu */}
          <div
            className="flex flex-col items-center gap-0.5 relative"
            onMouseEnter={() => setHomeHover(true)}
            onMouseLeave={() => setHomeHover(false)}
          >
            <AnimatePresence>
              {homeHover && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(61,34,0,0.18)] rounded-[18px] py-2 px-1 min-w-[148px] z-50"
                >
                  <p className="text-[9px] font-[900] uppercase tracking-widest text-[#c4b49a] px-3 pb-1.5">Jump to</p>
                  {homeSubLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2 px-3 py-2 rounded-[10px] text-sm font-[700] text-[#3D2200] hover:bg-[#FFF8EE] transition-colors"
                    >
                      <ChevronUp size={12} className="text-[#D92B2B] rotate-90" />
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <Link href="/" className="flex flex-col items-center gap-0.5">
              <div
                className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-300 ${
                  isHome ? 'text-[#D92B2B]' : 'text-[#8a7a6a] hover:text-[#3D2200]'
                }`}
              >
                {isHome && (
                  <motion.span
                    layoutId="bottomNavPill"
                    className="absolute inset-0 rounded-full bg-[#D92B2B]/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Home size={20} strokeWidth={isHome ? 2.4 : 2} className="relative z-10" />
              </div>
              <span className={`text-[10px] font-[700] leading-none ${isHome ? 'text-[#D92B2B]' : 'text-[#8a7a6a]'}`}>
                Home
              </span>
            </Link>
          </div>

          {/* Menu */}
          <Link href="/menu">
            <NavItem active={isMenu} label="Menu">
              <UtensilsCrossed size={20} strokeWidth={isMenu ? 2.4 : 2} />
            </NavItem>
          </Link>

          {/* Cart — elevated center */}
          <div className="flex flex-col items-center gap-0.5 -translate-y-1">
            <motion.button
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#D92B2B] text-white shadow-[0_4px_14px_rgba(217,43,43,.45)]"
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
            <span className="text-[10px] font-[700] leading-none text-[#8a7a6a]">Cart</span>
          </div>

          {/* Offers */}
          <Link href="/offers">
            <NavItem active={isOffers} label="Offers">
              <Tag size={20} strokeWidth={isOffers ? 2.4 : 2} />
            </NavItem>
          </Link>

          {/* Account */}
          <Link href={session ? '/account' : '/login'}>
            <NavItem active={isAccount} label={session ? 'Account' : 'Sign In'}>
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt=""
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <User size={20} strokeWidth={isAccount ? 2.4 : 2} />
              )}
            </NavItem>
          </Link>
        </motion.div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
