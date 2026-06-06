'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ShoppingCart, Menu, X, MapPin, User } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useSession } from 'next-auth/react'
import CartDrawer from '@/components/cart/CartDrawer'

export default function Navbar() {
  const itemCount = useCart((s) => s.itemCount())
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#b4252b] shadow-[0_2px_12px_rgba(180,37,43,0.4)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Crazy Chips"
                width={44}
                height={44}
                priority
                className="object-contain"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { href: '/menu', label: 'Menu' },
                { href: '/#deals', label: 'Deals' },
                { href: '/#about', label: 'About' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/80 hover:text-white text-sm font-[700] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/menu"
                className="hidden sm:flex items-center gap-2 bg-[#FFD600] hover:bg-[#E6C000] text-[#3D2200] text-sm font-[800] px-4 py-2 rounded-[10px] transition-all duration-200"
              >
                Order Now
              </Link>

              {/* Account / Login */}
              {session ? (
                <Link
                  href="/account"
                  className="flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full w-9 h-9 transition-all overflow-hidden"
                  aria-label="My account"
                >
                  {session.user?.image ? (
                    <Image src={session.user.image} alt="" width={36} height={36} className="w-full h-full object-cover" />
                  ) : (
                    <User size={16} className="text-white" />
                  )}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-[700] transition-colors"
                >
                  <User size={15} />
                  Sign In
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="flex items-center gap-1.5 bg-[#FFD600] hover:bg-[#E6C000] text-[#3D2200] font-[800] text-sm px-3 py-2 rounded-[10px] transition-all relative"
                aria-label="Open cart"
              >
                <ShoppingCart size={16} />
                <span>Cart</span>
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#3D2200] text-white text-[10px] font-[900] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {itemCount}
                  </span>
                )}
              </button>

              <button
                className="md:hidden text-white p-2"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#8f1a1f] px-4 py-4 flex flex-col gap-4">
            {[
              { href: '/menu', label: '🍟 Menu' },
              { href: '/#deals', label: '🏷️ Deals' },
              { href: '/#about', label: '📍 About' },
              { href: session ? '/account' : '/login', label: session ? `👤 ${session.user?.name ?? 'Account'}` : '👤 Sign In' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white font-[700] text-base py-1"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/menu"
              className="mt-1 bg-[#FFD600] text-[#3D2200] font-[800] text-center py-3 rounded-[12px]"
              onClick={() => setMobileOpen(false)}
            >
              Order Now
            </Link>
          </div>
        )}

        {/* Location bar */}
        <div className="bg-[#8f1a1f] border-t border-white/10 hidden md:block">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-1.5 flex items-center gap-2">
            <MapPin size={12} className="text-[#FFD600]" />
            <span className="text-white/70 text-xs font-[600]">
              123 Market Place, Derby DE1 1AA · 01332 123456 · Mon–Sat 11:00–23:00 · Sun 12:00–21:00
            </span>
          </div>
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
