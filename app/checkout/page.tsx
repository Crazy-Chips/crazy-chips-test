'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/hooks/useCart'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { toast } from 'sonner'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({ clientSecret, formData, onSuccess }: {
  clientSecret: string
  formData: Record<string, string>
  onSuccess: (orderId: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const { items, promoCode, total, clearCart } = useCart()
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + '/order-confirmation' },
      redirect: 'if_required',
    })

    if (error) {
      toast.error(error.message || 'Payment failed')
      setProcessing(false)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      // Create order in DB
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            promoCode,
            type: formData.type,
            customerDetails: {
              customerName: formData.customerName,
              customerEmail: formData.customerEmail,
              customerPhone: formData.customerPhone,
              type: formData.type,
              address: formData.address,
              postcode: formData.postcode,
              notes: formData.notes,
            },
            stripePaymentId: paymentIntent.id,
          }),
        })
        const data = await res.json()
        clearCart()
        router.push(`/order-confirmation/${data.order.id}`)
      } catch {
        toast.error('Order confirmed but failed to save — contact us with your payment reference')
      }
    }

    setProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        type="submit"
        disabled={processing || !stripe}
        className="w-full bg-[#E3000F] hover:bg-red-700 text-white font-bold py-4 rounded-full text-base transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
      >
        {processing ? 'Processing...' : `Pay £${total().toFixed(2)}`}
      </button>
      <p className="text-center text-xs text-gray-400">Prices include VAT · Secure payment by Stripe</p>
    </form>
  )
}

export default function CheckoutPage() {
  const { items, promoCode, discount, subtotal, total } = useCart()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [step, setStep] = useState<'details' | 'payment'>('details')
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    type: 'COLLECTION',
    address: '',
    postcode: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const sub = subtotal()
  const tot = total()
  const discountAmt = sub - tot

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!items.length) return

    setLoading(true)
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          promoCode,
          type: formData.type,
          customerDetails: formData,
        }),
      })
      const data = await res.json()
      if (data.clientSecret) {
        setClientSecret(data.clientSecret)
        setStep('payment')
      } else {
        toast.error(data.error || 'Failed to initialise payment')
      }
    } catch {
      toast.error('Failed to initialise payment')
    } finally {
      setLoading(false)
    }
  }

  if (!items.length) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-[#FAF7F2] py-32">
          <div className="text-center">
            <p className="text-5xl mb-4">🛒</p>
            <h1 className="text-2xl font-black text-[#0A0A0A] mb-4" style={{ fontFamily: 'var(--font-lilita)' }}>
              Your cart is empty
            </h1>
            <button
              onClick={() => router.push('/menu')}
              className="bg-[#E3000F] text-white font-bold px-8 py-3 rounded-full hover:bg-red-700 transition-colors"
            >
              Browse the menu
            </button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#FAF7F2] py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-4xl font-black text-[#0A0A0A] mb-10"
            style={{ fontFamily: 'var(--font-lilita)' }}
          >
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              {step === 'details' ? (
                <form onSubmit={handleProceedToPayment} className="bg-white rounded-2xl p-8 space-y-6 shadow-sm">
                  <h2 className="text-xl font-bold text-[#0A0A0A]" style={{ fontFamily: 'var(--font-lilita)' }}>
                    Your Details
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                      <input
                        required
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E3000F] transition-colors"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone *</label>
                      <input
                        required
                        type="tel"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E3000F] transition-colors"
                        placeholder="07700 900000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                    <input
                      required
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E3000F] transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Delivery/Collection toggle */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Order Type *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['COLLECTION', 'DELIVERY'].map((t) => (
                        <label
                          key={t}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            formData.type === t
                              ? 'border-[#E3000F] bg-[#E3000F]/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="type"
                            value={t}
                            checked={formData.type === t}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="accent-[#E3000F]"
                          />
                          <span className="text-sm font-semibold text-[#0A0A0A] capitalize">
                            {t === 'COLLECTION' ? '🏃 Collection' : '🚚 Delivery'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.type === 'DELIVERY' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address *</label>
                        <input
                          required={formData.type === 'DELIVERY'}
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E3000F] transition-colors"
                          placeholder="123 High Street"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Postcode *</label>
                        <input
                          required={formData.type === 'DELIVERY'}
                          value={formData.postcode}
                          onChange={(e) => setFormData({ ...formData, postcode: e.target.value.toUpperCase() })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E3000F] transition-colors"
                          placeholder="DE1 1AA"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Order Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any special instructions or allergies..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E3000F] transition-colors resize-none"
                      rows={3}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#E3000F] hover:bg-red-700 text-white font-bold py-4 rounded-full text-base transition-all duration-200 disabled:opacity-60"
                  >
                    {loading ? 'Loading...' : 'Continue to Payment'}
                  </button>
                </form>
              ) : (
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#0A0A0A]" style={{ fontFamily: 'var(--font-lilita)' }}>
                      Payment
                    </h2>
                    <button
                      onClick={() => setStep('details')}
                      className="text-sm text-[#E3000F] hover:underline"
                    >
                      ← Back
                    </button>
                  </div>

                  {clientSecret && (
                    <Elements
                      stripe={stripePromise}
                      options={{ clientSecret, appearance: { theme: 'stripe' } }}
                    >
                      <CheckoutForm
                        clientSecret={clientSecret}
                        formData={formData}
                        onSuccess={() => {}}
                      />
                    </Elements>
                  )}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-bold text-[#0A0A0A] mb-5" style={{ fontFamily: 'var(--font-lilita)' }}>
                  Order Summary
                </h2>

                <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.menuItemId} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} × {item.quantity}
                        {item.extras.length > 0 && (
                          <span className="block text-xs text-gray-400">
                            + {item.extras.map((e) => e.name).join(', ')}
                          </span>
                        )}
                      </span>
                      <span className="font-semibold text-[#0A0A0A] shrink-0 ml-2">
                        £{((item.price + item.extras.reduce((s, e) => s + e.price, 0)) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>£{sub.toFixed(2)}</span>
                  </div>
                  {discountAmt > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discount}%)</span>
                      <span>-£{discountAmt.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-black text-lg text-[#0A0A0A] pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>£{tot.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-400 text-center">Prices include VAT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
