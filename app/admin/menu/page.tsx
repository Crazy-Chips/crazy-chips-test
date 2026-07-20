'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl?: string
  available: boolean
  featured: boolean
}

const EMPTY: Omit<MenuItem, 'id'> = {
  name: '',
  description: '',
  price: 0,
  category: 'Chips',
  imageUrl: '',
  available: true,
  featured: false,
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetch('/api/admin/menu')
      .then((r) => r.json())
      .then((data) => { setItems(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  const handleSave = async () => {
    try {
      const url = editing ? `/api/admin/menu/${editing}` : '/api/admin/menu'
      const method = editing ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      })
      const data = await res.json()
      if (editing) {
        setItems((prev) => prev.map((i) => (i.id === editing ? data : i)))
      } else {
        setItems((prev) => [...prev, data])
      }
      toast.success(editing ? 'Item updated' : 'Item created')
      setShowForm(false)
      setEditing(null)
      setForm(EMPTY)
    } catch {
      toast.error('Failed to save item')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return
    try {
      await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' })
      setItems((prev) => prev.filter((i) => i.id !== id))
      toast.success('Item deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const toggleAvailable = async (item: MenuItem) => {
    try {
      const res = await fetch(`/api/admin/menu/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !item.available }),
      })
      const data = await res.json()
      setItems((prev) => prev.map((i) => (i.id === item.id ? data : i)))
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
            <span className="text-white font-semibold">Menu</span>
            <Link href="/admin/promos" className="hover:text-white">Promos</Link>
          </div>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="text-sm text-white/40 hover:text-white">
          Sign Out
        </button>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black" style={{ fontFamily: 'var(--font-lilita)' }}>Menu Management</h1>
          <button
            onClick={() => { setEditing(null); setForm(EMPTY); setShowForm(true) }}
            className="flex items-center gap-2 bg-[#E3000F] hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-[#111111] rounded-2xl p-6 mb-6 border border-white/10">
            <h2 className="text-lg font-bold mb-5">{editing ? 'Edit Item' : 'New Item'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E3000F]"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E3000F]"
              >
                {['Chips', 'Burgers', 'Sides', 'Drinks', 'Combos', 'Deals'].map((c) => (
                  <option key={c} value={c} className="bg-[#111111]">{c}</option>
                ))}
              </select>
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E3000F] sm:col-span-2"
              />
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                placeholder="Price (£)"
                step="0.01"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E3000F]"
              />
              <input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="Image URL"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E3000F]"
              />
            </div>
            <div className="flex items-center gap-6 mb-5">
              <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.checked })}
                  className="accent-[#E3000F]"
                />
                Available
              </label>
              <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="accent-[#E3000F]"
                />
                Featured (Bestsellers)
              </label>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} className="bg-[#E3000F] hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors">
                Save
              </button>
              <button onClick={() => setShowForm(false)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Items list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-[#111111] rounded-2xl h-48 animate-pulse" />
              ))
            : items.map((item) => (
                <div key={item.id} className="bg-[#111111] rounded-2xl overflow-hidden border border-white/5">
                  {item.imageUrl && (
                    <div className="relative h-36">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-white">{item.name}</h3>
                        <span className="text-xs text-white/30">{item.category}</span>
                      </div>
                      <span className="font-black text-white">£{item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-white/40 text-xs mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAvailable(item)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors ${
                          item.available ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'
                        }`}
                      >
                        {item.available ? <Eye size={12} /> : <EyeOff size={12} />}
                        {item.available ? 'Available' : 'Hidden'}
                      </button>
                      <button
                        onClick={() => {
                          setEditing(item.id)
                          setForm({ name: item.name, description: item.description, price: item.price, category: item.category, imageUrl: item.imageUrl || '', available: item.available, featured: item.featured })
                          setShowForm(true)
                        }}
                        className="p-1.5 text-white/40 hover:text-white transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-white/40 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </main>
    </div>
  )
}
