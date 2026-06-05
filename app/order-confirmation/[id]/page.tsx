'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Clock, Package, ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const STATUS_STEPS = ['NEW', 'PREPARING', 'READY', 'COMPLETED']

interface Order {
  id: string
  orderNumber: string
  customerName: string
  total: number
  type: string
  status: string
  items: Array<{
    id: string
    quantity: number
    unitPrice: number
    subtotal: number
    menuItem: { name: string }
  }>
  createdAt: string
}

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string>('')

  useEffect(() => {
    params.then(({ id }) => {
      setId(id)
      fetch(`/api/orders/${id}`)
        .then((r) => r.json())
        .then((data) => {
          setOrder(data.order)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    })
  }, [params])

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-[#FAF7F2]">
          <div className="animate-spin w-8 h-8 border-4 border-[#E3000F] border-t-transparent rounded-full" />
        </main>
        <Footer />
      </>
    )
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-[#FAF7F2] py-32">
          <div className="text-center">
            <p className="text-gray-500">Order not found.</p>
            <Link href="/" className="text-[#E3000F] hover:underline mt-4 block">
              Return to home
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const statusIndex = STATUS_STEPS.indexOf(order.status)

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#FAF7F2] py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Success header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1
              className="text-4xl font-black text-[#0A0A0A] mb-2"
              style={{ fontFamily: 'var(--font-lilita)' }}
            >
              Order Confirmed!
            </h1>
            <p className="text-gray-500">
              Thanks {order.customerName}! Your order is on its way.
            </p>
            <div className="inline-flex items-center gap-2 bg-[#0A0A0A] rounded-full px-6 py-3 mt-4">
              <span className="text-white/60 text-sm">Order</span>
              <span className="text-white font-black text-lg tracking-wider font-mono">
                {order.orderNumber}
              </span>
            </div>
          </div>

          {/* Status tracker */}
          <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#0A0A0A] mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-lilita)' }}>
              <Clock size={20} className="text-[#E3000F]" />
              Order Status
            </h2>
            <div className="flex items-center justify-between">
              {STATUS_STEPS.slice(0, 3).map((step, i) => (
                <div key={step} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                      i <= statusIndex
                        ? 'bg-[#E3000F] text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {i < statusIndex ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs text-center font-medium ${i <= statusIndex ? 'text-[#E3000F]' : 'text-gray-400'}`}>
                    {step === 'NEW' ? 'Received' : step === 'PREPARING' ? 'Preparing' : 'Ready'}
                  </span>
                  {i < 2 && (
                    <div className={`absolute mt-5 ml-10 h-px w-[calc(33%-2rem)] ${i < statusIndex ? 'bg-[#E3000F]' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-6">
              {order.type === 'DELIVERY' ? '🚚 Estimated delivery: 25–35 minutes' : '🏃 Collection ready in: 15–20 minutes'}
            </p>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#0A0A0A] mb-5 flex items-center gap-2" style={{ fontFamily: 'var(--font-lilita)' }}>
              <Package size={20} className="text-[#E3000F]" />
              Order Items
            </h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.menuItem.name} × {item.quantity}
                  </span>
                  <span className="font-semibold text-[#0A0A0A]">£{item.subtotal.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-[#0A0A0A]">
                <span>Total</span>
                <span>£{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/menu"
              className="flex-1 flex items-center justify-center gap-2 bg-[#E3000F] hover:bg-red-700 text-white font-bold py-4 rounded-full transition-all duration-200 hover:scale-[1.02]"
            >
              Order Again <ArrowRight size={18} />
            </Link>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-[#0A0A0A] font-semibold py-4 rounded-full hover:border-gray-300 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
