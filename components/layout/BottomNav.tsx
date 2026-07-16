'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
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
  const openTimer    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mobileTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTouchRef   = useRef(false)

  useEffect(() => {
    isTouchRef.current = window.matchMedia('(hover: none)').matches
  }, [])

  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome    = pathname === '/'
  const isMenu    = pathname.startsWith('/menu')
  const isOffers  = pathname === '/offers'
  const isAccount = pathname === '/account' || pathname === '/login' || pathname === '/register'

  const cancelClose       = () => { if (closeTimer.current)  clearTimeout(closeTimer.current)  }
  const cancelOpen        = () => { if (openTimer.current)   clearTimeout(openTimer.current)   }
  const cancelMobileTimer = () => { if (mobileTimer.current) clearTimeout(mobileTimer.current) }

  const startMobileTimer = () => {
    cancelMobileTimer()
    mobileTimer.current = setTimeout(() => setHomeHover(false), 10000)
  }

  const handleNavEnter = () => {
    cancelClose()
    setNavExpanded(true)
  }
  const handleNavLeave = () => {
    cancelOpen()
    cancelMobileTimer()
    // grace period so mouse can move to the popup above without it vanishing
    closeTimer.current = setTimeout(() => {
      setNavExpanded(false)
      setHomeHover(false)
    }, 120)
  }

  const handleHomeEnter = () => {
    cancelClose()
    cancelOpen()
    openTimer.current = setTimeout(() => {
      setHomeHover(true)
      if (isTouchRef.current) startMobileTimer()
    }, 500)
  }
  const handleHomeLeave = () => {
    cancelOpen()
    cancelMobileTimer()
    closeTimer.current = setTimeout(() => setHomeHover(false), 120)
  }

  // keep popup alive while mouse is over it
  const handlePopupEnter = () => { cancelClose(); cancelOpen() }
  const handlePopupLeave = () => {
    closeTimer.current = setTimeout(() => setHomeHover(false), 120)
  }

  const iconClass = (active: boolean) =>
    `relative flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-300 ${
      active ? 'text-[#D92B2B]' : 'text-white/40 hover:text-white/80'
    }`

  const labelVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: { opacity: 1, height: 'auto', marginTop: 2 },
  }

  return (
    <>
      <nav className="fixed bottom-5 inset-x-4 z-30 flex justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20, columnGap: 4, paddingLeft: 12, paddingRight: 12 }}
          animate={{
            opacity: 1,
            y: 0,
            columnGap: navExpanded ? 14 : 4,
            paddingLeft: navExpanded ? 20 : 12,
            paddingRight: navExpanded ? 20 : 12,
          }}
          transition={{ opacity: { duration: 0.4 }, y: { duration: 0.4 }, columnGap: { type: 'spring', stiffness: 320, damping: 28 }, paddingLeft: { type: 'spring', stiffness: 320, damping: 28 }, paddingRight: { type: 'spring', stiffness: 320, damping: 28 } }}
          onMouseEnter={handleNavEnter}
          onMouseLeave={handleNavLeave}
          className="pointer-events-auto flex items-end pt-3 pb-2 rounded-[100px]"
          style={{
            background: 'rgba(20, 20, 22, 0.90)',
            backdropFilter: 'blur(40px) saturate(200%)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%)',
            border: `1px solid ${scrolled ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.12)'}`,
            boxShadow: scrolled
              ? '0 -4px 24px rgba(0,0,0,0.2), 0 12px 48px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.12)'
              : '0 -4px 24px rgba(0,0,0,0.2), 0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)',
          }}
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
                  className="absolute bottom-full left-0 mb-2 z-50 min-w-[148px]"
                  onMouseEnter={handlePopupEnter}
                  onMouseLeave={handlePopupLeave}
                >
                  <div className="rounded-[18px] py-2 px-1" style={{ background: 'rgba(20,20,22,0.92)', backdropFilter: 'blur(40px) saturate(200%)', WebkitBackdropFilter: 'blur(40px) saturate(200%)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
                    <p className="text-[9px] font-[900] uppercase tracking-widest text-white/30 px-3 pb-1.5">Jump to</p>
                    {homeSubLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-2 px-3 py-2 rounded-[10px] text-sm font-[700] text-white/80 hover:text-white hover:bg-white/[0.08] transition-colors"
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
                  <motion.span layoutId="navPill" className="absolute inset-0 rounded-full bg-[#D92B2B]/20 border border-[#D92B2B]/30"
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
                    className={`text-[10px] font-[700] leading-none overflow-hidden ${isHome ? 'text-[#D92B2B]' : 'text-white/40'}`}
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
                <motion.span layoutId="navPill" className="absolute inset-0 rounded-full bg-[#D92B2B]/20 border border-[#D92B2B]/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              <UtensilsCrossed size={19} strokeWidth={isMenu ? 2.4 : 2} className="relative z-10" />
            </div>
            <AnimatePresence>
              {navExpanded && (
                <motion.span key="label-menu" variants={labelVariants} initial="hidden" animate="visible" exit="hidden"
                  transition={{ duration: 0.18 }}
                  className={`text-[10px] font-[700] leading-none overflow-hidden ${isMenu ? 'text-[#D92B2B]' : 'text-white/40'}`}>
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
                  className="absolute -top-1 -right-1 bg-[#FFD600] text-[#3D2200] text-[10px] font-[900] rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 border-2 border-[#141416]">
                  {itemCount}
                </motion.span>
              )}
            </motion.button>
            <AnimatePresence>
              {navExpanded && (
                <motion.span key="label-cart" variants={labelVariants} initial="hidden" animate="visible" exit="hidden"
                  transition={{ duration: 0.18 }}
                  className="text-[10px] font-[700] leading-none overflow-hidden text-white/40">
                  Cart
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* ── Offers ── */}
          <Link href="/offers" className="flex flex-col items-center">
            <div className={iconClass(isOffers)}>
              {isOffers && (
                <motion.span layoutId="navPill" className="absolute inset-0 rounded-full bg-[#D92B2B]/20 border border-[#D92B2B]/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              <Tag size={19} strokeWidth={isOffers ? 2.4 : 2} className="relative z-10" />
            </div>
            <AnimatePresence>
              {navExpanded && (
                <motion.span key="label-offers" variants={labelVariants} initial="hidden" animate="visible" exit="hidden"
                  transition={{ duration: 0.18 }}
                  className={`text-[10px] font-[700] leading-none overflow-hidden ${isOffers ? 'text-[#D92B2B]' : 'text-white/40'}`}>
                  Offers
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* ── Account ── */}
          <Link href={session ? '/account' : '/login'} className="flex flex-col items-center">
            <div className={iconClass(isAccount)}>
              {isAccount && (
                <motion.span layoutId="navPill" className="absolute inset-0 rounded-full bg-[#D92B2B]/20 border border-[#D92B2B]/30"
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
                  className={`text-[10px] font-[700] leading-none overflow-hidden ${isAccount ? 'text-[#D92B2B]' : 'text-white/40'}`}>
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
