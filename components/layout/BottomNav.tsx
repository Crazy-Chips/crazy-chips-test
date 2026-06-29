'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, UtensilsCrossed, ShoppingCart, Tag, User, ChevronRight } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useSession } from 'next-auth/react'
import CartDrawer from '@/components/cart/CartDrawer'

const homeSubLinks = [
  { href: '/#menu',     label: 'Our Menu'  },
  { href: '/#delivery', label: 'Delivery'  },
  { href: '/#deals',    label: 'Deals'     },
  { href: '/#about',    label: 'Our Story' },
]

export default function BottomNav() {
  const pathname   = usePathname()
  const itemCount  = useCart((s) => s.itemCount())
  const { data: session } = useSession()

  const [cartOpen,    setCartOpen]    = useState(false)
  const [navExpanded, setNavExpanded] = useState(false)
  const [homeHover,   setHomeHover]   = useState(false)
  const homeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isHome    = pathname === '/'
  const isMenu    = pathname.startsWith('/menu')
  const isOffers  = pathname === '/offers'
  const isAccount = pathname === '/account' || pathname === '/login' || pathname === '/register'

  const handleNavEnter = () => setNavExpanded(true)
  const handleNavLeave = () => {
    setNavExpanded(false)
    if (homeTimer.current) clearTimeout(homeTimer.current)
    setHomeHover(false)
  }

  const handleHomeEnter = () => {
    homeTimer.current = setTimeout(() => setHomeHover(true), 1400)
  }
  const handleHomeLeave = () => {
    if (homeTimer.current) clearTimeout(homeTimer.current)
    setHomeHover(false)
  }

  const iconClass = (active: boolean) =>
    `relative flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-300 ${
      active ? 'text-[#D92B2B]' : 'text-[#8a7a6a] hover:text-[#3D2200]'
    }`

  const labelVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: { opacity: 1, height: 'auto', marginTop: 2 },
  }

  return (
    <>
      <nav className="fixed bottom-5 inset-x-4 z-30 flex justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          onMouseEnter={handleNavEnter}
          onMouseLeave={handleNavLeave}
          className="pointer-events-auto flex items-end gap-1 px-3 pt-3 pb-2 rounded-[32px] bg-white/75 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(61,34,0,0.20)]"
        >
          {/* ── Home ── */}
          <div
            className="flex flex-col items-center"
            onMouseEnter={handleHomeEnter}
            onMouseLeave={handleHomeLeave}
          >
            <AnimatePresence>
              {homeHover && navExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  className="absolute bottom-full left-0 pb-3 z-50 min-w-[148px]"
                >
                  <div className="bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(61,34,0,0.18)] rounded-[18px] py-2 px-1">
                    <p className="text-[9px] font-[900] uppercase tracking-widest text-[#c4b49a] px-3 pb-1.5">Jump to</p>
                    {homeSubLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-2 px-3 py-2 rounded-[10px] text-sm font-[700] text-[#3D2200] hover:bg-[#FFF8EE] transition-colors"
                      >
                        <ChevronRight size={12} className="text-[#D92B2B]" />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Link href="/" className="flex flex-col items-center">
              <div className={iconClass(isHome)}>
                {isHome && (
                  <motion.span layoutId="navPill" className="absolute inset-0 rounded-full bg-[#D92B2B]/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                )}
                <Home size={19} strokeWidth={isHome ? 2.4 : 2} className="relative z-10" />
              </div>
              <AnimatePresence>
                {navExpanded && (
                  <motion.span
                    key="label-home"
                    variants={labelVariants}
                    initial="hidden" animate="visible" exit="hidden"
                    transition={{ duration: 0.18 }}
                    className={`text-[10px] font-[700] leading-none overflow-hidden ${isHome ? 'text-[#D92B2B]' : 'text-[#8a7a6a]'}`}
                  >
                    Home
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* ── Menu ── */}
          <Link href="/menu" className="flex flex-col items-center">
            <div className={iconClass(isMenu)}>
              {isMenu && (
                <motion.span layoutId="navPill" className="absolute inset-0 rounded-full bg-[#D92B2B]/10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              <UtensilsCrossed size={19} strokeWidth={isMenu ? 2.4 : 2} className="relative z-10" />
            </div>
            <AnimatePresence>
              {navExpanded && (
                <motion.span key="label-menu" variants={labelVariants} initial="hidden" animate="visible" exit="hidden"
                  transition={{ duration: 0.18 }}
                  className={`text-[10px] font-[700] leading-none overflow-hidden ${isMenu ? 'text-[#D92B2B]' : 'text-[#8a7a6a]'}`}>
                  Menu
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* ── Cart (elevated centre) ── */}
          <div className="flex flex-col items-center -translate-y-1">
            <motion.button
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="relative flex items-center justify-center w-13 h-13 w-[52px] h-[52px] rounded-full bg-[#D92B2B] text-white shadow-[0_4px_14px_rgba(217,43,43,.45)]"
            >
              <ShoppingCart size={21} />
              {itemCount > 0 && (
                <motion.span key={itemCount} initial={{ scale: 0.6 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="absolute -top-1 -right-1 bg-[#FFD600] text-[#3D2200] text-[10px] font-[900] rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 border-2 border-white">
                  {itemCount}
                </motion.span>
              )}
            </motion.button>
            <AnimatePresence>
              {navExpanded && (
                <motion.span key="label-cart" variants={labelVariants} initial="hidden" animate="visible" exit="hidden"
                  transition={{ duration: 0.18 }}
                  className="text-[10px] font-[700] leading-none overflow-hidden text-[#8a7a6a]">
                  Cart
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* ── Offers ── */}
          <Link href="/offers" className="flex flex-col items-center">
            <div className={iconClass(isOffers)}>
              {isOffers && (
                <motion.span layoutId="navPill" className="absolute inset-0 rounded-full bg-[#D92B2B]/10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              <Tag size={19} strokeWidth={isOffers ? 2.4 : 2} className="relative z-10" />
            </div>
            <AnimatePresence>
              {navExpanded && (
                <motion.span key="label-offers" variants={labelVariants} initial="hidden" animate="visible" exit="hidden"
                  transition={{ duration: 0.18 }}
                  className={`text-[10px] font-[700] leading-none overflow-hidden ${isOffers ? 'text-[#D92B2B]' : 'text-[#8a7a6a]'}`}>
                  Offers
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* ── Account ── */}
          <Link href={session ? '/account' : '/login'} className="flex flex-col items-center">
            <div className={iconClass(isAccount)}>
              {isAccount && (
                <motion.span layoutId="navPill" className="absolute inset-0 rounded-full bg-[#D92B2B]/10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              <span className="relative z-10 flex items-center justify-center">
                {session?.user?.image ? (
                  <Image src={session.user.image} alt="" width={28} height={28} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <User size={19} strokeWidth={isAccount ? 2.4 : 2} />
                )}
              </span>
            </div>
            <AnimatePresence>
              {navExpanded && (
                <motion.span key="label-account" variants={labelVariants} initial="hidden" animate="visible" exit="hidden"
                  transition={{ duration: 0.18 }}
                  className={`text-[10px] font-[700] leading-none overflow-hidden ${isAccount ? 'text-[#D92B2B]' : 'text-[#8a7a6a]'}`}>
                  {session ? 'Account' : 'Sign In'}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </motion.div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
