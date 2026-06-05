'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Package, LogOut, User, Star, ChevronRight } from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  total: number
  status: string
  type: string
  createdAt: string
  items: Array<{ quantity: number; menuItem: { name: string } }>
}

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-yellow-100 text-yellow-700',
  READY: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-[#FFF8EE] text-[#8a7a6a]',
  CANCELLED: 'bg-red-100 text-red-600',
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/account')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/customer/orders?email=${encodeURIComponent(session.user.email)}`)
        .then((r) => r.json())
        .then((data) => {
          setOrders(Array.isArray(data) ? data : [])
          setLoadingOrders(false)
        })
        .catch(() => setLoadingOrders(false))
    }
  }, [session])

  if (status === 'loading') {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-[#FFF8EE] py-32">
          <div className="w-8 h-8 border-4 border-[#D92B2B] border-t-transparent rounded-full animate-spin" />
        </main>
      </>
    )
  }

  if (!session) return null

  const user = session.user

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#FFF8EE] py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          {/* Profile card */}
          <div className="bg-gradient-to-br from-[#D92B2B] to-[#8f1a1f] rounded-[24px] p-6 sm:p-8 mb-6 relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] text-[120px] opacity-[0.06] select-none">★</div>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                {user.image ? (
                  <Image src={user.image} alt={user.name ?? ''} width={64} height={64} className="w-full h-full object-cover" />
                ) : (
                  <User size={28} className="text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl text-white font-[400]" style={{ fontFamily: 'var(--font-lilita)' }}>
                  {user.name ?? 'Welcome!'}
                </h1>
                <p className="text-white/70 text-sm font-[600] mt-0.5">{user.email}</p>
                <span className="inline-block mt-2 bg-[#FFD600] text-[#3D2200] text-[11px] font-[900] px-2.5 py-1 rounded-full">
                  {orders.length > 0 ? `${orders.length} order${orders.length !== 1 ? 's' : ''}` : 'New customer'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(61,34,0,0.10)] mb-6 overflow-hidden">
            {[
              { icon: Package, label: 'My Orders', sub: `${orders.length} total orders`, href: '#orders' },
              { icon: Star, label: 'Deals & Promos', sub: 'Check your available offers', href: '/#deals' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-4 px-5 py-4 border-b border-[#F5EDD8] last:border-0 hover:bg-[#FFF8EE] transition-colors"
              >
                <div className="w-10 h-10 bg-[#FFF8EE] rounded-[10px] flex items-center justify-center">
                  <item.icon size={18} className="text-[#D92B2B]" />
                </div>
                <div className="flex-1">
                  <p className="font-[800] text-[#3D2200] text-sm">{item.label}</p>
                  <p className="text-[#8a7a6a] text-xs font-[600] mt-0.5">{item.sub}</p>
                </div>
                <ChevronRight size={16} className="text-[#8a7a6a]" />
              </Link>
            ))}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-red-50 transition-colors"
            >
              <div className="w-10 h-10 bg-red-50 rounded-[10px] flex items-center justify-center">
                <LogOut size={18} className="text-[#D92B2B]" />
              </div>
              <span className="flex-1 text-left font-[800] text-[#D92B2B] text-sm">Sign Out</span>
            </button>
          </div>

          {/* Orders */}
          <div id="orders">
            <h2 className="text-2xl text-[#3D2200] mb-4" style={{ fontFamily: 'var(--font-lilita)' }}>
              Order History
            </h2>

            {loadingOrders ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-[18px] h-24 animate-pulse shadow-[0_4px_20px_rgba(61,34,0,0.08)]" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-[20px] p-10 text-center shadow-[0_4px_20px_rgba(61,34,0,0.08)]">
                <div className="text-5xl mb-3">🍟</div>
                <p className="text-[#3D2200] font-[800] text-base mb-2">No orders yet</p>
                <p className="text-[#8a7a6a] text-sm font-[600] mb-5">Your order history will appear here</p>
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 bg-[#D92B2B] hover:bg-[#B01E1E] text-white font-[800] px-6 py-3 rounded-[12px] text-sm transition-colors"
                >
                  Browse Menu
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-[18px] p-5 shadow-[0_4px_20px_rgba(61,34,0,0.08)]">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="font-[900] text-[#3D2200] font-mono">{order.orderNumber}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-[900] px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status]}`}>
                            {order.status}
                          </span>
                          <span className={`text-[10px] font-[700] px-2 py-0.5 rounded-full ${
                            order.type === 'DELIVERY' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                          }`}>
                            {order.type}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xl text-[#D92B2B]" style={{ fontFamily: 'var(--font-lilita)' }}>
                          £{order.total.toFixed(2)}
                        </span>
                        <p className="text-[#8a7a6a] text-xs font-[600] mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-[#8a7a6a] font-[600]">
                      {order.items.map((i) => `${i.quantity}× ${i.menuItem.name}`).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
