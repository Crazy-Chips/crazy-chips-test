'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Home, UtensilsCrossed, Tag, User } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useSession } from '@/lib/customer-auth-client'
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

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const linkCls = (active: boolean) =>
    [
      'flex items-center gap-1 text-[11.5px] font-[600] no-underline px-4 py-2 rounded-[100px] border transition-all duration-[250ms] whitespace-nowrap',
      active
        ? 'text-[#D92B2B] bg-[#D92B2B]/[0.10] border-[#D92B2B]/25'
        : 'text-[#8a7a6a] border-transparent hover:text-[#3D2200] hover:bg-[#3D2200]/[0.07] hover:scale-[1.04]',
    ].join(' ')

  const iconCls = 'opacity-[0.18] shrink-0'

  const isAccount = isActive('/account') || isActive('/login') || isActive('/register')

  return (
    <>
      <nav
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[500] flex items-center justify-center p-1.5 rounded-[100px] transition-all duration-200 ${cartOpen ? 'opacity-0 pointer-events-none translate-y-2' : 'opacity-100 pointer-events-auto'}`}
        style={{
          background: 'rgba(255, 248, 238, 0.85)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: `1px solid ${scrolled ? 'rgba(61,34,0,0.18)' : 'rgba(61,34,0,0.10)'}`,
          boxShadow: scrolled
            ? '0 -2px 12px rgba(61,34,0,0.08), 0 10px 32px rgba(61,34,0,0.16), inset 0 1px 0 rgba(255,255,255,0.90)'
            : '0 -2px 12px rgba(61,34,0,0.05), 0 6px 24px rgba(61,34,0,0.12), inset 0 1px 0 rgba(255,255,255,0.80)',
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
