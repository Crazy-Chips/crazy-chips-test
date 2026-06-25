'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Minus, Plus, ShoppingBag, Tag, ArrowRight, Trash2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { toast } from 'sonner'

interface Props {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: Props) {
  const { items, promoCode, discount, updateQuantity, removeItem, applyPromo, clearPromo, subtotal, total } = useCart()
  const [promoInput, setPromoInput] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return
    setPromoLoading(true)
    try {
      const res = await fetch('/api/validate-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoInput.trim().toUpperCase() }),
      })
      const data = await res.json()
      if (data.valid) {
        applyPromo(data.code, data.discountPercent)
        toast.success(`${data.discountPercent}% discount applied!`)
        setPromoInput('')
      } else {
        toast.error(data.error || 'Invalid promo code')
      }
    } catch {
      toast.error('Failed to validate promo code')
    } finally {
      setPromoLoading(false)
    }
  }

  const sub = subtotal()
  const tot = total()
  const discountAmount = sub - tot

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}

      {/* Bottom-slide drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[24px] shadow-[0_-8px_40px_rgba(61,34,0,0.18)] flex flex-col transition-transform duration-300 ease-out max-h-[85vh] ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[#F5EDD8] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#F5EDD8]">
          <h2 className="text-[26px] text-[#3D2200]" style={{ fontFamily: 'var(--font-lilita)' }}>
            Your Order
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-[#FFF8EE] rounded-full flex items-center justify-center text-[#8a7a6a] hover:bg-[#F5EDD8] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <div className="text-5xl mb-2">🛒</div>
              <p className="text-[#3D2200] font-[800] text-base">Your cart is empty</p>
              <p className="text-[#8a7a6a] text-sm font-[500]">Add some items from the menu!</p>
              <button
                onClick={onClose}
                className="mt-2 bg-[#D92B2B] text-white font-[800] px-6 py-2.5 rounded-[11px] text-sm hover:bg-[#B01E1E] transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#F5EDD8]">
              {items.map((item) => {
                const extrasTotal = item.extras.reduce((s, e) => s + e.price, 0)
                const unitPrice = item.price + extrasTotal
                return (
                  <div key={item.menuItemId} className="flex gap-3 py-3">
                    {item.imageUrl ? (
                      <div className="relative w-14 h-14 rounded-[11px] overflow-hidden shrink-0 bg-[#FFF8EE]">
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-[11px] bg-[#FFF8EE] shrink-0 flex items-center justify-center text-2xl">
                        🍟
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-[800] text-sm text-[#3D2200] leading-tight">{item.name}</h4>
                        <button
                          onClick={() => removeItem(item.menuItemId)}
                          className="text-[#F5EDD8] hover:text-[#D92B2B] transition-colors shrink-0"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      {item.extras.length > 0 && (
                        <p className="text-xs text-[#8a7a6a] mt-0.5 font-[500]">
                          + {item.extras.map(e => e.name).join(', ')}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5 bg-[#FFF8EE] rounded-full px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                            className="w-5 h-5 flex items-center justify-center text-[#8a7a6a] hover:text-[#D92B2B]"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="text-xs font-[900] w-4 text-center text-[#3D2200]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center text-[#8a7a6a] hover:text-[#D92B2B]"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <span
                          className="text-lg text-[#D92B2B]"
                          style={{ fontFamily: 'var(--font-lilita)' }}
                        >
                          £{(unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-[#F5EDD8] space-y-3 bg-[#FFF8EE]">
            {/* Promo */}
            {promoCode ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-[11px] px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <Tag size={13} className="text-green-600" />
                  <span className="text-sm font-[800] text-green-700">{promoCode} — {discount}% off</span>
                </div>
                <button onClick={clearPromo} className="text-xs text-[#8a7a6a] hover:text-[#D92B2B] font-[700]">
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  placeholder="Promo code"
                  className="flex-1 text-sm border-2 border-[#F5EDD8] bg-white rounded-[11px] px-3 py-2.5 focus:outline-none focus:border-[#D92B2B] font-[700] text-[#3D2200] placeholder:text-[#c4b49a] placeholder:font-[600]"
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={promoLoading}
                  className="bg-[#3D2200] hover:bg-[#5c3600] text-white text-sm font-[800] px-4 py-2.5 rounded-[11px] transition-colors disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            )}

            {/* Totals */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#8a7a6a] font-[600]">
                <span>Subtotal</span>
                <span>£{sub.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-[700]">
                  <span>Discount ({discount}%)</span>
                  <span>−£{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-[#F5EDD8]">
                <span className="font-[800] text-lg text-[#3D2200]">Total</span>
                <span className="text-2xl text-[#D92B2B]" style={{ fontFamily: 'var(--font-lilita)' }}>
                  £{tot.toFixed(2)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="flex items-center justify-between w-full bg-[#D92B2B] hover:bg-[#B01E1E] text-white font-[800] py-3.5 px-5 rounded-[13px] transition-all duration-200 shadow-[0_4px_14px_rgba(217,43,43,.35)]"
            >
              <span>Go to Checkout</span>
              <span className="bg-white/20 px-2.5 py-1 rounded-[8px] text-sm">£{tot.toFixed(2)}</span>
            </Link>
            <p className="text-center text-xs text-[#8a7a6a] font-[600]">Prices include VAT · Secure payment</p>
          </div>
        )}
      </div>
    </>
  )
}
