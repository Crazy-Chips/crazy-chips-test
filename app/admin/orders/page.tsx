'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number
  type: string
  status: string
  createdAt: string
}

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-yellow-100 text-yellow-700',
  READY: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    if (typeFilter) params.set('type', typeFilter)

    fetch(`/api/admin/orders?${params}`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        setOrders(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [statusFilter, typeFilter])

  const exportCSV = () => {
    const headers = ['Order #', 'Customer', 'Email', 'Type', 'Status', 'Total', 'Date']
    const rows = orders.map((o) => [
      o.orderNumber,
      o.customerName,
      o.customerEmail,
      o.type,
      o.status,
      `£${o.total.toFixed(2)}`,
      new Date(o.createdAt).toLocaleDateString('en-GB'),
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `crazy-chips-orders-${Date.now()}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-28">
      <nav className="bg-[#111111] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Image src="/logo.png" alt="Crazy Chips" width={36} height={36} className="rounded-lg" />
          <div className="hidden sm:flex gap-6 text-sm text-white/60">
            <Link href="/admin/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <span className="text-white font-semibold">Orders</span>
            <Link href="/admin/menu" className="hover:text-white transition-colors">Menu</Link>
            <Link href="/admin/promos" className="hover:text-white transition-colors">Promos</Link>
          </div>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="text-sm text-white/40 hover:text-white">
          Sign Out
        </button>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-black" style={{ fontFamily: 'var(--font-lilita)' }}>Order History</h1>
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#E3000F]"
            >
              <option value="">All Statuses</option>
              {['NEW', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#E3000F]"
            >
              <option value="">All Types</option>
              <option value="DELIVERY">Delivery</option>
              <option value="COLLECTION">Collection</option>
            </select>
            <button
              onClick={exportCSV}
              className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="bg-[#111111] rounded-2xl overflow-hidden border border-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {['Order #', 'Customer', 'Type', 'Status', 'Total', 'Date'].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-white/40 font-semibold text-xs uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-white/30">Loading...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-white/30">No orders found</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-white">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-white/80">{order.customerName}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${order.type === 'DELIVERY' ? 'bg-blue-900/40 text-blue-300' : 'bg-purple-900/40 text-purple-300'}`}>
                        {order.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">£{order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-white/40">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
