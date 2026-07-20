'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

interface PromoCode {
  id: string
  code: string
  discountPercent: number
  active: boolean
  usageLimit?: number
  usageCount: number
  expiresAt?: string
  createdAt: string
}

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', discountPercent: 10, usageLimit: '', expiresAt: '', active: true })

  useEffect(() => {
    fetch('/api/admin/promos')
      .then((r) => r.json())
      .then((data) => { setPromos(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/admin/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          discountPercent: Number(form.discountPercent),
          usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
          expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        }),
      })
      const data = await res.json()
      setPromos((prev) => [data, ...prev])
      toast.success('Promo code created')
      setShowForm(false)
      setForm({ code: '', discountPercent: 10, usageLimit: '', expiresAt: '', active: true })
    } catch {
      toast.error('Failed to create promo')
    }
  }

  const toggleActive = async (promo: PromoCode) => {
    try {
      const res = await fetch('/api/admin/promos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: promo.id, active: !promo.active }),
      })
      const data = await res.json()
      setPromos((prev) => prev.map((p) => (p.id === promo.id ? data : p)))
    } catch {
      toast.error('Failed to update')
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-28">
      <nav className="bg-[#111111] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Image src="/logo.png" alt="Crazy Chips" width={36} height={36} className="rounded-lg" />
          <div className="hidden sm:flex gap-6 text-sm text-white/60">
            <Link href="/admin/dashboard" className="hover:text-white">Dashboard</Link>
            <Link href="/admin/orders" className="hover:text-white">Orders</Link>
            <Link href="/admin/menu" className="hover:text-white">Menu</Link>
            <span className="text-white font-semibold">Promos</span>
          </div>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="text-sm text-white/40 hover:text-white">
          Sign Out
        </button>
      </nav>

      <main className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black" style={{ fontFamily: 'var(--font-lilita)' }}>Promo Codes</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#E3000F] hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors"
          >
            <Plus size={16} /> New Code
          </button>
        </div>

        {showForm && (
          <div className="bg-[#111111] rounded-2xl p-6 mb-6 border border-white/10">
            <h2 className="text-lg font-bold mb-5">New Promo Code</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="Code (e.g. SUMMER20)"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E3000F] font-mono"
              />
              <input
                type="number"
                value={form.discountPercent}
                onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
                placeholder="Discount %"
                min="1"
                max="100"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E3000F]"
              />
              <input
                type="number"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                placeholder="Usage limit (optional)"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E3000F]"
              />
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E3000F]"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={handleCreate} className="bg-[#E3000F] hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors">
                Create
              </button>
              <button onClick={() => setShowForm(false)} className="bg-white/10 text-white px-6 py-2.5 rounded-xl hover:bg-white/20 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-[#111111] rounded-2xl h-20 animate-pulse" />
              ))
            : promos.map((promo) => (
                <div key={promo.id} className="bg-[#111111] rounded-2xl px-6 py-5 flex items-center justify-between border border-white/5">
                  <div className="flex items-center gap-5">
                    <span className="font-mono font-black text-xl text-white">{promo.code}</span>
                    <span className="bg-[#E3000F]/20 text-[#E3000F] text-sm font-bold px-3 py-1 rounded-full">
                      {promo.discountPercent}% off
                    </span>
                    <span className="text-white/40 text-xs">
                      {promo.usageCount}{promo.usageLimit ? `/${promo.usageLimit}` : ''} used
                    </span>
                    {promo.expiresAt && (
                      <span className="text-white/30 text-xs">
                        Expires {new Date(promo.expiresAt).toLocaleDateString('en-GB')}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleActive(promo)}
                    className={`text-xs px-4 py-2 rounded-full font-semibold transition-colors ${
                      promo.active
                        ? 'bg-green-900/40 text-green-400 hover:bg-red-900/40 hover:text-red-400'
                        : 'bg-gray-800 text-gray-400 hover:bg-green-900/40 hover:text-green-400'
                    }`}
                  >
                    {promo.active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              ))}
        </div>
      </main>
    </div>
  )
}
