'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
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

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const linkCls = (active: boolean) =>
    [
      'text-[13px] font-[600] no-underline px-5 py-[9px] rounded-[100px] border transition-all duration-[250ms] whitespace-nowrap',
      active
        ? 'text-[#D92B2B] bg-[#D92B2B]/[0.10] border-[#D92B2B]/25'
        : 'text-[#8a7a6a] border-transparent hover:text-[#3D2200] hover:bg-[#3D2200]/[0.07] hover:scale-[1.06]',
    ].join(' ')

  return (
    <>
      <nav
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[500] flex items-center justify-center p-2 rounded-[100px]"
        style={{
          background: 'rgba(255, 248, 238, 0.82)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: `1px solid ${scrolled ? 'rgba(61,34,0,0.18)' : 'rgba(61,34,0,0.10)'}`,
          boxShadow: scrolled
            ? '0 -2px 16px rgba(61,34,0,0.08), 0 12px 40px rgba(61,34,0,0.18), inset 0 1px 0 rgba(255,255,255,0.90)'
            : '0 -2px 16px rgba(61,34,0,0.06), 0 8px 32px rgba(61,34,0,0.14), inset 0 1px 0 rgba(255,255,255,0.80)',
        }}
      >
        {/* Mobile: horizontally scrollable, Desktop: inline */}
        <div className="flex gap-0.5 items-center overflow-x-auto scrollbar-none [-webkit-overflow-scrolling:touch] flex-nowrap max-w-[calc(100vw-32px)]">
          <Link href="/"       className={linkCls(isActive('/'))}>Home</Link>
          <Link href="/menu"   className={linkCls(isActive('/menu'))}>Menu</Link>

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className={`relative ${linkCls(false)}`}
          >
            Cart
            {itemCount > 0 && (
              <span className="absolute top-1 right-2 bg-[#D92B2B] text-white text-[9px] font-[900] rounded-full min-w-[16px] h-4 flex items-center justify-center px-[3px] border border-[#FFF8EE]">
                {itemCount}
              </span>
            )}
          </button>

          <Link href="/offers" className={linkCls(isActive('/offers'))}>Offers</Link>
          <Link
            href={session ? '/account' : '/login'}
            className={linkCls(isActive('/account') || isActive('/login') || isActive('/register'))}
          >
            {session ? 'Account' : 'Sign In'}
          </Link>
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
