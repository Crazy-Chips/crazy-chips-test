'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  total: number
  type: string
  status: string
  items: Array<{ quantity: number; menuItem: { name: string } }>
  createdAt: string
  notes?: string
}

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-yellow-100 text-yellow-700',
  READY: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-gray-100 text-gray-500',
  CANCELLED: 'bg-red-100 text-red-700',
}

const NEXT_STATUS: Record<string, string> = {
  NEW: 'PREPARING',
  PREPARING: 'READY',
  READY: 'COMPLETED',
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/orders?status=NEW,PREPARING,READY')
      const data = await res.json()
      setOrders(Array.isArray(data) ? data.filter((o: Order) => ['NEW', 'PREPARING', 'READY'].includes(o.status)) : [])
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchOrders()

    // Poll every 15 seconds as Pusher fallback
    const interval = setInterval(fetchOrders, 15000)

    // Pusher real-time
    let cleanup: (() => void) | null = null
    import('@/lib/pusher-client').then(({ pusherClient }) => {
      const channel = pusherClient.subscribe('private-orders')
      channel.bind('new-order', (data: Order) => {
        setOrders((prev) => [data, ...prev])
        const audio = new Audio('/sounds/new-order.mp3')
        audio.play().catch(() => {})
        toast('New order received!', { description: `${data.orderNumber} — ${data.customerName}` })
      })
      channel.bind('order-updated', ({ orderId, status }: { orderId: string; status: string }) => {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
      })
      cleanup = () => pusherClient.unsubscribe('private-orders')
    }).catch(() => {})

    return () => {
      clearInterval(interval)
      cleanup?.()
    }
  }, [fetchOrders])

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      setOrders((prev) =>
        status === 'COMPLETED'
          ? prev.filter((o) => o.id !== orderId)
          : prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      )
    } catch {
      toast.error('Failed to update status')
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Admin Nav */}
      <nav className="bg-[#111111] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Image src="/logo.png" alt="Crazy Chips" width={36} height={36} className="rounded-lg" />
          <div className="hidden sm:flex gap-6 text-sm text-white/60">
            <span className="text-white font-semibold">Dashboard</span>
            <Link href="/admin/orders" className="hover:text-white transition-colors">Orders</Link>
            <Link href="/admin/menu" className="hover:text-white transition-colors">Menu</Link>
            <Link href="/admin/promos" className="hover:text-white transition-colors">Promos</Link>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="text-sm text-white/40 hover:text-white transition-colors"
        >
          Sign Out
        </button>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black" style={{ fontFamily: 'var(--font-lilita)' }}>
            Live Orders
          </h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white/40 text-sm">Live</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-[#111111] rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-6xl mb-4">🍟</p>
            <p className="text-white/40 text-lg">No active orders</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-[#111111] rounded-2xl p-6 border border-white/5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-white">{order.orderNumber}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-white font-semibold">{order.customerName}</p>
                    <p className="text-white/40 text-xs">{order.customerPhone}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-lg font-semibold ${order.type === 'DELIVERY' ? 'bg-blue-900/50 text-blue-300' : 'bg-purple-900/50 text-purple-300'}`}>
                      {order.type}
                    </span>
                    <p className="text-white font-black text-xl mt-1">£{order.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-1 mb-4">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-white/60 text-sm">
                      {item.quantity}× {item.menuItem.name}
                    </p>
                  ))}
                </div>

                {order.notes && (
                  <p className="text-yellow-400/80 text-xs bg-yellow-400/5 rounded-lg px-3 py-2 mb-4">
                    📝 {order.notes}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-white/30 text-xs">
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                  </span>
                  {NEXT_STATUS[order.status] && (
                    <button
                      onClick={() => updateStatus(order.id, NEXT_STATUS[order.status])}
                      className="bg-[#E3000F] hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
                    >
                      Mark {NEXT_STATUS[order.status]}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
