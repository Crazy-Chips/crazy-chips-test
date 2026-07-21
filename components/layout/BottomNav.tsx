'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Home, UtensilsCrossed, Tag, User } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useSession } from 'next-auth/react'
import CartDrawer from '@/components/cart/CartDrawer'

export default function BottomNav() {
  const pathname  = usePathname()
  const itemCount = useCart((s) => s.itemCount())
  const { data: session } = useSession()

  const [cartOpen, setCartOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (pathname.startsWith('/admin')) return null

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const linkCls = (active: boolean) =>
    [
      'flex items-center gap-1.5 text-[12px] font-[800] tracking-wider uppercase no-underline px-4.5 py-2.5 rounded-[100px] transition-all duration-[250ms] whitespace-nowrap',
      active
        ? 'text-[#D92B2B] bg-[#FFF8EE] shadow-[inset_2px_2px_5px_rgba(180,160,140,0.3),_inset_-2px_-2px_5px_rgba(255,255,255,0.9)]'
        : 'text-[#8a7a6a] border-transparent hover:text-[#3D2200] hover:scale-[1.04]',
    ].join(' ')

  const iconCls = 'opacity-[0.4] shrink-0'

  const isAccount = isActive('/account') || isActive('/login') || isActive('/register')

  return (
    <>
      <nav
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[500] flex items-center justify-center p-2 rounded-[100px] transition-all duration-200 ${cartOpen ? 'opacity-0 pointer-events-none translate-y-2' : 'opacity-100 pointer-events-auto'}`}
        style={{
          background: '#FFF8EE',
          boxShadow: '10px 10px 25px rgba(180, 160, 140, 0.25), -10px -10px 25px rgba(255, 255, 255, 0.95), inset 1px 1px 1px rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
        }}
      >
        <div className="flex gap-0.5 items-center overflow-x-auto scrollbar-none [-webkit-overflow-scrolling:touch] flex-nowrap max-w-[calc(100vw-32px)]">

          <Link href="/" className={linkCls(isActive('/'))}>
            {isActive('/')  && <Home size={12} className={iconCls} />}
            Home
          </Link>

          <Link href="/menu" className={linkCls(isActive('/menu'))}>
            {isActive('/menu') && <UtensilsCrossed size={12} className={iconCls} />}
            Menu
          </Link>

          {/* Cart */}
          <button onClick={() => setCartOpen(true)} className={`relative ${linkCls(false)}`}>
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#D92B2B] text-white text-[8px] font-[900] rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-[2px] border border-[#FFF8EE]">
                {itemCount}
              </span>
            )}
          </button>

          <Link href="/offers" className={linkCls(isActive('/offers'))}>
            {isActive('/offers') && <Tag size={12} className={iconCls} />}
            Offers
          </Link>

          <Link href={session ? '/account' : '/login'} className={linkCls(isAccount)}>
            {isAccount && <User size={12} className={iconCls} />}
            {session ? 'Account' : 'Sign In'}
          </Link>

        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
